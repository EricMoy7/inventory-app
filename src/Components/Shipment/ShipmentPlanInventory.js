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

  const currentPath = `${shipmentDB}/${currentShipment}/inventory`;

  return (
    <div>
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
      ></MaterialTable>
    </div>
  );
}
