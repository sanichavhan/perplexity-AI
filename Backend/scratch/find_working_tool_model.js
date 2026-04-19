import dotenv from 'dotenv';
dotenv.config();
import { streamText, tool as vercelTool } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import * as z from 'zod';

const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
});

const mistralAI = createMistral({
    apiKey: process.env.MISTRAL_API_KEY
});

async function testModel(modelInstance, name) {
    console.log(`\nTesting ${name}...`);
    try {
        const stream = await streamText({
            model: modelInstance,
            maxSteps: 2,
            messages: [{ role: 'user', content: 'Search for the weather in Tokyo.' }],
            tools: {
                searchInternet: vercelTool({
                    description: "Search the internet",
                    parameters: z.object({ query: z.string() }),
                    execute: async ({ query }) => {
                        console.log(`   Model ${name} successfully called searchInternet with: "${query}"`);
                        return { result: "Sunny, 22 degrees" };
                    }
                })
            }
        });

        for await (const chunk of stream.fullStream) {
            if (chunk.type === 'text-delta') process.stdout.write(chunk.textDelta);
        }
        console.log(`\nSuccess with ${name}`);
        return true;
    } catch (err) {
        console.error(`Failed ${name}:`, err.message);
        return false;
    }
}

async function run() {
    await testModel(mistralAI('mistral-large-latest'), 'Mistral Large');
    await testModel(googleAI('gemini-1.5-flash'), 'Gemini 1.5 Flash');
    await testModel(googleAI('gemini-1.5-pro'), 'Gemini 1.5 Pro');
    await testModel(googleAI('gemini-2.0-flash-exp'), 'Gemini 2.0 Flash Exp');
}

run();
