import { tavily as Tavily } from "@tavily/core"

let tavily = null;

const getTavily = () => {
    if (!tavily) {
        tavily = Tavily({
            apiKey: process.env.TAVILY_API_KEY,
        })
    }
    return tavily;
}

export const searchInternet = async ({ query }) => {
    const tavilyClient = getTavily();
    const results = await tavilyClient.search(query, {
        maxResults: 5,
    })

    console.log(JSON.stringify(results))

    return JSON.stringify(results)
}