import React, { useState, useEffect } from "react";
import { db } from "../../Firebase";
import { renderTableStyle } from "./Utilities/RenderingStyles";

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

const Batch = (props) => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
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
};
