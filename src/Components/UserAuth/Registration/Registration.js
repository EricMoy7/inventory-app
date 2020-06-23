import React from "react";
import { auth } from "../../Firebase";

class Registration extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  signUp = (e) => {
    const email = this.state.email;
    const password = this.state.password;
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email, password);
  };

  render() {
    return (
      <div>
        <form>
          <input
            name="email"
            type="email"
            onChange={this.updateInput}
            value={this.state.email}
          />
          <input
            name="password"
            type="password"
            onChange={this.updateInput}
            value={this.state.email}
          />
        </form>
      </div>
    );
  }
}

export default Registration;
