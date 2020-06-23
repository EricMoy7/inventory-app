import React from "react";
import { auth } from "../../Firebase";

class Logout extends React.Component {
  componentDidMount() {
    auth.signOut();
  }

  render() {
    return <div>You have been logged out.</div>;
  }
}

export default Logout;
