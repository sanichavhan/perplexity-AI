import axios from 'axios';
import { generateResponseStream } from './src/services/ai.service.js';

// No, let's just test using fetch in Node
async function test() {
    const res = await fetch("http://localhost:3000/api/chats/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "hello, what is 2+2?" })
    });
    console.log("Headers:", res.headers.get("x-chat-id"), res.headers.get("x-chat-title"));
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        console.log("Chunk:", decoder.decode(value, { stream: true }));
    }
}
test();
