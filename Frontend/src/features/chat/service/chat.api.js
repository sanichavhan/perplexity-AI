import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})


export const sendMessageStream = async ({ message, chatId, onStart, onChunk, onDone }) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, chat: chatId }),
    });

    const newChatId = response.headers.get("x-chat-id");
    let newChatTitle = response.headers.get("x-chat-title");
    if (newChatTitle) newChatTitle = decodeURIComponent(newChatTitle);

    if (onStart) onStart(newChatId, newChatTitle);

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (onChunk) onChunk(chunk, newChatId);
    }
    
    if (onDone) onDone(newChatId, newChatTitle);
    return { newChatId, title: newChatTitle };
}

export const getChats = async () => {
    const response = await api.get("/api/chats")
    return response.data
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}

