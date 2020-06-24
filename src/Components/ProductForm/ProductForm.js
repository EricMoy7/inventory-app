import React, { Component } from "react";
import API from "../../utils/api";
import {
  Form,
  Input,
  Card,
  CardBody,
  Row,
  Col,
  CardTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap";
import "./ProductForm.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { db } from "../Firebase";

class ProductForm extends Component {
  state = {
    msku: null,
    asin: null,
    product_cost: null,
    supplier: null,
  };

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
<<<<<<< HEAD
  };

  addProduct = () => {
    var { msku, asin, product_cost, supplier } = this.state;
=======
>>>>>>> 65aab00f7811608fa2c32e1a58b1352befe6dff2
  };

  //Getting report to check
  onGetReport = async () => {
    const restockReport = API.get("/mws/reports");
  };

  onGetReport = async () => {
    const restockReport = await API.get("/mws/reports")
      .then((response) => {
        let reportData = [];

        const arrayData = response.data.data;
        reportData.push(["Merchant SKU", "Name", "ASIN"]);
        for (let i = 0; i < arrayData.length; i++) {
          reportData.push([
            arrayData[i]["Merchant SKU"],
            arrayData[i]["Product Name"],
            arrayData[i]["ASIN"],
          ]);
        }
        sessionStorage.setItem("reportData", JSON.stringify(reportData));
        console.log(JSON.parse(sessionStorage.getItem("reportData")));
      })
      .then(() =>
        NotificationManager.success("The report was successfully imported")
      );
  };

  checkMSKU = () => {
    const reportData = JSON.parse(sessionStorage.getItem("reportData"));
    const msku = this.state.msku;
    for (let i = 0; i < reportData.length; i++) {
      if (reportData[i][0] === msku) {
        if (
          window.confirm(
            "Product has been found in inventory. Add ASIN and Product name?"
          )
        ) {
          console.log("hi");
          this.onChangeAsin(reportData[i][2]);
        }
        break;
      }
    }
  };

  render() {
    const { msku, asin, name, product_cost, supplier } = this.state;

    return (
      <div>
        <Row>
          <Col sm="3" id="newSkuForm">
            <Card>
              <CardBody>
                <CardTitle className="CardTitle">New SKU Form</CardTitle>
                <Form onSubmit={this.addProduct}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>MSKU</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="msku"
                      value={msku}
                      onChange={this.updateInput}
                    />
                  </InputGroup>

                  <br />

                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>ASIN</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="asin"
                      value={asin}
                      onChange={this.updateInput}
                    />
                  </InputGroup>

                  <br />

                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>Product Cost</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="product_cost"
                      value={product_cost}
                      onChange={this.updateInput}
                    />
                  </InputGroup>

                  <br />

                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>Supplier</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="supplier"
                      value={supplier}
                      onChange={this.updateInput}
                    />
                  </InputGroup>

                  <br />

                  <Button className="btn-block" color="primary">
                    Add
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <NotificationContainer />
      </div>
    );
  }
}

export default ProductForm;

/*import React from "react";
import Firebase from "../Firestore/Firestore";

class Product extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
    };
  }

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    console.log("Changing State");
    console.log(this.state);
  };

  addUser = (e) => {
    console.log("Button Clicked");
    e.preventDefault();
    const db = Firebase.firestore();
    const userRef = db.collection("users").add({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
    });
    this.setState({
      firstName: "",
      lastName: "",
      email: "",
    });
  };

  render() {
    return (
      <form onSubmit={this.addUser}>
        <input
          type="text"
          name="firstName"
          placeholder="firstName"
          onChange={this.updateInput}
          value={this.state.firstName}
        />
        <input
          type="text"
          name="lastName"
          placeholder="lastName"
          onChange={this.updateInput}
          value={this.state.lastName}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={this.updateInput}
          value={this.state.email}
        />
        <button type="submit">Submit</button>
      </form>
    );
  }
}
export default Product; */
