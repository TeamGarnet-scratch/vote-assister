import React from 'react';

import styles from './civic-summary.css';

const Electioninfo = ({ payload }) => {
  return (
    <div className={styles.summary__lower}>
      <div className={styles.summary__links}>
        <a className={styles.links}>Election Info</a>
        <a className={styles.links}>Registration Info</a>
        <a className={styles.links}>Registration Confirmation</a>
        <a className={styles.links}>If there is a URL then render</a>
      </div>
    </div>
  );
};

const VoteAssisterInfo = ({ payload }) => {
  return (
    <div>
      <h1>Next Election's Summary</h1>
      <h2>Election Name</h2>
      <p className={styles.small}>Mail only state</p>
    </div>
  );
};

const CivicSummary = (mapData) => {
  console.log('Map data in civic summ', mapData);
  return (
    <div className={styles.main__banner}>
      <div className={styles.summary__upper}>
        <VoteAssisterInfo payload={{ date: '' }} />
      </div>
      <div className={styles.summary__middle}>
        Election Day: <strong>06/30/2020</strong>
      </div>
      <Electioninfo payload={{ electionInfo: '', pollinglocation: '' }} />
    </div>
  );
};

export default CivicSummary;
