import React from 'react';
import PropTypes from 'prop-types';

import styles from './Layout.css';

import NavBar from '../NavigationBar/NavigationBar';
import Footer from '../Footer/Footer';
//  other components

export default function Layout(props) {
  const { children } = props;
  return (
    <div className={styles.Layout}>
      <NavBar />
      this is my Layout
      <div className={styles.ContentContainer}>{children}</div>
      <Footer />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
