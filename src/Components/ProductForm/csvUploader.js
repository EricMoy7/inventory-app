import axios from "axios";
import { db } from "../Firebase";
import React, { Component } from "react";

import Papa from "papaparse";

class csvUploader extends Component {
  state = {
    // Initially, no file is selected
    selectedFile: null,
  };

  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };

  // On file upload (click the upload button)
  onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    // Details of the uploaded file
    console.log(this.state.selectedFile);

    Papa.parse(this.state.selectedFile, {
      error: (error, file) => {
        console.log("Error");
      },
      complete: async (results, file) => {
        console.log(results);
        console.log("Starting database upload");
        const batch = db.batch();
        const data = results.data;
        const header = results.data[0];
        const userData = JSON.parse(sessionStorage.getItem("userData"));

        const headerIndex = {
          //Todo: Validate user options and allow custom input
          MSKU: header.indexOf("MSKU"),
          ASIN: header.indexOf("ASIN"),
          product_cost: header.indexOf("Buy Price"),
          supplier: header.indexOf("Supplier"),
        };

        for (let i = 1; i < data.length; i++) {
          if (data[i][headerIndex.MSKU] && data[i][headerIndex.MSKU] !== "") {
            console.log(data[i][headerIndex.MSKU]);
            const userInventory = db
              .collection("users")
              .doc(userData.uid)
              .collection("MSKU")
              .doc(data[i][headerIndex.MSKU]);
            batch.set(
              userInventory,
              {
                MSKU: data[i][headerIndex.MSKU],
                ASIN: data[i][headerIndex.ASIN],
                product_cost: data[i][headerIndex.product_cost],
                supplier: data[i][headerIndex.supplier],
              },
              { merge: true }
            );
          }
        }
        await batch.commit();
        console.log("Finished database upload");
      },
    });
  };

  // File content to be displayed after
  // file upload is complete
  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <h1>GeeksforGeeks</h1>
        <h3>File Upload using React!</h3>
        <div>
          <input type="file" onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>Upload!</button>
        </div>
        {this.fileData()}
      </div>
    );
  }
}

export default csvUploader;
