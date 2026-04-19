import dotenv from 'dotenv';
dotenv.config();
import { generateResponseStream } from '../src/services/ai.service.js';

async function testControllerFlow() {
    const mockMessages = [
        { role: 'user', content: 'What is the weather in Paris?' }
    ];

    console.log("Starting Controller Flow Test...");
    try {
        const stream = generateResponseStream(mockMessages, (text) => {
            console.log("\nFinished callback called with text length:", text.length);
        });

        console.log("Stream generated. Consuming fullStream...");
        for await (const chunk of stream.fullStream) {
            console.log("Chunk type:", chunk.type);
            if (chunk.type === 'text-delta') {
                process.stdout.write(chunk.textDelta);
            } else if (chunk.type === 'tool-call') {
                console.log("Tool Call:", chunk.toolName, chunk.args);
            } else if (chunk.type === 'tool-result') {
                console.log("Tool Result returned from:", chunk.toolName);
            }
        }
        console.log("\nTest Completed successfully.");
    } catch (err) {
        console.error("\nTest Failed with error:", err);
    }
}

testControllerFlow();
