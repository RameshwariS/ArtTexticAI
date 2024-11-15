import React, { useRef, useState } from 'react'
import './main.css'
import ArtifyAi from '../../Artify/ArtifyAi';

// import App from '../../ArtifyAI/artify-ai/src/App';

const MainChat = () => {
   
    let inpRef = useRef(null);
    let token = "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"
    let inputTxt = "";
    // let [ans, setAns] = useState('')
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
   
    //function for API
    const generateAns = async () => {
       
        inputTxt = inpRef.current.value;
        if (inputTxt === '') return;
        // Add user's message to the messages array
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'user', text: inputTxt },
        ]);

        setLoading(true);
        setLoading(true);
        console.log(inputTxt)
        async function query(data) {
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
            const result = await response.json();
            console.log(result);
            return result;
            
        }
        try {
            let response = await query(inputTxt);
            console.log(response);
            // response = [{ "generated_text": "Here is the generated text." }]
            const aiMessage = response[0]?.summary_text || "Sorry, I couldn't generate text.";
            // setAns(aiMessage);
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'ai', text: aiMessage },
            ]);
            inpRef.current.value = "";
        }
        catch (error) {
            console.error("Error generating text:", error);
             setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'ai', text: "Error generating text" },
            ]); // Fallback to default image on error
        } finally {
            setLoading(false); // Stop loading
        }
     
    }
  return (
      <div className='container'>
          
        
              <div className="view-main">
              <div className="messages">
                  <div  className="ai">
                      <p>Hi how can I help you today?</p>
                  </div>
                      {messages.map((msg, index) => (
                          <div key={index} className={msg.type}>
                              <p>{msg.text}</p>
                          </div>
                      ))}
                      {loading && <p className="loading">Loading...</p>}
                  </div>
                  </div>
              <div className="input">
                  <input type="text" ref={inpRef} placeholder='Enter your Prompt' 
                      disabled={ loading} />
                  <button onClick={generateAns}
                  disabled={loading}
                  >{loading?"Loading..." :"Generate Answer"}</button>
              
          </div>
    </div>
  )
}

export default MainChat