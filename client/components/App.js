import React, { Component } from 'react';
import Layout from './Layout/Layout.jsx';
import AddressComponent from './address-search/address-search';

class App extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(event) {
    event.preventDefault(event);
    console.log('form submitted');
  }
  render() {
    return (
      <Layout>
        {/* Anything goes in here will be centered both vertically and horizontally
        since the Layout Component has display of flex. */}
        <AddressComponent onSubmit={this.onSubmit}>hi</AddressComponent>
      </Layout>
    );
  }
}
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
