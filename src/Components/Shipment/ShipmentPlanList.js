import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { db } from "../Firebase";

export default function ShipmentPlanList() {
  const [data, setData] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const uid = JSON.parse(sessionStorage.getItem("userData")).uid;

  useEffect(() => {
    getShipments();
  }, []);

  function getShipments() {
    const shipments = db.collection(`/users/${uid}/shipments`);
    const unsubscribe = shipments.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.id);
      setData(data);
    });
    return () => unsubscribe();
  }

  const handleListItemClick = (event, idx, name) => {
    setSelectedIndex(idx);
    console.log(name);
  };

  return (
    <List>
      {data.map((name, idx) => (
        <ListItem
          key={idx}
          selected={selectedIndex === idx}
          onClick={(e) => handleListItemClick(e, idx, name)}
          button
        >
          {name}
        </ListItem>
      ))}
    </List>
  );
}
