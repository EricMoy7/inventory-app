import React from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from "reactstrap";
import { auth } from "../Firebase";
import "./NavigationBar.css";

class NavigationBar extends React.Component {
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
    return (
      <div>
        {this.state.user ? (
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">Stealth</NavbarBrand>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/products">All Products</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/add-products">Add Products</NavLink>
              </NavItem>
            </Nav>
            <Nav>
              <NavItem>
                <NavLink href="/logout">Logout</NavLink>
              </NavItem>
            </Nav>
          </Navbar>
        ) : (
          <Navbar color="light" light expand="md">
            <Nav className="ml-auto">
              <NavItem>
                <NavLink href="/login">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/registration">Register</NavLink>
              </NavItem>
            </Nav>
          </Navbar>
        )}
      </div>
    );
  }
}

export default NavigationBar;
