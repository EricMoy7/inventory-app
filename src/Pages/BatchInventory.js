import React, { useState, useEffect } from "react";
import Batch from "../Components/Tables/Batch/Batch";
import BatchSelector from "../Components/Tables/Batch/Utilities/BatchSelector";
import { db } from "../Components/Firebase";
import { FormControl, Select, Container, Paper } from "@material-ui/core";
import "./BatchInventory.css";

class BatchInventory extends React.Component {
  constructor(props) {
    super();
    this.uid = JSON.parse(sessionStorage.getItem("userData")).uid;
    this.headersPath = `users/${this.uid}/settings/batchTableHeaders`;
    this.state = { batchName: "" };
  }

  handleChange = (event) => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.name,
    });
  };

  render() {
    return (
      <div>
        <Paper className="batch-selector">
          <BatchSelector
            fullWidth={true}
            uid={this.uid}
            className="batch-selector"
          />
        </Paper>
        <Batch uid={this.uid} />
      </div>
    );
  }
}

export default BatchInventory;
