import { db } from "../../../Firebase";
import React, { useState, useEffect } from "react";
import { TextField, Button } from "@material-ui/core";

//TODO: Repetitive code to fix *

const BatchCrud = (props) => {
  const uid = props.uid;
  const [newBatchName, setNewBatchName] = useState("");

  //*FIX*//
  const batchesDB = `users/${uid}/batches/current/batches/`;
  const [currentBatches, setCurrentBatches] = useState([]);
  const [currentBatch, setCurrentBatch] = useState("");

  //*FIX*//
  useEffect(() => {
    getCurrentBatches();
  }, []);

  async function getCurrentBatches() {
    let batches = await db
      .collection(`users/${uid}/batches/current/batches`)
      .get();
    batches = batches.docs.map((doc) => doc.id);

    if (batches.length !== 0) {
      for (let name of batches) {
        const data = await db.doc(`users/${uid}/batches/current/batches/${name}`).get()
        setCurrentBatch(data.data().batchName)
      }
    }
    return batches;
  }

  async function resetCurrentBatch() {
    const batch = db.batch();
    const batches = await getCurrentBatches();

    for (let id of batches) {
      const path = db.doc(`users/${uid}/batches/current/batches/${id}`);
      batch.update(path, { currentBatch: false });
    }
    getCurrentBatches()
    return batch.commit();
  }

  function createNewBatch(batchName) {
    db.doc(`users/${uid}/batches/current/batches/${newBatchName}`).set({
      batchName,
      currentBatch: true,
    });
  }

  function deleteBatch(batchName) {
    db.doc(`users/${uid}/batches/current/batches/${batchName}`).delete()
  }

  return (
    <div>
      <TextField
        onChange={(e) => {
          setNewBatchName(e.target.value);
          console.log(e.target.value);
        }}
      />
      <Button
        onClick={() => {
          resetCurrentBatch();
          createNewBatch(newBatchName);
          console.log("Button Pressed");
        }}
      >
        Create Batch
      </Button>
      <Button onClick={() => {
        deleteBatch(currentBatch); 
        }}>Delete Batch</Button>
    </div>
  );
};

export default BatchCrud;
