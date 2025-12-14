import "dotenv/config";

// 1. Get the custom identity from the environment
const CUSTOM_BOT_IDENTITY = process.env.CUSTOM_BOT_IDENTITY;

const getOpenAPIResponse = async (message) => {
    // 2. Define the System Message object
    const systemMessage = {
        role: "system",
        content: CUSTOM_BOT_IDENTITY 
    };
    
    // 3. Construct the messages array with the System Message first
    const messagesArray = [
        systemMessage,
        {
            role: "user",
            content: message
        }
        // NOTE: If you implement conversation history later, 
        // it would go between systemMessage and the user's message.
    ];

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            // 4. Use the new array with the custom identity
            messages: messagesArray 
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        
        if (!response.ok) {
            // Handle HTTP errors specifically
            const errorData = await response.json();
            throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (err) {
        console.error("Error during OpenAI request:", err);
        // Throw an error so your route handler can catch it and send a 500 status
        throw err; 
    }
}

export default getOpenAPIResponse;