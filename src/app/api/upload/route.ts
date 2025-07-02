import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PropertyType } from '@/components/table/table-constants';
// import { HttpsProxyAgent } from 'https-proxy-agent';
// import fetch from 'node-fetch';

// const agent = new HttpsProxyAgent('http://127.0.0.1:7890');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
//   fetch: (url, options) => fetch(url, { ...options, agent }),
});

function generateSystemPrompt(propertyType: PropertyType, propertyTitle: string): string {
    switch (propertyType) {
        case 'text':
            return `You are an expert in content summarization. Generate a concise, clear summary for the property "${propertyTitle}". The summary should be a single, well-formed paragraph.`;
        case 'tag':
            return `Your task is to identify the single most relevant category for the property "${propertyTitle}" from the provided text. You MUST return ONLY the single category name. Do not include prefixes, explanations, or any other text. For example, if the category is "Finance", return ONLY "Finance".`;
        case 'bulleted-list':
            return `You are an expert in structuring information. Summarize the key points for "${propertyTitle}" as a Markdown bulleted list. The response MUST start directly with a hyphen (-) or an asterisk (*).`;
        case 'yes-no':
            return `Analyze the text for the property "${propertyTitle}". You MUST respond with ONLY "Yes" or "No". Do not add any other words, explanations, or punctuation.`;
        case 'date':
            return `Your task is to find the specific date for "${propertyTitle}" in the provided text. You MUST return ONLY the date in YYYY-MM-DD format. If no specific date is found, you MUST return ONLY the string 'N/A'. Do not provide any explanations or surrounding text.`;
        default:
            return `You are a helpful assistant. Process the content based on the property "${propertyTitle}".`;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { fileContent, propertyType, propertyTitle, customPrompt } = await request.json();

        if (!fileContent || !propertyType || !propertyTitle) {
            return NextResponse.json({ error: 'Missing fileContent, propertyType, or propertyTitle' }, { status: 400 });
        }

        // const MAX_CONTENT_LENGTH = 15000; // Limit content to ~15k chars to stay within token limits
        // let truncatedContent = fileContent;
        // if (fileContent.length > MAX_CONTENT_LENGTH) {
        //     console.warn(`Content length (${fileContent.length}) exceeds max length (${MAX_CONTENT_LENGTH}). Truncating.`);
        //     truncatedContent = fileContent.substring(0, MAX_CONTENT_LENGTH);
        // }
        
        // 这是一个模拟处理过程：
        const userPrompt = customPrompt 
            ? `${customPrompt}\n\nAnalyze the following content:\n\n${fileContent}`
            : fileContent;

        const systemPrompt = customPrompt 
            ? `You are a helpful assistant executing user's instructions precisely. Return only the requested output.`
            : generateSystemPrompt(propertyType, propertyTitle);

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ],
            temperature: 0.5,
        });

        const result = completion.choices[0].message.content?.trim() ?? 'No response';

        return NextResponse.json({ result });

    } catch (error) {
        console.error('API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Failed to process request', details: errorMessage }, { status: 500 });
    }
} 