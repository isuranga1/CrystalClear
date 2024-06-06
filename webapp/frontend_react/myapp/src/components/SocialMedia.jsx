import React from 'react';
import { BsTwitter, BsInstagram } from 'react-icons/bs';
import { FaFacebook } from 'react-icons/fa';

const SocialMedia = () => {
  return (
    <div style={styles.app__social}>
      <div style={styles.icon}>
        <BsTwitter />
      </div>

      <div style={styles.icon}>
        <FaFacebook />
      </div>

      <div style={styles.icon}>
        <BsInstagram />
      </div>
    </div>
  );
};

const styles = {
  app__social: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '60px',
  },
  icon: {
    marginTop: '20px',
    marginLeft: '10px', // Adjust this value to control the vertical spacing between icons
  },
};

export default SocialMedia;