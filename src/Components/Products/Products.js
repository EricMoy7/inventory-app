import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import Axios from "axios";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import { renderTableStyle } from "./Utilities/RenderingStyles";

const uid = JSON.parse(sessionStorage.getItem("userData")).uid;
const inventory = db.collection(`users/${uid}/MSKU`);
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
