import { db } from "../Firebase";
import React from "react";
import { Button, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import Axios from "axios";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newHeaders: {},
      oldHeaders: {},
    };
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    this.uid = userData.uid;
  }

  change = async () => {
    const tableHeaders = db
      .collection("users")
      .doc(this.uid)
      .collection("settings")
      .doc("tableHeaders");
    let activeDoc = await tableHeaders.get();
    let array = activeDoc.data().columns;
    array.push({ field: "FC Processing", title: "FC Processing" });

    tableHeaders.set({ columns: array });
  };

  getHeaders = async (uid, tableID) => {
    const data = await Axios.get(
      `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/workerAddProductRequest?uid=${uid}&tableID=${tableID}`
    );
    this.setState({ [tableID]: data });
  };

  checkHeaders = (tableID) => {};

  render() {
    return (
      <div>
        <ToggleButtonGroup type="checkbox">
          <ToggleButton value="Image" name="Image">
            Image
          </ToggleButton>
          <ToggleButton value={2} name="Product Name">
            Product Name
          </ToggleButton>
          <ToggleButton value={3} name="MSKU">
            MSKU
          </ToggleButton>
          <ToggleButton value={4} name="ASIN">
            ASIN
          </ToggleButton>
          <ToggleButton value={5} name="supplier">
            Supplier
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    );
  }
}

export default Settings;
