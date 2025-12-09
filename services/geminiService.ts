
import { GoogleGenAI, Type } from "@google/genai";
import { Asset, AIInsight } from "../types";

// Helper to get the AI instance
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getAssetSummary = async (asset: Asset): Promise<string> => {
  const ai = getAIClient();
  
  if (!ai) {
    return `${asset.name} is showing ${asset.verdict} signals. Momentum is at ${asset.momentum}%. Market volatility is ${asset.volatility}.`;
  }

  const prompt = `
    Analyze the following market data for the cryptocurrency ${asset.name} (${asset.symbol}):
    - Price: $${asset.price}
    - 24h Change: ${asset.change24h}%
    - Momentum Score: ${asset.momentum}/100
    - Technical Verdict: ${asset.verdict}
    - Volatility: ${asset.volatility}
    
    Provide a concise, one-sentence professional trading summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Analysis temporarily unavailable.";
  }
};

export interface MarketAnalysisResult {
  summary: string;
  insights: AIInsight[];
}

export const getMarketOverview = async (assets: Asset[]): Promise<MarketAnalysisResult> => {
  const ai = getAIClient();
  
  // Format data for the prompt
  const marketData = assets.map(a => 
    `${a.symbol}: ${a.change24h}% (${a.verdict}, Vol: ${a.volatility})`
  ).join('\n');

  if (!ai) {
    return {
      summary: "Demo Mode: API Key missing. Market shows mixed signals with volatility in high-cap assets.",
      insights: [
        { asset: "BTC", prediction: "Consolidation likely", confidence: "High", action: "Hold" },
        { asset: "ETH", prediction: "Support test incoming", confidence: "Medium", action: "Watch" }
      ]
    };
  }

  const prompt = `
    Analyze this crypto market snapshot:
    ${marketData}
    
    Return a JSON object with:
    1. "summary": A 3-paragraph executive summary (Sentiment, Outliers, Strategy).
    2. "insights": An array of 3-5 specific trade signals. Each insight must have:
       - "asset": Symbol (e.g. BTC)
       - "prediction": Short concise prediction (e.g. "Breakout above 65k")
       - "confidence": High, Medium, or Low
       - "action": Buy, Sell, Hold, or Watch
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  asset: { type: Type.STRING },
                  prediction: { type: Type.STRING },
                  confidence: { type: Type.STRING },
                  action: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    const data = JSON.parse(jsonText) as MarketAnalysisResult;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: "AI Market Analysis temporarily unavailable due to connectivity or quota limits.",
      insights: []
    };
  }
};
