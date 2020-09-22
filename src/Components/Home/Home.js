import React from "react";
import { auth } from "../Firebase";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
      }
    });
  }
  render() {
    return this.state.user ? (
      <h1>Welcome to Stealth LLC Inventory Management</h1>
    ) : (
      <h1>You are not logged in</h1>
    );
  }
}

export default Home;
