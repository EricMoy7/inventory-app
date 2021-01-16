import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import { makeStyles } from "@material-ui/core/styles";
import DymoPrinter from "./DymoPrinter";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

import MaterialTable from "material-table";
import { renderTableStyle } from "../Tables/Products/Utilities/RenderingStyles";

import Axios from "axios";

export default function ShipmentLocations() {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [modalStyle] = useState(getModalStyle);
  const [currentShipment, setCurrentShipment] = useState("");
  const [rows, setRows] = useState([]);

  const uid = JSON.parse(sessionStorage.getItem("userData")).uid;
  const headers = db.doc(`users/${uid}/settings/batchTableHeaders`);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    paper: {
      position: "absolute",
      width: 1500,
      height: 900,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    getLocations();
    getHeaders();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getLocations() {
    const unsubscribe = db
      .collection(`users/${uid}/shipments`)
      .where("currentShipment", "==", true)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs[0].data().locations;
        if (data && data !== undefined) {
          const locationsArray = Object.values(data);
          setLocations(locationsArray);
          setCurrentShipment(snapshot.docs[0].id);
        }
      });
    return () => unsubscribe;
  }

  function getHeaders() {
    const unsubscribe = headers.onSnapshot((snapshot) => {
      let colList = snapshot.data().columns;
      setColumns(renderTableStyle(colList));
    });
    return () => unsubscribe;
  }

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  function getInventory(shipment, location) {
    const invDB = db.collection(
      `users/${uid}/shipments/${shipment}/locations/${location}/inventory`
    );
    const unsubscribe = invDB.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setRows(data);
    });
    return () => unsubscribe;
  }

  const createShipmentButton = (
    <Button
      onClick={() => {
        Axios.get(
          "https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/shipping/createInboundShipment",
          {
            params: {
              uid,
              shipmentName: `${currentShipment}_${location}`,
              shipmentId: location,
            },
          }
        );
      }}
    >
      Create Shipment
    </Button>
  );

  const weightEstimate = (
    <Button
      onClick={() => {
        let weight = 0;
        for (let row of rows) {
          weight +=
            parseFloat(row.productDimensions.Weight.Value) *
            parseInt(row.quantity);
          console.log(weight);
        }
        console.log(weight);
      }}
    >
      Estimate Shipment Weight
    </Button>
  );

  const table = (
    <div style={modalStyle} className={classes.paper}>
      {createShipmentButton}
      <MaterialTable
        columns={columns}
        data={rows}
        options={{ maxBodyHeight: 600 }}
      ></MaterialTable>
    </div>
  );

  return (
    <div>
      {createShipmentButton}
      {weightEstimate}
      <DymoPrinter data={rows} />
      <List>
        {locations.map((location) => (
          <ListItem
            key={location}
            button
            onClick={() => {
              setLocation(location.ShipmentId);
              getInventory(currentShipment, location.ShipmentId);
              handleOpen();
            }}
          >
            <ListItemText
              key={location.ShipmentId}
              primary={location.ShipmentId}
            />
          </ListItem>
        ))}
      </List>
      <Modal open={open} onClose={() => handleClose()}>
        {table}
      </Modal>
    </div>
  );
}
