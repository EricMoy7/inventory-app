import React, { useState, useEffect } from "react";
import { db } from "../../Firebase";
import Axios from "axios";
import MaterialTable from "material-table";
import { Container } from "@material-ui/core";
import { renderTableStyle } from "./Utilities/RenderingStyles";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import StoreIcon from "@material-ui/icons/Store";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "./useForm";
import SimplePopover from "./Utilities/Popover";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
}));

const Product = (props) => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [singleAction, setSingleAction] = useState(false);
  const [currentBatch, setCurrentBatch] = useState("");
  const [modal, setModal] = useState(false);
  const [currentSKU, setCurrentSKU] = useState(null);
  const [values, handleChange] = useForm({ quantity: 0 });
  const [rowData, setRowData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [uid, setUid] = useState(props.uid);

  useEffect(() => {
    const inventory = db.collection(props.inventoryPath);
    const headers = db.doc(props.headersPath);
    getHeaderData(headers);
    getInventoryData(inventory);
    setIsLoading(false);
  }, []);

  function getInventoryData(inventory) {
    const unsubscribe = inventory.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setRows(data);
    });
    return () => unsubscribe();
  }

  function getHeaderData(headers) {
    const unsubscribe = headers.onSnapshot((snapshot) => {
      let colList = snapshot.data().columns;

      setColumns(renderTableStyle(colList));
    });
    return () => unsubscribe;
  }

  useEffect(() => {}, [values.quantity]);

  const getCurrentBatch = async () => {
    const dbBatches = db.collection(`/users/${uid}/batches/current/batches`);
    const queryForCurrentBatch = dbBatches.where("currentBatch", "==", true);
    let currentBatch = await queryForCurrentBatch.get().then((snap) => {
      if (snap.exists) {
        setCurrentBatch(snap.docs[0].id);
        return snap.docs[0].id;
      }
    });
    return currentBatch;
  };

  const handleModalShow = () => {
    setModal(true);
  };

  const handleModalHide = () => {
    setModal(false);
    const batchUpdateQuantity = db
      .collection("users")
      .doc(uid)
      .collection("batches")
      .doc(currentBatch)
      .collection("Inventory")
      .doc(currentSKU);
    batchUpdateQuantity.set(
      {
        quantity: values.quantity,
      },
      { merge: true }
    );
    Axios.put(
      `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/productDetails/updateSingle/onHand`,
      {
        params: { uid },
        body: { rowData },
      }
    );
  };

  return (
    <Container fluid maxWidth="100%">
      <SimplePopover uid={uid} currentBatch={currentBatch}></SimplePopover>
      <MaterialTable
        isLoading={isLoading}
        options={{
          headerStyle: {
            position: "sticky",
            top: 0,
            fontSize: 12,
            whiteSpace: "nowrap",
            width: 30,
          },
          cellStyle: {
            fontSize: 12,
            alignText: "center",
          },
          padding: "dense",
          actionsColumnIndex: -1,
          filtering: true,
          grouping: false,
          exportButton: true,
          search: true,
          maxBodyHeight: 700,
          pageSize: 50,
          pageSizeOptions: [10, 25, 50, 75, 100],
          filtering: true,
        }}
        columns={columns}
        data={rows}
        detailPanel={(rowData) => {
          return (
            <div className={classes.root}>
              <Paper elevation={3} />
            </div>
          );
        }}
        editable={{
          onBulkUpdate: (changes) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                /* setData([...data, newData]); */

                resolve();
              }, 1000);
            }),
          onRowAddCancelled: (rowData) => console.log("Row adding cancelled"),
          onRowUpdateCancelled: (rowData) =>
            console.log("Row editing cancelled"),
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                db.doc(`${props.inventoryPath}/${newData.MSKU}`).set(newData, {
                  merge: true,
                });
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                db.doc(`${props.inventoryPath}/${oldData.MSKU}`).update(
                  newData
                );

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                db.doc(`${props.inventoryPath}/${oldData.MSKU}`).delete();

                resolve();
              }, 1000);
            }),
        }}
        actions={[
          {
            icon: LibraryAddIcon,
            disabled: singleAction,
            tooltip: "Add to current batch",
            onClick: async (event, rowData) => {
              event.preventDefault();
              setRowData({ rowData });
              const MSKU = rowData.MSKU;
              const dbMSKU = db.doc(`${props.inventoryPath}/${MSKU}`);

              let batchName = await getCurrentBatch();

              dbMSKU.get().then((doc) => {
                if (doc.exists) {
                  doc = doc.data();
                  const batchInventory = db.collection(
                    `users/${uid}/batches/current/batches/${batchName}/inventory`
                  );

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
                  batchInventory.doc(MSKU).set(
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
                  setCurrentSKU(MSKU);
                  handleModalShow();
                }
              });
            },
          },
          {
            icon: StoreIcon,
            disabled: singleAction,
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
      />
      <Modal show={modal} onhide={handleModalHide}>
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
                name="quantity"
                value={values.quantity}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalHide}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalHide}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Product;
