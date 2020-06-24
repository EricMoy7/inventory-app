import React, { Component } from "react";
import API from "../../utils/api";
import config from "../../config/config";
import { MDBDataTable } from "mdbreact";
import { db } from "../Firebase";
import { AddBox, ArrowDownward } from "@material-ui/icons";

class Product extends Component {
  state = {
    products: {},
  };

  async componentDidMount() {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const uid = userData.uid;
    var colList = [];
    var rowList = [];

    let user = db.collection("users").doc(uid).collection("MSKU");
    user.orderBy("desc");
    await user
      .get()
      .then((snap) => {
        const items = {};
        snap.forEach((item) => {
          items[item.id] = item.data();
          return items;
        });
        //Items is an object with MSKU as the key. The value of each key is the data of the key in another object
        const firstMsku = Object.keys(items)[0];
        const colObj = items[firstMsku];

        Object.keys(colObj).forEach((key) => {
          colList.push({
            label: key.toUpperCase(),
            field: key.toLowerCase(),
            sort: "asc",
            width: 150,
          });
        });

        Object.keys(items).forEach((key) => {
          rowList.push(items[key]);
        });
      })
      .then(() => {
        this.setState({ products: { columns: colList, rows: rowList } });
      });
  }

  render() {
    const { products } = this.state;
    return (
      <div>
        <MDBDataTable
          bordered
          small
          noBottomColumns
          hover
          info={false}
          data={products}
        />
      </div>
    );
  }
}

export default Product;
