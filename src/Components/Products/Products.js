import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import Axios from "axios";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";

const uid = JSON.parse(sessionStorage.getItem("userData")).uid;
const inventory = db.collection(`users/${uid}/MSKU`);
const headers = db.doc(`users/${uid}/settings/tableHeaders`);

function renderTableStyle(colList) {
  colList.map((column, idx) => {
    if (column.title === "Image") {
      colList[idx] = {
        ...column,
        render: (rowData) => (
          <a href={`https://www.amazon.com/dp/${rowData.ASIN}`} target="_blank">
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
  return colList;
}

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
      const data = snapshot.docs.map((doc) => doc.data());
      setRows(data);
    });
    return () => unsubscribe();
  });

  return (
    <Container>
      <MaterialTable columns={columns} data={rows} editable={true} />
    </Container>
  );
};

export default Product;

/*
const uid = JSON.parse(sessionStorage.getItem("userData")).uid;
  const inventory = db.collection(`users/${uid}/MSKU`);
  const headers = db.doc(`users/${uid}/settings/tableHeaders`);
  */
