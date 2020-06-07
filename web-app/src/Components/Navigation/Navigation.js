import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ProductForm } from "./ProductForm/ProductForm";

class Navigation extends React.Component {
  render() {
    return (
      <div>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <Switch>
          <Route path="/add-products" component={ProductForm} />
        </Switch>
      </div>
    );
  }
}

export default Navigation;
