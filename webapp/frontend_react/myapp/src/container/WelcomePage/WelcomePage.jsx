import React from 'react'
import "./WelcomePage.scss";
import {motion} from "framer-motion";
import { images } from '../../constants';
import {Appwrap} from '../../wrapper';

const scaleVarients={
  whileInView:{
    scale:[0,1],
    opacity:[0,1],
    transition:{
      duration:1,
      ease: "easeInOut"

    }

  }


}
const WelcomePage = () => {
  return (
    <div    className='app__header app__flex' style={{ marginLeft: '40px' }}>
      <motion.div
      whileInView={{x:[-100,0],opacity:[0,1]}}
      transition={{duration:5}}
      className="app__header-info"
      >
        <div className="app__header-badge">
          <div className='app__header-badge'>

            <div  className="badge-cmp app__flex">

              <span> 👋  </span>
              <div style={{marginleft:20,}}>

                <p classname="p-text "  style={{ fontSize: '30px' }}>Hello, Welcome to</p >

                  <h1  className='head-text' style={{ fontSize: '60px' }}> Word Wonderland !</h1>

              </div>

           



            </div>
            
            
            </div>
           <div className='tag-cmp app__flex'>
              <p classname="p-text"  style={{ fontSize: '20px', fontWeight: 'bold' }}>Unlock Your Super Powers!</p>
              
             

              </div> 

              
              
        </div>

        </motion.div>

        <motion.div      
         whileInView={{opacity:[0,1]}}
         transition={{duration:5,delayChildren:0.5}}
         className="app__header-img" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >

            <img src={images.child1} alt="child1"  style={{  width: '170%', height: 'auto', margin: '100px'}} />
            <motion.img
            whileInView={{scale:[0,1]}}
            transition={{duration:1,ease: "easeInOut"}}
            src={images.circle}
            alt='profile_circle'
            className='overlay_circle'
            
            />
          </motion.div>  


          
        <motion.div
        
        variant={scaleVarients}
        whileInView={scaleVarients.whileInView}
        className="app__header-circles">
  {[{image: images.plus, text: "Learn"}, {image: images.brain, text: "Practise"}, {image: images.bulb, text: "Grow"}].map((item, index) => (
    <div className="circle-cmp app_flex" key={"circle-" + index}>
      <div className="text-container">
        <img src={item.image} alt="circle" style={{ width: "100px", height: "100px", marginTop: "50px" }} />
        <p style={{ fontSize: "2rem",fontWeight: "bold"  }}>{item.text}</p> {/* Adjust the font size as needed */}
      </div>
    </div>
  ))}
         
          </motion.div>
       


    </div>
    
  )
}

export default Appwrap(WelcomePage,'home');
