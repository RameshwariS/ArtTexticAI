import React from 'react'
import './Navbar.css'
import ArtifyAi from '../Artify/ArtifyAi'
import MainChat from './Main/MainChat'
const Navbar = () => {
  return (
      <div className='container1'>
          <div className="left1">
              <h1>ArtifyAI Words coming to reality</h1>
              {/* <div className="mainArt"> */}
                  
                    <ArtifyAi ></ArtifyAi>
              {/* </div> */}
              

          </div>
          <div className="right1">
              <h1>WordCraftAI Summarize your text using AI</h1>
              <MainChat></MainChat>
          </div>
    </div>
  )
}

export default Navbar
