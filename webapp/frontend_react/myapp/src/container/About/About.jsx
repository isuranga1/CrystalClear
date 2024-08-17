import "./About.scss";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip'
import { urlFor, client } from '../../client';
import { Appwrap, MotionWrap } from '../../wrapper';

const About= () => {
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const query = '*[_type == "experiences"]';
    const skillsQuery = '*[_type == "skills"]';

    client.fetch(query).then((data) => {
      setExperiences(data);
    });

    client.fetch(skillsQuery).then((data) => {
      setSkills(data);
    });
  }, []);

  return (
    <>
      <h2 className="head-text">About Us</h2>

      <div className="app__skills-container">
        <motion.div className="app__skills-list">
          {skills.map((skill) => (
            <motion.div
              whileInView={{ opacity: [0, 1] }}
              transition={{ duration: 0.5 }}
              className="app__skills-item app__flex"
              key={skill.name}
            >
              <div
                className="app__flex app__centered"
                style={{ backgroundColor: 'rgb(255,255,255)', width: '180px', height: '180px' }}
              >
                <img src={urlFor(skill.icon)} alt={skill.name} style={{ width: "90%", height: "90%" ,borderRadius: '80%', overflow: 'hidden',boxShadow: '0px 0px 70px rgba(81, 186, 180, 0.3)'}} />
              </div>
              <p className="p-text" style={{ fontSize: '18px', fontWeight: 'bold',marginLeft:'10px',color:'black' ,marginTop:'40px'}}>{skill.name} </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Appwrap(
  MotionWrap(About, 'app__about'), 'about', " app__whitebg"
);
