import { db } from "../../../Firebase";
import React, { useState, useEffect } from "react";
import {
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Axios from "axios";

const BatchSelector = (props) => {
  const uid = props.uid;
  const batchesDB = `users/${uid}/batches/current/batches/`;

  const [currentBatches, setCurrentBatches] = useState([]);
  const [currentBatch, setCurrentBatch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getBatches();
  }, []);

  function getBatches() {
    db.collection(batchesDB).onSnapshot((snap) => {
      const data = snap.docs.map((doc) => doc.data());
      setCurrentBatches(data);
      console.log(data.length);
      if (data.length > 1) {
        for (let doc of data) {
          if (doc.currentBatch === true) {
            setCurrentBatch(doc.batchName);
          }
        }
      } else {
        db.doc(`${batchesDB + data[0].batchName}`).update({
          currentBatch: true,
        });
        setCurrentBatch(data[0].batchName);
      }
    });
  }

  const handleChange = (event) => {
    if (currentBatch) {
      db.doc(batchesDB + `${currentBatch}`).update({
        currentBatch: false,
      });
    }
    db.doc(batchesDB + `${event.target.value}`).update({
      currentBatch: true,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button
        onClick={() => {
          Axios.get(
            `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/shipping/archiveBatch`,
            { params: { uid, batchName: currentBatch } }
          );
        }}
      >
        Archive Batch
      </Button>
      <FormControl>
        <Select
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={currentBatch}
          onChange={handleChange}
        >
          {currentBatches.map((batch) => (
            <MenuItem value={batch.batchName}>{batch.batchName}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default BatchSelector;
