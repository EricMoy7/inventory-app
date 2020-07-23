import React, { Component } from "react";
import { db } from "../Firebase";
import MaterialTable from "material-table";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import VisibilityIcon from "@material-ui/icons/Visibility";
import LinkIcon from "@material-ui/icons/Link";
import StoreIcon from "@material-ui/icons/Store";

class Product extends Component {
  //Initialize empty object to store product data
  state = {
    products: {},
    selection: false,
    singleAction: false,
    multiAction: true,
  };

  actionSwap() {
    //true for single or multi means it is disabled
    if (this.state.selection === false) {
      this.setState({ singleAction: true, multiAction: false });
    } else if (this.state.selection === true) {
      this.setState({ singleAction: false, multiAction: true });
    } else {
      console.log("Error has occured in function actionSwap()");
    }
    console.log(this.state.multiAction);
    this.forceUpdate();
  }
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
    const { products } = this.state;

    const columns = products.columns;
    const data = products.rows;

    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const uid = userData.uid;

    return (
      <div>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <MaterialTable
          actions={[
            {
              icon: StoreIcon,
              disabled: this.state.singleAction,
              tooltip: "Go to supplier website",
              onClick: (event, rowData) => {
                const url = rowData.supplier_url;
                window.open(url, rowData.MSKU);
              },
            },
            {
              icon: LinkIcon,
              disabled: this.state.singleAction,
              tooltip: "Go to Amazon Page",
              onClick: (event, rowData) => {
                const asin = rowData.ASIN;
                const amazonUrl = `https://www.amazon.com/dp/${asin}`;
                window.open(amazonUrl, asin);
              },
            },
            {
              icon: VisibilityIcon,
              tooltip: "Show/Hide URLS",
              isFreeAction: true,
              onClick: () => {
                const headers = db
                  .collection("users")
                  .doc(uid)
                  .collection("settings")
                  .doc("tableHeaders");
                headers
                  .get()
                  .then((doc) => {
                    if (doc.exists) {
                      doc = doc.data();
                      for (let i = 0; i < doc["columns"].length; i++) {
                        if (doc["columns"][i]["field"] === "supplier_url") {
                          if (doc["columns"][i]["hidden"] === true) {
                            doc["columns"][i]["hidden"] = false;
                          } else if (doc["columns"][i]["hidden"] === false) {
                            doc["columns"][i]["hidden"] = true;
                          } else {
                            console.log(
                              "An error has occured on switching URL hidden boolean"
                            );
                          }
                        }
                      }
                      headers.set(doc);
                      this.getDataFromDB();
                    } else {
                      console.log("Headers document does not exist!");
                    }
                  })
                  .catch((error) => {
                    console.log("Error getting document:", error);
                  });
              },
            },
            {
              icon: CheckBoxOutlineBlankIcon,
              tooltip: "Toggle selection",
              onClick: () => {
                this.actionSwap();
                if (this.state.selection === true) {
                  this.setState({ selection: false });
                } else if (this.state.selection === false) {
                  this.setState({ selection: true });
                } else {
                  console.log(
                    "An error has occured (Button: Toggle Selection)"
                  );
                }
              },
              isFreeAction: true,
            },
            {
              disabled: this.state.multiAction,
              icon: "shop",
              tooltip: "Buy from supplier",
              onClick: (event, rowData) => {
                let MSKUS = [];
                for (let i = 0; i < rowData.length; i++) {
                  MSKUS.push(rowData[i].MSKU);
                }

                var dbLookup = db
                  .collection("users")
                  .doc(uid)
                  .collection("MSKU");
                console.log(MSKUS);
                var query = dbLookup.where("MSKU", "in", MSKUS);
                query.get().then((Snap) => {
                  Snap.forEach((doc) => {
                    const productData = doc.data();
                    //Add if statements for blank
                    window.open(productData.supplier_url, productData.MSKU);
                    console.log("New tab opened");
                  });
                });
              },
            },
            {
              icon: "update",
              tooltip: "Update Inventory",
              isFreeAction: true,
              onClick: () => {
                fetch(
                  `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/updateInventory?uid=${uid}`,
                  { mode: "no-cors" }
                );
              },
            },
            {
              icon: "camera_alt",
              tooltip: "Update Photos",
              isFreeAction: true,
              onClick: () => {
                fetch(
                  `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/updatePictures?uid=${uid}`,
                  { mode: "no-cors" }
                );
              },
            },
          ]}
          columns={columns}
          data={data}
          title="Inventory"
          options={{
            actionsColumnIndex: -1,
            filtering: true,
            grouping: true,
            exportButton: true,
            search: true,
            selection: this.state.selection,
            pageSize: 50,
            pageSizeOptions: [10, 20, 30, 50, 100, 200],
            addRowPosition: "first",
            headerStyle: { position: "sticky", top: 0 },
            maxBodyHeight: "650px",
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
                this.forceUpdate();
              }),
          }}
        />
      </div>
    );
  }
}

export default Product;
