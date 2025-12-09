
import { GoogleGenAI } from "@google/genai";
import { Asset } from "../types";

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
    // Fallback if no API key is present for the demo
    return `${asset.name} is showing ${asset.verdict} signals. Momentum is at ${asset.momentum}%. Market volatility is ${asset.volatility}.`;
  }

  const prompt = `
    Analyze the following market data for the cryptocurrency ${asset.name} (${asset.symbol}):
    - Price: $${asset.price}
    - 24h Change: ${asset.change24h}%
    - Momentum Score: ${asset.momentum}/100
    - Technical Verdict: ${asset.verdict}
    - Volatility: ${asset.volatility}
    
    Provide a concise, one-sentence professional trading summary formatted for a financial dashboard. Focus on the actionability of the trade.
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

export const getMarketOverview = async (assets: Asset[]): Promise<string> => {
  const ai = getAIClient();
  
  // Format data for the prompt
  const marketData = assets.map(a => 
    `${a.symbol}: ${a.change24h}% (${a.verdict}, Vol: ${a.volatility})`
  ).join('\n');

  const topGainer = [...assets].sort((a,b) => b.change24h - a.change24h)[0];
  const btc = assets.find(a => a.symbol === 'BTC');

  if (!ai) {
    return `Market Sentiment is mixed. ${topGainer?.symbol || 'Crypto'} is leading with strong gains, while major caps like BTC ${btc?.change24h && btc.change24h > 0 ? 'consolidate upwards' : 'face resistance'}. Traders should watch for volatility spikes in mid-cap assets.`;
  }

  const prompt = `
    You are a professional financial analyst for a crypto terminal.
    Analyze this snapshot of the current crypto market:
    
    ${marketData}
    
    Provide a 3-paragraph executive summary:
    1. Overall Market Sentiment (Bullish/Bearish/Neutral and why).
    2. Key Outliers (Who is pumping/dumping and the technical context).
    3. Forward-looking Strategy (What should a trader focus on right now? e.g., "Rotation into altcoins" or "Safety in BTC").
    
    Keep it professional, concise, and actionable. Do not use asterisks or markdown formatting like bolding.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Market analysis unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Market Analysis temporarily unavailable due to connectivity issues.";
  }
};
