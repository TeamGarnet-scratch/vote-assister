import React from 'react';

import styles from './Layout.css';

//other components

export default (props) => {
  return <div className={styles.Layout}>{props.children}</div>;
};
