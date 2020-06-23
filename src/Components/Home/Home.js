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
      if (user) {
        this.setState({ user });
      }
    });
  }
  render() {
    return this.state.user ? (
      <h1>Welcome to Stealth LLC Inventory Management</h1>
    ) : (
      (window.location.href = "registration")
    );
  }
}

export default Home;
