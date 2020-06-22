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

class ProductForm extends Component {
  state = {
    msku: null,
    asin: null,
    name: null,
    product_cost: null,
    supplier: null,
    report: null,
  };

  onChangeMsku = (param) => {
    const msku = typeof param === "string" ? param : param.target.value;
    this.setState({ msku });
  };

  onChangeAsin = (param) => {
    const asin = typeof param === "string" ? param : param.target.value;
    this.setState({ asin });
  };

  onChangeName = (param) => {
    const name = typeof param === "string" ? param : param.target.value;
    this.setState({ name });
  };

  onChangeProductCost = (param) => {
    const product_cost = typeof param === "string" ? param : param.target.value;
    this.setState({ product_cost });
  };

  onChangeSupplier = (param) => {
    const supplier = typeof param === "string" ? param : param.target.value;
    this.setState({ supplier });
  };

  onGetReport = async () => {
    const restockReport = API.get("/mws/reports");
  };

  onButtonAdd = async () => {
    const { msku, asin, name, product_cost, supplier } = this.state;
    const product = { product: { msku, asin, name, product_cost, supplier } };

    try {
      const { data } = await API.post("/product/data", product);

      if (data) {
        NotificationManager.success(
          "Successfully added the product",
          "Product"
        );
      }
    } catch (err) {
      NotificationManager.error("Error adding the product", "Product");
    }
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
                <Form>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>MSKU</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="msku"
                      value={msku}
                      onChange={this.onChangeMsku}
                      onBlur={this.checkMSKU}
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
                      onChange={this.onChangeAsin}
                    />
                  </InputGroup>

                  <br />

                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>Name</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="name"
                      value={name}
                      onChange={this.onChangeName}
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
                      onChange={this.onChangeProductCost}
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
                      onChange={this.onChangeSupplier}
                    />
                  </InputGroup>

                  <br />

                  <Button
                    className="btn-block"
                    color="primary"
                    onClick={this.onButtonAdd}
                  >
                    Add
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col>
            <Button onClick={this.onGetReport}>Get Report</Button>
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
