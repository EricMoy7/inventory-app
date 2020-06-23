import React from "react";
import { auth, db } from "../../Firebase";

class Registration extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
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
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email, password).then((cred) => {
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({
          firstName,
          lastName,
          email,
        })
        .then(
          () =>
            (this.state = {
              email: "",
              password: "",
              firstName: "",
              lastName: "",
            })
        );
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.signUp}>
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            onChange={this.updateInput}
            value={this.state.firstName}
          />

          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            onChange={this.updateInput}
            value={this.state.lastName}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={this.updateInput}
            value={this.state.email}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={this.updateInput}
            value={this.state.password}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default Registration;
