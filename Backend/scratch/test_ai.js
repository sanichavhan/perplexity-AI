import dotenv from 'dotenv';
dotenv.config();
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function test() {
    try {
        const result = await streamText({
            model: googleAI("gemini-1.5-flash"),
            messages: [{ role: 'user', content: 'hello' }],
        });
        console.log("Stream started successfully");
        for await (const chunk of result.textStream) {
            console.log("Chunk:", chunk);
        }
    } catch (err) {
        console.error("Test failed:", err);
    }
}

test();
