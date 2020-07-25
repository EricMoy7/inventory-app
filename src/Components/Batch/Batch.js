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
      currentBatches: null,
      selectedIndex: null,
      batchTableData: null,
      products: {},
    };
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    this.uid = userData.uid;
  }

  //Component Methods
  componentDidMount = () => {
    this.getDataFromDB();
    this.getBatches();
  };

  async getDataFromDB() {
    var colList = [];
    var rowList = [];

    let userSet = db
      .collection("users")
      .doc(this.uid)
      .collection("settings")
      .doc("batchTableHeaders");

    await userSet.get().then((snap) => {
      colList = snap.data().columns;

      colList.map((column, idx) => {
        if (column.title === "Image") {
          colList[idx] = {
            ...column,
            render: (rowData) => (
              <img src={rowData.imageUrl} style={{ width: 75, height: 75 }} />
            ),
          };
        }
      });
    });

    //Pulling user inventory data from user database
    var userInv = db.collection("users").doc(this.uid).collection("batches");
    const currentBatch = userInv.where("currentBatch", "==", true);
    currentBatch.get().then((snap) => {
      snap.forEach((doc) => {
        userInv = userInv.doc(doc.id).collection("Inventory");
        //Sort data by ascending
        userInv.orderBy("asc");
        //Getting object data
        userInv
          .get()
          .then((snap) => {
            //Initialize temporary object storage for parsing
            const items = {};
            //Loop through each key
            snap.forEach((item) => {
              //Restructuring object to meet table format req
              items[item.id] = item.data();
              return items;
            });

            //Looping through previous restructure and pushing to empty array
            Object.keys(items).forEach((key) => {
              rowList.push(items[key]);
            });
          })
          .then(() => {
            //setting state to finished arrays
            this.setState({ products: { columns: colList, rows: rowList } });
          });
      });
    });
  }

  getBatches = () => {
    const currentBatches = db
      .collection("users")
      .doc(this.uid)
      .collection("batches");

    currentBatches.onSnapshot((snap) => {
      let listOfBatches = [];
      snap.forEach((doc) => {
        listOfBatches.push(doc.id);
      });
      this.setState({ currentBatches: listOfBatches });
    });
  };

  addNotification = () => {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: "Batch name is empty!",
      level: "warning",
    });
  };

  createNewBatch = (e) => {
    e.preventDefault();

    if (this.state.batchName !== null) {
      const otherCurrentBatches = db
        .collection("users")
        .doc(this.uid)
        .collection("batches");

      otherCurrentBatches.get().then((snap) => {
        snap.forEach((doc) => {
          if (doc.data().currentBatch === true) {
            const workingDoc = db
              .collection("users")
              .doc(this.uid)
              .collection("batches")
              .doc(doc.data().batchName);
            workingDoc.update({ currentBatch: false });
          }
        });
      });

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

  updateBatchTableData = (batchName) => {
    const batchData = db
      .collection("users")
      .doc(this.uid)
      .collection("batches");
  };

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleListItemClick = async (event, index) => {
    this.setState({ selectedIndex: index });
    const batchDataCollection = db
      .collection("users")
      .doc(this.uid)
      .collection("batches");

    await batchDataCollection
      .where("currentBatch", "==", true)
      .get()
      .then((snap) =>
        snap.forEach((doc) => {
          batchDataCollection.doc(doc.id).update({ currentBatch: false });
        })
      );

    const batchData = batchDataCollection.doc(this.state.currentBatches[index]);
    await batchData.update({ currentBatch: true });
    this.getDataFromDB();
  };

  render() {
    const { products } = this.state;

    const columns = products.columns;
    const data = products.rows;
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
              <List>
                {(this.state.currentBatches || []).map((listItem, index) => {
                  return (
                    <ListItem
                      key={listItem}
                      button
                      selected={this.state.selectedIndex === index}
                      onClick={(event) =>
                        this.handleListItemClick(event, index)
                      }
                    >
                      {listItem}
                    </ListItem>
                  );
                })}
              </List>
            </React.Fragment>
          </Card>
        </Col>

        <Col sm="5">
          <Card>
            <MaterialTable data={data} columns={columns} />
          </Card>
        </Col>
        <NotificationSystem ref={this.notificationSystem} />
      </Row>
    );
  }
}

export default Batch;
