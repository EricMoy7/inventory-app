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
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Stealth</NavbarBrand>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/products">All Products</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/add-products">Add Products</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/registration">Register</NavLink>
            </NavItem>
          </Nav>
          <Nav>
            {this.state.user ? (
              <NavItem>
                <NavLink href="/logout">Logout</NavLink>
              </NavItem>
            ) : (
              <NavItem>
                <NavLink href="/login">Login</NavLink>
              </NavItem>
            )}
          </Nav>
          <NavbarText>Simple Text</NavbarText>
        </Navbar>
      </div>
    );
  }
}

export default NavigationBar;
