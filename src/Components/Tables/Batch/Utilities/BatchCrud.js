import { db } from "../../../Firebase";
import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";

const BatchCrud = (props) => {
  const uid = props.uid;
  const [newBatchName, setNewBatchName] = useState("");

  async function getCurrentBatches() {
    let batches = await db
      .collection(`users/${uid}/batches/current/batches`)
      .get();
    batches = batches.docs.map((doc) => doc.id);
    return batches;
  }

  async function resetCurrentBatch() {
    const batch = db.batch();
    const batches = await getCurrentBatches();

    for (let id of batches) {
      const path = db.doc(`users/${uid}/batches/current/batches/${id}`);
      batch.update(path, { currentBatch: false });
    }
    return batch.commit();
  }

  function createNewBatch(batchName) {
    db.doc(`users/${uid}/batches/current/batches/${newBatchName}`).set({
      batchName,
      currentBatch: true,
    });
  }

  function deleteBatch(batchName) {
    db.doc(`users/${uid}/batches/current/batches/${newBatchName}`).set({
      batchName,
      currentBatch: true,
    });
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
      <Button>Delete Batch</Button>
    </div>
  );
};

export default BatchCrud;
