import dotenv from 'dotenv';
dotenv.config();
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function test() {
    try {
        console.log("Testing gemini-2.0-flash...");
        const result = await streamText({
            model: googleAI("gemini-2.0-flash"),
            messages: [{ role: 'user', content: 'hello' }],
        });
        console.log("Stream started successfully");
        for await (const chunk of result.textStream) {
            console.log("Chunk:", chunk);
        }
    } catch (err) {
        console.error("Test failed:", err.message);
        if (err.data) console.log("Error data:", JSON.stringify(err.data));
    }
}

test();
