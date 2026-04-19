import dotenv from 'dotenv';
dotenv.config();
import { streamText } from 'ai';
import { createMistral } from '@ai-sdk/mistral';

const mistral = createMistral({
    apiKey: process.env.MISTRAL_API_KEY
});

async function testMistral() {
    try {
        console.log("Testing Mistral AI (mistral-large-latest)...");
        const result = await streamText({
            model: mistral('mistral-large-latest'),
            messages: [{ role: 'user', content: 'Say hello!' }],
        });
        console.log("Stream started successfully");
        for await (const chunk of result.textStream) {
            process.stdout.write(chunk);
        }
        console.log("\nStream finished.");
    } catch (err) {
        console.error("Mistral test failed:", err.message);
        if (err.data) console.log("Error data:", JSON.stringify(err.data));
    }
}

testMistral();
