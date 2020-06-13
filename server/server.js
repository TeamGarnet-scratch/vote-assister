const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const noElectionsError = require('./constants/errors/no-elections');
const invalidDataError = require('./constants/errors/invalid-data');

// passing in the path to config here because we've got the .env file in the root folder
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const app = express();
const port = 3000;

// ***this is a sample address that will need to be replaced by user input from the front-end***
const address = '1263%20Pacific%20Ave.%20Kansas%20City%20KS';
// create bariable to hold electionId which we'll get from the first fetch below
let electionId;
// save election data to here when we get it
let electionData;

// getting election ids
const getMatchingElections = () => {
  return fetch(`https://www.googleapis.com/civicinfo/v2/elections?key=${process.env.CIVIC_API_KEY}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'Application/JSON',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // shorter reference to elections array. each element will be an object
      const { elections } = data;
      // save the last two characters from the address to get the state's shorthand, and convert to lowercase
      const stateCode = address.substring(address.length - 2).toLowerCase();
      // create an array to save elections that match the location
      const matchingElections = [];
      // iterate over the elections object
      for (let i = 0; i < elections.length; i += 1) {
        // look at the ocdDivisionId of each election to check for country-wide or state-specific elections
        // if it's country wide, we'll only get 'ocd-division/country:us'
        // if it's state-specific, we'll get 'ocd-division/country:us/state:[CODE]'
        // where [CODE] is the two letter shorthand for the state of the address passed in, in lowercase
        // for example 'co' for colorado, or 'wa' for washington
        if (elections[i].ocdDivisionId === 'ocd-division/country:us' || elections[i].ocdDivisionId.includes(`state:${stateCode}`)) {
          matchingElections.push(elections[i]);
        }
      }
      // if we get no matches, we have to let the user know there are no upcoming elections
      if (matchingElections.length === 0) {
        // and skip the next fetch because there is no election to get data about
        console.log(`no upcoming elections in the US or ${stateCode}`);
        return noElectionsError(stateCode);
      }
      // if we only get one match, we can save the id immediately
      if (matchingElections.length === 1) {
        console.log(`one upcoming election found in the US or for ${stateCode}`);
        electionId = parseInt(data.elections[0].id, 10);
      }
      // if we get a match for more than one election, check electionDay for the earliest date
      if (matchingElections.length > 1) { // EXTENSION for this section: Check to be extra sure no dates have already passed
        console.log(`multiple upcoming elections found for the US or state: ${stateCode}`);
        // then sort the elections by date
        matchingElections.sort((a, b) => ((a.id > b.id) ? 1 : -1));
        // grab the id from the election object with the earliest date, and save it in electionId
        electionId = parseInt(matchingElections[0].id, 10);
      }
      console.log(`electionId is ${electionId}`);
      return electionId;
    })
    .catch((err) => console.log(`ERROR in server attempting to get Election ids. Error is: ${err}`));
};

// getting info about the next election based on address passed in
const getElectionData = () => {
  // if it's defined, pass it to the API with the address and api key to get the matching election info
  fetch(`https://www.googleapis.com/civicinfo/v2/voterinfo?key=${process.env.CIVIC_API_KEY}&address=${address}&electionId=${electionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'Application/JSON',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(`data.election.id is ${data.election.id}`);
      // check to make sure we've got an object with an election property, and that the id matches the one we wanted
      if (parseInt(data.election.id, 10) === electionId) {
        // if so, save it in electionData
        electionData = data;
        console.log(`matching election data is ${JSON.stringify(electionData)}`);
        return electionData;
      }
      // otherwise, return an error
      return invalidDataError(electionId);
    })
    .catch((err) => console.log(`ERROR in server attempting to get election info for ${address}. Error is: ${err}`));
};

// wait to see if our initial fetch for election id is complete
const checkForMatchingElections = () => Promise.all([getMatchingElections()]);

// once our fetch for election id is complete...
checkForMatchingElections()
  .then(() => {
    // then check to see if election ID is defined
    if (electionId !== undefined) {
      // if it is, then get the data for that election
      getElectionData();
    }
  })
  .catch('Error when trying to check whether first fetch worked');

// now we can use the variable 'electionData' to pick out what we want to send to the front end

app.use(express.static(path.resolve(__dirname, '../dist')));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
