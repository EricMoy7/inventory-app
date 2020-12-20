import { db } from "../../../Firebase";
import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";

const CreateBatch = (props) => {
  const uid = props.uid;
  const [newBatchName, setNewBatchName] = useState("");

  function createNewBatch(batchName) {
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
          createNewBatch(newBatchName);
        }}
      >
        Create Batch
      </Button>
    </div>
  );
};

export default CreateBatch;
