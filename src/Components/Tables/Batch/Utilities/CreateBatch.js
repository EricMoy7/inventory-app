import { db } from "../../../Firebase";
import React from "react";
import { TextField, Button } from "@material-ui/core";

const CreateBatch = (props) => {
  const uid = props.uid;

  function createNewbatch(batchName) {
    db.doc(`users/${uid}/batches/current/batches/${batchName}`).set({
      batchName,
      currentBatch: true,
    });
  }

  return (
    <div>
      <TextField />
      <Button></Button>
    </div>
  );
};
