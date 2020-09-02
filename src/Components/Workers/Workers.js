import React from "react";
import { db } from "../Firebase";
import Axios from "axios";
import { Dropdown, Col, Row, Badge } from "react-bootstrap";
import "./Worker.css";
import MaterialTable from "material-table";

class Workers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWorker: null,
    };
    this.userData = JSON.parse(sessionStorage.getItem("userData"));
    this.uid = this.userData.uid;
  }

  componentDidMount() {
    const uid = this.uid;
    Axios.get(
      `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/getWorkers`,
      {
        params: { uid },
      }
    )
      .then((workerData) => {
        this.setState({ workerData: workerData.data });
      })
      .then(() => {
        for (const worker of this.state.workerData) {
          if (worker.isCurrent === true) {
            this.setState({ currentWorker: worker.workerName });
          }
        }
      });
  }

  render() {
    return (
      <div>
        <Row className="status-bar">
          <Dropdown>
            <Dropdown.Toggle>{this.state.currentWorker}</Dropdown.Toggle>
            <Dropdown.Menu>
              {(this.state.workerData || []).map((listItem, index) => {
                return (
                  <Dropdown.Item
                    key={listItem.workerName}
                    eventKey={listItem.workerName}
                    onSelect={async (eventKey, event) => {
                      const workerDB = db
                        .collection("users")
                        .doc(this.uid)
                        .collection("workers");

                      await workerDB
                        .doc(this.state.currentWorker)
                        .set({ isCurrent: false }, { merge: true });

                      await workerDB
                        .doc(eventKey)
                        .set({ isCurrent: true }, { merge: true });

                      this.setState({ currentWorker: eventKey });
                    }}
                  >
                    {listItem.workerName}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </Row>

        <Row>
          <MaterialTable />
        </Row>
      </div>
    );
  }
}

export default Workers;
