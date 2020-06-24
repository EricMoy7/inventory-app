import React, { Component } from "react";
import API from "../../utils/api";
import config from "../../config/config";
import { MDBDataTable } from "mdbreact";
import { db } from "../Firebase";

class Product extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const uid = userData.uid;

    let user = db.collection("users").doc(uid).collection("MSKU");
    let getDoc = user.get().then((snap) => {
      const items = {};
      snap.forEach((item) => {
        items[item.id] = item.data();
        return items;
      });
      //Items is an object with MSKU as the key. The value of each key is the data of the key in another object
      console.log(items);
    });
  }

  render() {
    const { products } = this.state;

    return (
      <MDBDataTable
        bordered
        small
        noBottomColumns
        hover
        info={false}
        data={products}
      />
    );
  }
}

export default Product;
