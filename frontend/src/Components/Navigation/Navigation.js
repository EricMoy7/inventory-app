import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ProductForm from "../ProductForm/ProductForm";
import Home from "../Home/Home";
import NavigationBar from "../NavigationBar/NavigationBar";

class Navigation extends React.Component {
  render() {
    return (
      <div>
        <NavigationBar />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <Router>
          <Switch>
            <Route path="/add-products" component={ProductForm} />
            <Route path="/" component={Home} exact />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default Navigation;
