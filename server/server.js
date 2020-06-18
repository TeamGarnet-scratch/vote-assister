const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const { Client, Status } = require('@googlemaps/google-maps-services-js');
const noElectionsError = require('./constants/errors/no-elections');
const invalidDataError = require('./constants/errors/invalid-data');

// passing in the path to config here because we've got the .env file in the root folder
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const app = express();
const port = 3000;
const civicAPI = process.env.CIVIC_API_KEY;
const mapsAPI = process.env.MAPS_API_KEY;

// ***this is a sample address that will need to be replaced by user input from the front-end***
const userLocation = {};
userLocation.address = '3549%20G%20Rd%20Palisade%20CO';

// create bariable to hold electionId which we'll get from the first fetch below
let electionId;
// save election data to here when we get it
let electionData;

// getting election ids
const getMatchingElections = () => {
  return fetch(`https://www.googleapis.com/civicinfo/v2/elections?key=${civicAPI}`, {
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
      const stateCode = userLocation.address.substring(userLocation.address.length - 2).toLowerCase();
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
        // if the id is 2000, then we have no real elections (2000 is sample data), so return an error
        if (parseInt(matchingElections[0].id, 10) === 2000) {
          return noElectionsError(stateCode);
        }
        // otherwise it's a valid election ID, so save it
        electionId = parseInt(data.elections[0].id, 10);
      }
      // if we get a match for more than one election, check electionDay for the earliest date
      if (matchingElections.length > 1) {
        console.log(`multiple upcoming elections found for the US or state: ${stateCode}`);
        // then sort the elections by date
        matchingElections.sort((a, b) => ((a.id > b.id) ? 1 : -1));
        // if the first election id is 2000, we need to skip it
        // we know we have at least one more, so...
        if (parseInt(matchingElections[0].id, 10) === 2000) {
          // grab the next id from the election object with the earliest date, and save it in electionId
          electionId = parseInt(matchingElections[1].id, 10);
        } else {
          // otherwise we can grab the first id from the election object with the earliest date, and save it in electionId
          electionId = parseInt(matchingElections[0].id, 10);
        }
      }
      console.log(`electionId is ${electionId}`);
      return electionId;
    })
    .catch((err) => console.log(`ERROR in server attempting to get Election ids. Error is: ${err}`));
};

// getting info about the next election based on address passed in
const getElectionData = () => {
  // if it's defined, pass it to the API with the address and api key to get the matching election info
  // we also only accept the election info that is marked as "official" in the API using the "officialOnly=true"
  fetch(`https://www.googleapis.com/civicinfo/v2/voterinfo?key=${process.env.CIVIC_API_KEY}&address=${userLocation.address}&electionId=${electionId}&officialOnly=true`, {
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
      }
      // otherwise, return an error
      return invalidDataError(electionId);
    })
    .catch((err) => console.log(`ERROR in server attempting to get election info for ${userLocation.address}. Error is: ${err}`));
};

// wait to see if our initial fetch for election id is complete
const checkForElectionId = () => Promise.all([getMatchingElections()]);

// once our fetch for election id is complete...
checkForElectionId()
  .then(() => {
    // then check to see if election ID is defined
    if (electionId !== undefined) {
      // if it is, then get the data for that election
      getElectionData();
    }
  })
  .catch('Error when trying to check whether election ID fetch request worked');

// now we can use the variable 'electionData' to pick out what we want to send to the front end
// will add more here soon
// we can also adjust our query for election data to /voterinfo so that we only ask for what we need


// Need to make a get request from this URL with the user address
// `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${mapsAPI}`
// and then iterate over the pollingLocations, earlyVoteSites, dropOffLocations
// and make a request for each of those addresses, saving the resulting long/lat for each
// this will be in results[index].geometry.location.lat and
// results[index].geometry.location.long
// we may be able to pass in multiple addresses per API call, hence the index
// if not, we'll want to use results[0]

// putting this in a function so we can return a promise that we wait for.
// we'll want to wait for the promise for get ElectionData to resolve before calling this
const geocodeUserAddress = () => {
  // get request for user address
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation.address}&key=${mapsAPI}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'Application/JSON',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(`latitude is ${data.results[0].geometry.location.lat} and longitude is ${data.results[0].geometry.location.lng}`);
      userLocation.latitude = data.results[0].geometry.location.lat;
      userLocation.longitude = data.results[0].geometry.location.lng;
    })
    .catch();
};

// wait to see if our fetch for election data is complete
const checkForElectionData = () => Promise.all([getElectionData()]);

checkForElectionData()
  .then(geocodeUserAddress)
  .then(() => {
    console.log(`election data is ${JSON.stringify(electionData)}`);
  });

// loop for pollingLocations array
// for (let i = 0; i < electionData.pollingLocations.length; i += 1) {
//   // simpler reference to the location for the current element
//   const location = electionData.pollingLocations[i];
//   // appending together the first line of the address with the city and state
//   let currentAddress = `${location.address.line1} ${location.address.city} ${location.address.state}`;
//   // encoding the address so we can use it in the query URI
//   currentAddress = currentAddress.encodeURI();
//   // saving the query URI for our fetch request
//   const queryURI = `https://maps.googleapis.com/maps/api/geocode/json?address=${currentAddress}&key=${mapsAPI}`;
//   // then make call to geocoding API to get long/lat
//   fetch(queryURI, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'Application/JSON',
//     },
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       console.log(`latitude is ${data.results[0].geometry.location.lat} and longitude is ${data.results[0].geometry.location.lng}`);
//       // trusting that location as a referece will add the latitude and longitude properties here
//       // to electionData.pollingLocations[i]
//       // this means every location in pollingLocations will have a latitude and longitude
//       location.latitude = data.results[0].geometry.location.lat;
//       location.longitude = data.results[0].geometry.location.lng;
//     })
//     .catch((err) => {
//       console.log('error getting pollingLocation address\'s latitude and/or longitude: ', err);
//     });
// }

// loop for earlyVoteSites locations array

// loop for dropOffLocations array

app.use(express.static(path.resolve(__dirname, '../dist')));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
