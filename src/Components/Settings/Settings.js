import { db } from "../Firebase";
import React from "react";
import { Button } from "react-bootstrap";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  render() {
    return (
      <div>
        <Button onClick={this.change} />
      </div>
    );
  }
}

export default Settings;
