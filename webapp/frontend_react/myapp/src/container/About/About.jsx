import React, {useState,useEffect} from 'react'
import {motion} from "framer-motion";
import "./About.scss";
import { images } from '../../constants';
import { urlFor,client } from '../../client';
import { Appwrap, MotionWrap } from '../../wrapper';
 




const About = () => {
  const [abouts,setAbouts]=useState([]);
  useEffect(() => {
    
    const query='*[_type=="abouts"]';
    client.fetch(query)
    .then((data)=>setAbouts(data))

  }, []);
  




  return (
    <div className="about-container">
      <h2 className='head-text'>
      Jump into <span> the Story </span><span>  Jungle!</span>
      </h2>
      <div className='app__profiles'>
        {abouts.map((about,index)=>(
          <motion.div
            whileInView={{opacity:1}}
            whileHover={{scale:1.1}}
            transition={{duration:0.5,type:'tween'}}
            className='app__profile-item'
            key={about.title+index}
          
          >
              <img src={urlFor(about.imgUrl)} alt={about.title} style={{ width: '100%', height: 'auto' }}/>
              <h2 className='bold-text' style={{marginTop:20}}> {about.title}             </h2>
              <p className='p-text' style={{marginTop:10}}> {about.description}             </p>

          
          </motion.div>

        ))}
      </div>
    </div>
  );
};

export default Appwrap(
  MotionWrap(About,'stories'),'stories',"app__whitebg"
  
  
  );
