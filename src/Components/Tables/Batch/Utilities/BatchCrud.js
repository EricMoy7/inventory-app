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
    getBatches();
  }, []);

  async function getCurrentBatches() {
    let batches = await db
      .collection(`users/${uid}/batches/current/batches`)
      .get();
    batches = batches.docs.map((doc) => doc.id);
    return batches;
  }

//*FIX*//
//get batches has get current batches
function getBatches() {
  db.collection(batchesDB).onSnapshot((snap) => {
    const data = snap.docs.map((doc) => doc.data());
    setCurrentBatches(data);
    if (data.length > 1) {
      for (let doc of data) {
        if (doc.currentBatch === true) {
          setCurrentBatch(doc.batchName);
        }
      }
    } else {
      console.log(data)
      if (data) {
        db.doc(`${batchesDB + data[0].batchName}`).update({
          currentBatch: true,
        });
        setCurrentBatch(data[0].batchName);
      }
    }
  });
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
