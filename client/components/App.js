import React, { Component } from 'react';
import Layout from './Layout/Layout.jsx';

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
        Anything goes in here will be centered both vertically and horizontally
        since the Layout Component has display of flex.
      </Layout>
    );
  }
}
export default App;
