import { db } from "../../../Firebase";
import React, { useState, useEffect } from "react";
import {
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";

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
      for (let doc of data) {
        if (doc.currentBatch === true) {
          setCurrentBatch(doc.batchName);
        }
      }
    });
  }

  const handleChange = (event) => {
    console.log(currentBatch);
    db.doc(batchesDB + `${currentBatch}`).update({
      currentBatch: false,
    });
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
  );
};

export default BatchSelector;
