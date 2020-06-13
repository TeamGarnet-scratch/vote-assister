import React, { Component } from 'react';
import Layout from './Layout/Layout.jsx';
import NavBar from './NavigationBar/NavigationBar.jsx';
import Footer from './Footer/Footer.jsx';
class App extends Component {
  render() {
    return (
      <Layout>
        <NavBar />
        this is my Layout
        <Footer />
      </Layout>
    );
  }
}
export default App;
