import React, { useRef, useState } from 'react'
import './ArtifyAi.css'
import default_img from './default.webp'
const ArtifyAi = () => {
    const [image_url, setURL] = useState("/");
    let inpRef = useRef(null);
    const [loading, setLoading] = useState(false);
    // let inpdata = inpRef.current.value;
    const imageGenrator = async () => {
        // Ensure inpRef.current is not null
        if (!inpRef.current || inpRef.current.value === "") return;

        const inpdata = inpRef.current.value;
        let token = "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"
        setLoading(true);
        async function query(data) {
            const response = await fetch(
                "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
        				"Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(inpdata),
                }
            );
            const result = await response.blob();
            return result;
        }
        try {
            const response = await query(inpdata);
            const imageURL = URL.createObjectURL(response);
            setURL(imageURL); // Update the image URL
        } catch (error) {
            console.error("Error generating image:", error);
            setURL(default_img); // Fallback to default image on error
        } finally {
            setLoading(false); // Stop loading
        }

    }
  return (
      <div className='container'>
          
          <div className="image-loading">
              {loading ? (
                  <div className="loader">Loading...</div>
              ) : (
                  <div className="image">
                      <img src={image_url === "/" ? default_img : image_url} alt="Generated Art" />
                  </div>
              )}
          </div>
          <div className="search-box">
              <input type="text" ref={inpRef} placeholder='Enter your Prompt' />
              <button className='generate' onClick={() => {
                  imageGenrator()
              }}>Generate</button>
          </div>
    </div>
  )
}

export default ArtifyAi