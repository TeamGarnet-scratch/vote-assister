import React, { useState } from 'react';
import Layout from './Layout/Layout';
import AddressComponent from './address-search/address-search';
import CivicSummaryComponent from './civic-summary/civic-summary';

const App = () => {
  const [hasData, setHasData] = useState(false);

  const handleOnSubmit = (data) => {
    //send request and wait for data

    console.log('FINAL ADDRESS', data);
  };

  return (
    <Layout>
      {/* Anything goes in here will be centered both vertically and horizontally
      since the Layout Component has display of flex. */}
      <AddressComponent onSubmit={handleOnSubmit} />
      {/* <CivicSummaryComponent /> */}
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
