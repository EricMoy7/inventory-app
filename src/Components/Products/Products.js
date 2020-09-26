import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import Axios from "axios";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import { renderTableStyle } from "./Utilities/RenderingStyles";
import ProductCRUD from "../Utils";

const uid = JSON.parse(sessionStorage.getItem("userData")).uid;
const inventory = db.doc(`users/${uid}/snapshots/inventorySnapshot`);
const headers = db.doc(`users/${uid}/settings/tableHeaders`);

const Product = () => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const unsubscribe = headers.onSnapshot((snapshot) => {
      let colList = snapshot.data().columns;

      setColumns(renderTableStyle(colList));
    });
    return () => unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = inventory.onSnapshot((snapshot) => {
      const data = Object.entries(snapshot.data().products);
      console.log(data);
      setRows(data);
    });
    return () => unsubscribe();
  });

  return (
    <Container>
      <MaterialTable
        columns={columns}
        data={rows}
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
                db.doc(`users/${uid}/MSKU/${newData.MSKU}`).set(newData);
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                db.doc(`users/${uid}/MSKU/${oldData.MSKU}`).update(newData);

                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                db.doc(`users/${uid}/MSKU/${oldData.MSKU}`).delete();

                resolve();
              }, 1000);
            }),
        }}
      />
    </Container>
  );
};

export default Product;
