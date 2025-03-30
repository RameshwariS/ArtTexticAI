import React, { useRef, useState, useEffect } from 'react'
import './main.css'
import ArtifyAi from '../../Artify/ArtifyAi';

// import App from '../../ArtifyAI/artify-ai/src/App';

const MainChat = () => {
    const inpRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = "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";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            generateAns();
        }
    };

    const generateAns = async () => {
        const inputTxt = inpRef.current.value.trim();
        if (inputTxt === '') return;

        // Add user's message to the messages array
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'user', text: inputTxt },
        ]);

        setLoading(true);

        try {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(inputTxt),
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            const aiMessage = result[0]?.summary_text || "Sorry, I couldn't generate text.";
            
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'ai', text: aiMessage },
            ]);
            
            inpRef.current.value = "";
        } catch (error) {
            console.error("Error generating text:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'ai', text: "Sorry, there was an error processing your request. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <div className="view-main">
                <div className="messages">
                    <div className="ai">
                        <p>Hi! I'm your AI assistant. How can I help you today?</p>
                    </div>
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.type}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                    {loading && (
                        <div className="loading">
                            <p>Processing your request...</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="input">
                <input 
                    type="text" 
                    ref={inpRef} 
                    placeholder='Type your message here...' 
                    disabled={loading}
                    onKeyPress={handleKeyPress}
                />
                <button 
                    onClick={generateAns}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Send"}
                </button>
            </div>
        </div>
    );
};

export default MainChat;