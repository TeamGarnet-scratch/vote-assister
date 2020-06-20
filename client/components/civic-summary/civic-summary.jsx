import React from 'react';

import styles from './civic-summary.css';

const Electioninfo = ({ payload }) => {
  //payload is an array
  //if array length is 0 then render nothing

  console.log('ElectionINFO', payload);
  let electionAdministrationBody = undefined;
  if (payload.length > 0) {
    electionAdministrationBody = payload[0]['electionAdministrationBody'];
  }
  return (
    <div className={styles.summary__lower}>
      <div className={styles.summary__links}>
        {Object.keys(electionAdministrationBody).map((key) => {
          return (
            <a href={`${electionAdministrationBody[key]}`} key={key}>
              {key
                .split(/(?=[A-Z])/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </a>
          );
        })}
      </div>
    </div>
  );
};

const VoteAssisterInfo = ({ payload }) => {
  console.log('PAYLOAD', payload);
  return (
    <div>
      <h1>Next Election's Summary</h1>
      <h2>{payload.election.name}</h2>
      <span className={styles.small}>Mail only state: </span>
      <span>{payload.mailOnly ? 'Yes' : 'No'}</span>
    </div>
  );
};

const CivicSummary = ({ votingInfo }) => {
  console.log('votingInfo', votingInfo);
  const { election, mailOnly, state } = votingInfo;

  return (
    <div className={styles.main__banner}>
      <div className={styles.summary__upper}>
        <VoteAssisterInfo
          payload={{
            election,
            mailOnly,
          }}
        />
      </div>
      <div className={styles.summary__middle}>
        Election Day: <strong>{election.electionDay}</strong>
      </div>
      <Electioninfo payload={state} />
    </div>
  );
};

export default CivicSummary;
