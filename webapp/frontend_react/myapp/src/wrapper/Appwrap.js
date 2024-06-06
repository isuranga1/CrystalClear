import React from 'react';
import { NavigationDots, SocialMedia } from '../components';


const Appwrap = (Component, idName, classNames) => function HOC() {
  return (
    <div id={idName} className={`app__container ${classNames}`}>
      <SocialMedia />
      <div className='app__wrapper app__flex'>
        <Component />
        <div className='copyright'>
          <p className='p-text'>@2024  Project Crytal Clear</p>
          <p className='p-text'>All rights reserved</p>
        </div>
      </div>
      <NavigationDots active={idName}  className="navigation-dots"style={{ position: 'absolute', Left: 300 }} />
    </div>
  );
};

export default Appwrap;
