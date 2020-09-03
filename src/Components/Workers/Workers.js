import React from "react";
import { db } from "../Firebase";
import Axios from "axios";
import {
  Dropdown,
  Col,
  Row,
  Badge,
  Container,
  Form,
  Button,
} from "react-bootstrap";
import "./Worker.css";
import MaterialTable from "material-table";

class Workers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWorker: null,
      workerData: null,
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
      })
      .then((workerName) => {
        Axios.get(
          `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/getWorkers`,
          {
            params: { uid: uid, workerName: workerName },
          }
        ).then((workerData) => {
          this.setState({ workerData });
          console.log(this.state.workerData);
        });
      });
  }

  render() {
    return (
      <Container className="" fluid>
        <Container className="header-float" fluid>
          <Row id="workerSelector" className=" centering">
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

          <Form.Row className="">
            <Col>
              <Form.Control placeholder="MSKU" />
            </Col>
            <Col>
              <Form.Control placeholder="ASIN" />
            </Col>
            <Col>
              <Form.Control placeholder="Product Cost" />
            </Col>
            <Col>
              <Form.Control placeholder="Supplier" />
            </Col>
            <Col>
              <Form.Control placeholder="Supplier URL" />
            </Col>
            <Col>
              <Form.Control placeholder="List Price" />
            </Col>
            <Col sm="1">
              <Button>Submit </Button>
            </Col>
          </Form.Row>
        </Container>

        <Container fluid className="body-float">
          <MaterialTable
            className="fill-space"
            title={`${this.state.currentWorker}'s Finds`}
          />
        </Container>
      </Container>
    );
  }
}

export default Workers;
