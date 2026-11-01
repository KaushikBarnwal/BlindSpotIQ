import { GoogleGenAI } from "@google/genai";

export type LLMProviderType = "gemini" | "groq" | "auto";

export interface LLMResponse {
  rawJsonText: string;
  providerUsed: "gemini" | "groq";
  modelUsed: string;
}

export async function callDualProviderLLM(
  prompt: string,
  preferredProvider?: LLMProviderType
): Promise<LLMResponse | null> {
  const envProvider = (process.env.LLM_PROVIDER as LLMProviderType) || "auto";
  const targetProvider = preferredProvider || envProvider;

  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const hasGemini = Boolean(geminiKey && geminiKey !== "your_gemini_api_key_here");
  const hasGroq = Boolean(groqKey && groqKey !== "your_groq_api_key_here");

  if (!hasGemini && !hasGroq) {
    console.warn("Neither GEMINI_API_KEY nor GROQ_API_KEY is configured.");
    return null;
  }

  // Determine provider order
  const providerOrder: Array<"gemini" | "groq"> = [];
  if (targetProvider === "groq") {
    if (hasGroq) providerOrder.push("groq");
    if (hasGemini) providerOrder.push("gemini");
  } else if (targetProvider === "gemini") {
    if (hasGemini) providerOrder.push("gemini");
    if (hasGroq) providerOrder.push("groq");
  } else {
    // "auto": prioritize Gemini for large-context schema compliance, or Groq if Gemini is absent
    if (hasGemini) providerOrder.push("gemini");
    if (hasGroq) providerOrder.push("groq");
  }

  let lastError: any = null;

  for (const provider of providerOrder) {
    try {
      if (provider === "groq" && groqKey) {
        const primaryModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
        const candidateModels = [primaryModel, "openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
        const uniqueModels = Array.from(new Set(candidateModels));

        for (const groqModel of uniqueModels) {
          try {
            console.log(`[BlindspotIQ] Invoking Groq engine with model: ${groqModel}...`);

            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${groqKey}`,
              },
              body: JSON.stringify({
                model: groqModel,
                messages: [
                  {
                    role: "system",
                    content:
                      "You are BlindspotIQ core intelligence. Always output strictly valid JSON matching the exact schema requested.",
                  },
                  {
                    role: "user",
                    content: prompt,
                  },
                ],
                response_format: { type: "json_object" },
                temperature: 0.1,
              }),
            });

            if (!res.ok) {
              const errText = await res.text();
              if (res.status === 404 || errText.includes("model_not_found")) {
                console.warn(`[BlindspotIQ] Model ${groqModel} not available on this Groq account, trying next candidate...`);
                continue;
              }
              if (res.status === 429) {
                console.warn(
                  "[BlindspotIQ] Groq LPU rate limit encountered (30 RPM quota). Seamlessly switching to fallback provider..."
                );
              }
              throw new Error(`Groq API returned status ${res.status}: ${errText}`);
            }

            const data = await res.json();
            const content = data.choices?.[0]?.message?.content?.trim();

            if (content) {
              return {
                rawJsonText: content,
                providerUsed: "groq",
                modelUsed: groqModel,
              };
            }
          } catch (modelErr: any) {
            console.warn(`[BlindspotIQ] Groq model ${groqModel} attempt failed:`, modelErr?.message || modelErr);
            if (groqModel === uniqueModels[uniqueModels.length - 1]) {
              throw modelErr;
            }
          }
        }
      }

      if (provider === "gemini" && geminiKey) {
        console.log("[BlindspotIQ] Invoking Google Gemini 2.5 Flash engine...");
        const ai = new GoogleGenAI({ apiKey: geminiKey });

        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          const text = response.text?.trim();
          if (text) {
            return {
              rawJsonText: text,
              providerUsed: "gemini",
              modelUsed: "gemini-2.5-flash",
            };
          }
        } catch (geminiErr: any) {
          const isRateLimit =
            geminiErr?.status === 429 ||
            String(geminiErr?.message || "").includes("429") ||
            String(geminiErr?.message || "").includes("RESOURCE_EXHAUSTED");

          if (isRateLimit) {
            console.warn(
              "[BlindspotIQ] Google Gemini 2.5 Flash rate limit encountered (15 RPM / 1M TPM). Seamlessly switching to Groq LPU (llama-3.3-70b-versatile)..."
            );
          }
          throw geminiErr;
        }
      }
    } catch (err: any) {
      console.warn(`[BlindspotIQ] Provider ${provider} attempt failed:`, err?.message || err);
      lastError = err;
    }
  }

  if (lastError) {
    console.error("[BlindspotIQ] All configured AI providers failed:", lastError);
  }
  return null;
}
