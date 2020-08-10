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
import { db } from "../Firebase";
import Uploader from "./csvUploader";

class ProductForm extends Component {
  state = {
    MSKU: null,
    ASIN: null,
    product_cost: null,
    supplier: null,
    listMSKU: null,
    supplier_url: null,
    price: null,
  };

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  addProduct = (e) => {
    e.preventDefault();
    let {
      MSKU,
      ASIN,
      product_cost,
      supplier,
      supplier_url,
      price,
    } = this.state;
    const userData = JSON.parse(sessionStorage.getItem("userData"));

    let userInventory = db
      .collection("users")
      .doc(userData.uid)
      .collection("MSKU")
      .doc(MSKU);

    userInventory.set(
      {
        MSKU,
        ASIN,
        product_cost,
        supplier,
        supplier_url,
        price,
      },
      { merge: true }
    );
  };

  addBulkMSKU = (e) => {
    e.preventDefault();
    const stringMSKU = this.state.listMSKU;
    const userData = JSON.parse(sessionStorage.getItem("userData"));

    const listMSKU = stringMSKU.split(/\r?\n/);
    for (let i = 0; i < listMSKU.length; i++) {
      db.collection("users")
        .doc(userData.uid)
        .collection("MSKU")
        .doc(listMSKU[i])
        .set(
          {
            MSKU: listMSKU[i],
          },
          { merge: true }
        );
    }
  };

  render() {
    const {
      MSKU,
      ASIN,
      name,
      product_cost,
      supplier,
      supplier_url,
      price,
    } = this.state;

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
                      name="MSKU"
                      value={MSKU}
                      onChange={this.updateInput}
                    />
                  </InputGroup>

                  <br />

                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>ASIN</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="ASIN"
                      value={ASIN}
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

                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>Supplier Url</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="supplier_url"
                      value={supplier_url}
                      onChange={this.updateInput}
                    />
                  </InputGroup>

                  <br />

                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>List Price</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="price"
                      value={price}
                      onChange={this.updateInput}
                    />
                  </InputGroup>

                  <Button className="btn-block" color="primary">
                    Add
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col sm="3">
            <Card>
              <CardBody>
                <CardTitle className="CardTitle">Bulk MSKU Add</CardTitle>
                <InputGroup>
                  <Form onSubmit={this.addBulkMSKU}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>MSKUS</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="listMSKU"
                      value={this.listMSKU}
                      type="textarea"
                      onChange={this.updateInput}
                    />
                    <Button className="btn-block" color="primary">
                      Add
                    </Button>
                  </Form>
                </InputGroup>
              </CardBody>
            </Card>
          </Col>

          <Col sm="3">
            <Card>
              <CardBody>
                <Uploader />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProductForm;
