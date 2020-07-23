import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ProductForm from "../ProductForm/ProductForm";
import Home from "../Home/Home";
import NavigationBar from "../NavigationBar/NavigationBar";
import Products from "../Products/Products";
import Login from "../UserAuth/Login/Login";
import Logout from "../UserAuth/Logout/Logout";
import Registration from "../UserAuth/Registration/Registration";
import Batch from "../Batch/Batch";

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
            <Route path="/products" component={Products} />
            <Route path="/add-products" component={ProductForm} />
            <Route path="/login" component={Login} />
            <Route path="/logout" component={Logout} />
            <Route path="/registration" component={Registration} />
            <Route path="/batch" component={Batch} />
            <Route path="/" component={Home} exact />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default Navigation;
