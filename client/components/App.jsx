import React, { useState } from 'react';
import axios from 'axios';

import Layout from './Layout/Layout';
import AddressComponent from './address-search/address-search';
import CivicSummaryComponent from './civic-summary/civic-summary';

const App = () => {
  const [votingInfo, setVotingInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleOnSubmit = (addressData) => {
    axios
      .get('/api', {
        params: {
          lat: addressData.latitude,
          long: addressData.longitude,
          address: addressData.address
            .replaceAll(',', '')
            .replaceAll('USA', '')
            .trim(),
        },
      })
      .then(({ data }) => {
        setVotingInfo(data);
      })
      .catch((e) => {
        setError(e.response.data);
      });
  };

  return (
    <Layout>
      {/* Anything goes in here will be centered both vertically and horizontally
      since the Layout Component has display of flex. */}
      {votingInfo ? (
        <CivicSummaryComponent votingInfo={votingInfo} />
      ) : (
        <AddressComponent onSubmit={handleOnSubmit} error={error} />
      )}
    </Layout>
  );
};
export default App;

// import React, { Component } from 'react';
// import Layout from './Layout/Layout.jsx';
// import NavBar from './NavigationBar/NavigationBar.jsx';
// import Footer from './Footer/Footer.jsx';

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.onSubmit = this.onSubmit.bind(this);
//   }
//   onSubmit(event) {
//     event.preventDefault(event);
//     console.log('form submitted');
//   }
//   render() {
//     return (
//       <Layout>
//         <NavBar />

//         <Footer />
//       </Layout>
//     );
//   }
// }
// export default App;
