import React from "react";
import { auth } from "../../Firebase";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
  }

  loginForm = async (e) => {
    e.preventDefault();
    const email = this.state.email;
    const password = this.state.password;

    await auth.signInWithEmailAndPassword(email, password).then((cred) => {
      console.log(cred.user);
    });

    this.setState({
      email: "",
      password: "",
    });
  };

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.loginForm}>
          <input
            type="email"
            name="email"
            onChange={this.updateInput}
            value={this.state.email}
          />
          <input
            type="password"
            name="password"
            onChange={this.updateInput}
            value={this.state.password}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
