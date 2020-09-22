import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ProductForm from "../ProductForm/ProductForm";
import Home from "../Home/Home";
import Products from "../Products/Products";
import Login from "../UserAuth/Login/Login";
import Logout from "../UserAuth/Logout/Logout";
import Registration from "../UserAuth/Registration/Registration";
import Batch from "../Batch/Batch";
import Settings from "../Settings/Settings";
import Workers from "../Workers/Workers";
import Selector from "../Shipment/Selector";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "react-bootstrap";
import { auth } from "../Firebase";

class Navigation extends React.Component {
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        {this.state.user ? (
          <Router>
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
                  <NavLink href="/batch">Batch</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/workers">Workers</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/shipment">Shipment</NavLink>
                </NavItem>
              </Nav>
              <Nav>
                <NavItem>
                  <NavLink href="/settings">Settings</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/logout">Logout</NavLink>
                </NavItem>
              </Nav>
            </Navbar>
            <Switch>
              <Route path="/products" component={Products} />
              <Route path="/add-products" component={ProductForm} />
              <Route path="/logout" component={Logout} />
              <Route path="/batch" component={Batch} />
              <Route path="/" component={Home} exact />
              <Route path="/settings" component={Settings} />
              <Route path="/workers" component={Workers} />
              <Route path="/shipment" component={Selector} />
            </Switch>
          </Router>
        ) : (
          <Router>
            <Navbar color="light" light expand="md">
              <Nav className="ml-auto"></Nav>
              <Nav className="ml-auto">
                <NavItem>
                  <NavLink href="/login">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/registration">Register</NavLink>
                </NavItem>
              </Nav>
            </Navbar>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/registration" component={Registration} />
              <Route path="/" component={Home} exact />
            </Switch>
          </Router>
        )}
      </div>
    );
  }
}

export default Navigation;
