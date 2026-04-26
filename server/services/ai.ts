import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';

export const parseUnstructuredNeed = async (text: string) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not set. Returning mock parsed data.");
      return {
        title: "Parsed Request",
        category: "Resource",
        urgency: 3,
        location: [28.61, 77.2]
      };
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro-latest",
      maxOutputTokens: 2048,
      apiKey: apiKey,
    });

    const prompt = `Extract the following details from the text in JSON format: { "title": string, "category": string, "urgency": number (1-5), "location": [lat, lng] }.
    Text: ${text}`;

    const res = await model.invoke([new HumanMessage(prompt)]);
    
    let resultText = res.content.toString();
    resultText = resultText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    return JSON.parse(resultText);
  } catch (error) {
    console.error('AI Parsing Error:', error);
    throw error;
  }
};
