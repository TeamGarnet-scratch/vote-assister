// for when the election data is invalid
const INVALID_ELECTION_DATA_ERROR = (electionId) => ({
  message: `Election data returned by ${electionId} was not valid`,
});

module.exports = INVALID_ELECTION_DATA_ERROR;
