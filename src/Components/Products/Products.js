import React, { Component } from "react";
import { db } from "../Firebase";
import MaterialTable from "material-table";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import VisibilityIcon from "@material-ui/icons/Visibility";
import LinkIcon from "@material-ui/icons/Link";
import StoreIcon from "@material-ui/icons/Store";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import { Modal, Form, Button } from "react-bootstrap";
import Axios from "axios";
import Container from "@material-ui/core/Container";

class Product extends Component {
  //Initialize empty object to store product data
  state = {
    products: {},
    selection: false,
    singleAction: false,
    multiAction: true,
    currentBatch: null,
    modal: false,
    currentSKU: null,
    quantityValue: 0,
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
    this.forceUpdate();
  }
  //On load function
  async componentDidMount() {
    //getting data...
    this.getDataFromDB();
  }

  async getDataFromDB() {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const uid = userData.uid;
    var colList = [];
    var rowList = [];

    let userSet = db
      .collection("users")
      .doc(uid)
      .collection("settings")
      .doc("tableHeaders");
    await userSet.get().then((snap) => {
      colList = snap.data().columns;

      colList.map((column, idx) => {
        if (column.title === "Image") {
          colList[idx] = {
            ...column,
            render: (rowData) => (
              <a
                href={`https://www.amazon.com/dp/${rowData.ASIN}`}
                target="_blank"
              >
                <img
                  src={rowData.imageUrl}
                  style={{
                    width: rowData.imageWidth,
                    height: rowData.imageHeight,
                  }}
                  alt={rowData["Product Name"]}
                />
              </a>
            ),
          };
        }

        if (column.title === "Availible Units") {
          colList[idx] = {
            ...column,
            render: (rowData) =>
              rowData["Availible Units"] === 0 ? (
                <tr style={{ color: "red", position: "relative" }}>
                  {rowData["Availible Units"]}
                </tr>
              ) : (
                <tr style={{ color: "black", position: "relative" }}>
                  {rowData["Availible Units"]}
                </tr>
              ),
          };
        }
      });
    });

    let userInv = db.collection("users").doc(uid).collection("MSKU");
    userInv.orderBy("asc");
    await userInv
      .get()
      .then((snap) => {
        const items = {};
        snap.forEach((item) => {
          items[item.id] = item.data();
          return items;
        });
        Object.keys(items).forEach((key) => {
          rowList.push(items[key]);
        });
      })
      .then(() => {
        this.setState({ products: { columns: colList, rows: rowList } });
      });
  }

  handleModalShow = () => {
    this.setState({ modal: true });
  };
  handleModalHide = () => {
    this.setState({ modal: false });
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const uid = userData.uid;
    const batchUpdateQuantity = db
      .collection("users")
      .doc(uid)
      .collection("batches")
      .doc(this.state.currentBatch)
      .collection("Inventory")
      .doc(this.state.currentSKU);
    batchUpdateQuantity.set(
      {
        quantity: this.state.quantityValue,
      },
      { merge: true }
    );
  };

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { products } = this.state;

    const columns = products.columns;
    const data = products.rows;

    const userData = JSON.parse(sessionStorage.getItem("userData"));
    const uid = userData.uid;

    return (
      <Container fluid maxWidth="false">
        <MaterialTable
          actions={[
            {
              icon: LibraryAddIcon,
              disabled: this.state.singleAction,
              tooltip: "Add to current batch",
              onClick: async (event, rowData) => {
                event.preventDefault();
                const MSKU = rowData.MSKU;
                const dbMSKU = db
                  .collection("users")
                  .doc(uid)
                  .collection("MSKU")
                  .doc(MSKU);
                const dbBatches = db
                  .collection("users")
                  .doc(uid)
                  .collection("batches");
                const queryForCurrentBatch = dbBatches.where(
                  "currentBatch",
                  "==",
                  true
                );
                await queryForCurrentBatch
                  .get()
                  .then((snap) =>
                    snap.forEach((doc) =>
                      this.setState({ currentBatch: doc.id })
                    )
                  );

                dbMSKU.get().then((doc) => {
                  if (doc.exists) {
                    doc = doc.data();
                    const batchInventory = db
                      .collection("users")
                      .doc(uid)
                      .collection("batches")
                      .doc(this.state.currentBatch)
                      .collection("Inventory");

                    let today = new Date();
                    let dd = today.getDate();

                    let mm = today.getMonth() + 1;
                    const yyyy = today.getFullYear();
                    if (dd < 10) {
                      dd = `0${dd}`;
                    }

                    if (mm < 10) {
                      mm = `0${mm}`;
                    }
                    today = `${mm}/${dd}/${yyyy}`;

                    const {
                      MSKU,
                      ASIN,
                      Price,
                      supplier,
                      imageUrl,
                      product_cost,
                    } = doc;
                    batchInventory.doc(doc.MSKU).set(
                      {
                        MSKU,
                        ASIN,
                        Price,
                        supplier,
                        imageUrl,
                        product_cost,
                        date: today,
                        name: doc["Product Name"],
                        condition: "new",
                      },
                      { merge: true }
                    );
                    this.setState({ currentSKU: MSKU });
                    this.handleModalShow();
                  }
                });
              },
            },
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
                var query = dbLookup.where("MSKU", "in", MSKUS);
                query.get().then((Snap) => {
                  Snap.forEach((doc) => {
                    const productData = doc.data();
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
                Axios.get(
                  `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/updateInventoryRequest`,
                  {
                    params: { uid },
                  }
                );
              },
            },
            {
              icon: "camera_alt",
              tooltip: "Update Photos",
              isFreeAction: true,
              onClick: () => {
                Axios.get(
                  `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/updatePicturesRequest`,
                  {
                    params: { uid },
                  }
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
            grouping: false,
            exportButton: true,
            search: true,
            selection: this.state.selection,
            pageSize: 50,
            pageSizeOptions: [10, 20, 30, 50, 100, 200],
            addRowPosition: "first",
            headerStyle: { position: "sticky", top: 0 },
            maxBodyHeight: "800px",
            headerStyle: {
              backgroundColor: "white",
              color: "black",
              fontSize: 12,
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: 800,
            },
            rowStyle: {
              backgroundColor: "white",
              fontSize: 14,
              fontFamily: "Roboto",
              fontStyle: "normal",
              fontWeight: 100,
            },
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
                  const prevColumns = this.state.products.columns;
                  this.setState({
                    products: {
                      rows: [newData, ...data],
                      columns: prevColumns,
                    },
                  });
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                db.collection("users")
                  .doc(JSON.parse(sessionStorage.getItem("userData")).uid)
                  .collection("MSKU")
                  .doc(oldData.MSKU)
                  .set(newData);
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                const prevColumns = this.state.products.columns;
                this.setState({
                  products: { rows: [...dataUpdate], columns: prevColumns },
                });
                resolve();
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  db.collection("users")
                    .doc(JSON.parse(sessionStorage.getItem("userData")).uid)
                    .collection("MSKU")
                    .doc(oldData.MSKU)
                    .delete();
                  const dataDelete = [...data];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  const prevColumns = this.state.products.columns;
                  this.setState({
                    products: { rows: [...dataDelete], columns: prevColumns },
                  });
                  resolve();
                }, 1000);
              }),
          }}
        />
        <Modal show={this.state.modal} onhide={this.handleModalHide}>
          <Modal.Header closeButton>
            <Modal.Title>Product Quantity</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Quantity"
                  name="quantityValue"
                  value={this.state.quantityValue}
                  onChange={this.updateInput}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModalHide}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleModalHide}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default Product;
