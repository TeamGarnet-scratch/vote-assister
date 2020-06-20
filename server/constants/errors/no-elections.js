// for when there are no elections found
const NO_ELECTIONS_ERROR = (userAddress) => ({
  error: `No upcoming Elections for ${userAddress}.`,
});

module.exports = NO_ELECTIONS_ERROR;
