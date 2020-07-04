import React, { Component } from "react";
import { db } from "../Firebase";
import MaterialTable from "material-table";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

class Product extends Component {
  //Initialize empty object to store product data
  state = {
    products: {},
  };

  //On load function
  async componentDidMount() {
    //getting data...
    this.getDataFromDB();
  }

  async getDataFromDB() {
    //Pulling user data from session storage
    //userData is stored as soon as the user logins check firebase.js
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const uid = userData.uid;

    //Initializing empty array for column headers and row data
    var colList = [];
    var rowList = [];

    //Pulling settings data from user database
    //TODO: Create settings for user provided headers
    let userSet = db
      .collection("users")
      .doc(uid)
      .collection("settings")
      .doc("tableHeaders");
    //Getting user column headers
    await userSet.get().then((snap) => {
      //Saving column headers to previous empty array
      colList = snap.data().columns;

      colList.map((column, idx) => {
        if (column.title === "Image") {
          colList[idx] = {
            ...column,
            render: (rowData) => (
              <img src={rowData.imageUrl} style={{ width: 75, height: 75 }} />
            ),
          };
        }
      });
    });

    //Pulling user inventory data from user database
    let userInv = db.collection("users").doc(uid).collection("MSKU");
    //Sort data by ascending
    userInv.orderBy("asc");
    //Getting object data
    await userInv
      .get()
      .then((snap) => {
        //Initialize temporary object storage for parsing
        const items = {};
        //Loop through each key
        snap.forEach((item) => {
          //Restructuring object to meet table format req
          items[item.id] = item.data();
          return items;
        });

        //Looping through previous restructure and pushing to empty array
        Object.keys(items).forEach((key) => {
          rowList.push(items[key]);
        });
      })
      .then(() => {
        //setting state to finished arrays
        this.setState({ products: { columns: colList, rows: rowList } });
      });
  }

  render() {
    const { useState } = React;
    const { products } = this.state;

    const columns = products.columns;
    const data = products.rows;

    return (
      <div>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <MaterialTable
          columns={columns}
          data={data}
          title="Inventory"
          options={{
            grouping: true,
            exportButton: true,
            search: true,
<<<<<<< HEAD
            selection: true,
            pageSize: 20,
            pageSizeOptions: [10, 20, 30, 50, 100, 200],
=======
            actionsColumnIndex: -1,
>>>>>>> 69302e43de4a78d3a467d040f988465df0f01309
          }}
          editable={{
            onRowUpdateCancelled: (rowData) => {
              console.log("cancelled");
            },
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  db.collection("users")
                    .doc(JSON.parse(sessionStorage.getItem("userData")).uid)
                    .collection("MSKU")
                    .doc(newData.MSKU)
                    .set(newData);
                  resolve();
                }, 1000);
              }).then(() => {
                this.getDataFromDB();
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  await db
                    .collection("users")
                    .doc(JSON.parse(sessionStorage.getItem("userData")).uid)
                    .collection("MSKU")
                    .doc(oldData.MSKU)
                    .set(newData);

                  resolve();
                }, 1000);
              }).then(() => {
                this.getDataFromDB();
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  db.collection("users")
                    .doc(JSON.parse(sessionStorage.getItem("userData")).uid)
                    .collection("MSKU")
                    .doc(oldData.MSKU)
                    .delete();
                  resolve();
                }, 1000);
              }).then(() => {
                this.getDataFromDB();
              }),
          }}
        />
      </div>
    );
  }
}

export default Product;
