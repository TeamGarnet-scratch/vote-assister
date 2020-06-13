import React from 'react';

import styles from './Layout.css';

import NavBar from '../NavigationBar/NavigationBar.jsx';
import Footer from '../Footer/Footer.jsx';
//other components

export default (props) => {
  return (
    <div className={styles.Layout}>
      <NavBar />
      this is my Layout
      <div className={styles.ContentContainer}>{props.children}</div>
      <Footer />
    </div>
  );
};
