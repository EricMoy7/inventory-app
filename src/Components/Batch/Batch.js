import React from "react";
import { db } from "../Firebase";
import {
  Form,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";
import MaterialTable from "material-table";
import NotificationSystem from "react-notification-system";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

class Batch extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      batchName: null,
    };
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    this.uid = userData.uid;
  }

  componentWillMount = () => {
    this.getCurrentBatches();
  };

  getCurrentBatches = () => {
    const currentBatches = db
      .collection("users")
      .doc(this.uid)
      .collection("batches");

    currentBatches.onSnapshot((snap) =>
      snap.forEach((doc) => {
        this.state.currentBatches.push(doc.id);
      })
    );
  };

  addNotification = () => {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: "Batch name is empty!",
      level: "warning",
    });
  };

  state = {
    batchName: null,
  };

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  createNewBatch = (e) => {
    e.preventDefault();

    if (this.state.batchName !== null) {
      const batch = db
        .collection("users")
        .doc(this.uid)
        .collection("batches")
        .doc(this.state.batchName);

      batch.set({
        batchName: this.state.batchName,
        currentBatch: true,
        archivedBatch: false,
      });
    } else {
      this.addNotification();
    }
  };

  render() {
    return (
      <Row>
        <Col sm="3" id="createNewBatch">
          <Card>
            <CardBody>
              <CardTitle>Create Batch</CardTitle>
              <Form onSubmit={this.createNewBatch}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Batch Name</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="batchName"
                    value={this.batchName}
                    onChange={this.updateInput}
                  ></Input>
                  <Button className="btn-block" color="primary">
                    Add
                  </Button>
                </InputGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col sm="2">
          <Card>
            <React.Fragment>
              <ul>
                {this.state.currentBatches.map((listItem) => (
                  <li key={listItem}>{listItem}</li>
                ))}
              </ul>
            </React.Fragment>
          </Card>
        </Col>

        <Col sm="5">
          <Card>
            <MaterialTable />
          </Card>
        </Col>
        <NotificationSystem ref={this.notificationSystem} />
      </Row>
    );
  }
}

export default Batch;
