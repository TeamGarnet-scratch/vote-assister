import React, { useState } from 'react';
import axios from 'axios';

import Layout from './Layout/Layout';
import AddressComponent from './address-search/address-search';
import CivicSummaryComponent from './civic-summary/civic-summary';

const App = () => {
  const [hasData, setHasData] = useState(false);
  const [mapData, setMapData] = useState(null);

  const handleOnSubmit = (addressData) => {
    console.log(addressData);
    //send request and wait for data
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
      .then((data) => {
        console.log('MAP DATA', data);
        // setHasData(true);
        // setMapData(data);
      })
      .catch((e) => {
        console.log('error', e);
      });
  };

  return (
    <Layout>
      {/* Anything goes in here will be centered both vertically and horizontally
      since the Layout Component has display of flex. */}
      {hasData ? (
        <CivicSummaryComponent mapData={mapData} />
      ) : (
        <AddressComponent onSubmit={handleOnSubmit} />
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
