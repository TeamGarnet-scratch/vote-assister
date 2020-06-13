// for when there are no elections found
const NO_ELECTIONS_ERROR = (stateCode) => ({
  message: `no upcoming Elections in the US or ${stateCode}`,
});

module.exports = NO_ELECTIONS_ERROR;
