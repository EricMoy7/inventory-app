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

class Batch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      batchName: null,
    };
    this.userData = JSON.parse(sessionStorage.getItem("userData"));
    this.uid = this.userData.uid;
  }

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
        .colletion("users")
        .doc(this.uid)
        .collection("batches")
        .doc(this.state.batchName);

      batch.set({ batchName: this.state.batchName });
    } else {
     
      );
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
          <Card></Card>
        </Col>

        <Col sm="5">
          <Card>
            <MaterialTable />
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Batch;
