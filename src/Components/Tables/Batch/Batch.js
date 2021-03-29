import React, { useState, useEffect } from "react";
import { db } from "../../Firebase";
import { renderTableStyle } from "./Utilities/RenderingStyles";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import { Container } from "@material-ui/core";
import MaterialTable from "material-table";
import LibraryAddIcon from "@material-ui/icons/LibraryAdd";
import StoreIcon from "@material-ui/icons/Store";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Paper from "@material-ui/core/Paper";

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

function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = "";
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? "" : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (j > 0) finalVal += ",";
      finalVal += result;
    }
    return finalVal + "\n";
  };

  var csvFile = "";
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

const Batch = (props) => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [singleAction, setSingleAction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [currentBatch, setCurrentBatch] = useState("");

  const batchesDB = db.collection(`users/${props.uid}/batches/current/batches`);

  useEffect(() => {
    getBatches();
    getHeaderData();
    setIsLoading(false);
  }, []);

  function getBatches() {
    const unsubscribe = batchesDB.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      for (let batch of data) {
        if (batch.currentBatch === true) {
          const currentBatch = batch.batchName;
          getInventoryData(currentBatch);
          setCurrentBatch(currentBatch);
          return currentBatch;
        }
      }
    });
    return () => unsubscribe();
  }

  function getInventoryData(currentBatch) {
    const inventory = db.collection(
      `users/${props.uid}/batches/current/batches/${currentBatch}/inventory`
    );
    const unsubscribe = inventory.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setRows(data);
    });
    return () => unsubscribe();
  }

  function getHeaderData() {
    const headers = db.doc(`users/${props.uid}/settings/batchTableHeaders`);
    const unsubscribe = headers.onSnapshot((snapshot) => {
      let colList = snapshot.data().columns;

      setColumns(renderTableStyle(colList));
    });
    return () => unsubscribe;
  }

  const uid = props.uid;
  const currentPath = `users/${uid}/batches/current/batches/${currentBatch}/inventory`;

  return (
    <Container fluid maxWidth="100%">
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
          exportCsv: (columns, data) => {
            let col = [];
            let dat = [];
            for (let i = 0; i < columns.length; i++) {
              col.push(columns[i].title);
            }
            dat.push(col);
            for (let j = 0; j < data.length; j++) {
              let single = data[j];
              dat.push([
                " ",
                single.MSKU,
                single.ASIN,
                single.name,
                single.product_cost,
                single.quantity,
                single.supplier,
                single.date,
                single.Price,
                "new",
                single.expiration ? single.expiration : " ",
              ]);
            }
            exportToCsv("test.csv", dat);
          },
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
                db.doc(`${currentPath}/${newData.MSKU}`).set(newData, {
                  merge: true,
                });
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                db.doc(`${currentPath}/${oldData.MSKU}`).update(newData);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                db.doc(`${currentPath}/${oldData.MSKU}`).delete();

                resolve();
              }, 1000);
            }),
        }}
        actions={[
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
                .doc(this.uid)
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
    </Container>
  );
};

export default Batch;
