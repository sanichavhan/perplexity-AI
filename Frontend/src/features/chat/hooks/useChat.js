import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessageStream, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages, updateLastMessage } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true));
        
        await sendMessageStream({
            message,
            chatId,
            onStart: (newChatId, title) => {
                dispatch(setLoading(false));
                if (!chatId) {
                    dispatch(createNewChat({
                        chatId: newChatId,
                        title: title,
                    }));
                }
                const actualChatId = chatId || newChatId;
                dispatch(setCurrentChatId(actualChatId));
                dispatch(addNewMessage({
                    chatId: actualChatId,
                    content: message,
                    role: "user",
                }));
                dispatch(addNewMessage({
                    chatId: actualChatId,
                    content: "",
                    role: "ai",
                }));
            },
            onChunk: (chunk, newChatId) => {
                dispatch(updateLastMessage({
                    chatId: chatId || newChatId,
                    content: chunk,
                }));
            },
            onDone: () => {
                dispatch(setLoading(false));
            }
        });
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        console.log(chats[ chatId ]?.messages.length)

        if (chats[ chatId ]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }

}