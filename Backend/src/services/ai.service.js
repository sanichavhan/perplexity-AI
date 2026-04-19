import dotenv from 'dotenv';
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage, AIMessage, tool as langchainTool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

// Vercel AI SDK Setup
import { streamText, tool as vercelTool } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';

const googleAI = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
});

const mistralAI = createMistral({
    apiKey: process.env.MISTRAL_API_KEY
});

let geminiModel = null;
let mistralModel = null;
let agent = null;

const getGeminiModel = () => {
    if (!geminiModel) {
        geminiModel = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            apiKey: process.env.GEMINI_API_KEY
        });
    }
    return geminiModel;
}

const getMistralModel = () => {
    if (!mistralModel) {
        mistralModel = new ChatMistralAI({
            model: "mistral-medium-latest",
            apiKey: process.env.MISTRAL_API_KEY
        })
    }
    return mistralModel;
}

const getAgent = () => {
    if (!agent) {
        const searchInternetTool = langchainTool(
            searchInternet,
            {
                name: "searchInternet",
                description: "Use this tool to get the latest information from the internet.",
                schema: z.object({
                    query: z.string().describe("The search query to look up on the internet.")
                })
            }
        )

        agent = createAgent({
            model: getMistralModel(),
            tools: [ searchInternetTool ],
        })
    }
    return agent;
}

export function generateResponseStream(messages, onFinishCallback) {
    const aiMessages = messages.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : msg.role,
        content: msg.content
    }));

    return streamText({
        model: mistralAI("mistral-large-latest"),
        maxSteps: 3,
        system: `
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
        `,
        messages: aiMessages,
        tools: {
            searchInternet: vercelTool({
                description: "Use this tool to get the latest information from the internet.",
                parameters: z.object({ query: z.string().describe("The search query to look up on the internet.") }),
                execute: async ({ query }) => {
                    const result = await searchInternet({ query });
                    return result;
                }
            })
        },
        onFinish: async ({ text }) => {
            if (onFinishCallback) {
                await onFinishCallback(text);
            }
        }
    });
}

// keeping the old function for backward compatibility if needed, though we will migrate chat.controller
export async function generateResponse(messages) {
    console.log(messages)

    const currentAgent = getAgent();
    const response = await currentAgent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
            ...(messages.map(msg => {
                if (msg.role == "user") {
                    return new HumanMessage(msg.content)
                } else if (msg.role == "ai") {
                    return new AIMessage(msg.content)
                }
            })) ]
    });

    return response.messages[ response.messages.length - 1 ].text;

}

export async function generateChatTitle(message) {

    const response = await getMistralModel().invoke([
        new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `)
    ])

    return response.text;

}
