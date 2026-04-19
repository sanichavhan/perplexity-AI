import dotenv from 'dotenv';
dotenv.config();
import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
});

async function testModel(modelName) {
    console.log(`Testing ${modelName}...`);
    try {
        const result = await streamText({
            model: googleAI(modelName),
            messages: [{ role: 'user', content: 'hi' }],
        });
        console.log(`Success with ${modelName}`);
        return true;
    } catch (err) {
        console.error(`Failed ${modelName}:`, err.message);
        return false;
    }
}

async function runTests() {
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-2.0-flash-exp",
        "gemini-1.0-pro"
    ];
    for (const m of models) {
        await testModel(m);
    }
}

runTests();
