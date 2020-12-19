import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import MaterialTable from "material-table";
import { renderTableStyle } from "../Tables/Products/Utilities/RenderingStyles";

export default function ShipmentPlanInventory() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [currentShipment, setCurrentShipment] = useState("");

  const uid = JSON.parse(sessionStorage.getItem("userData")).uid;
  const shipmentDB = `users/${uid}/shipments`;
  const headers = db.doc(`users/${uid}/settings/batchTableHeaders`);

  useEffect(() => {
    getCurrentShipment();
    getHeaders();
  }, []);

  async function getCurrentShipment() {
    const unsubscribe = db
      .collection(shipmentDB)
      .where("currentShipment", "==", true)
      .onSnapshot((snapshot) => {
        setCurrentShipment(snapshot.docs[0].id);
        getInventory(snapshot.docs[0].id);
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

  function getInventory(shipment) {
    const invDB = db.collection(`users/${uid}/shipments/${shipment}/inventory`);
    const unsubscribe = invDB.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setRows(data);
    });
    return () => unsubscribe;
  }

  return (
    <div>
      <MaterialTable columns={columns} data={rows}></MaterialTable>
    </div>
  );
}
