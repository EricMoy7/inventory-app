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
  Modal,
} from "reactstrap";
import MaterialTable from "material-table";
import NotificationSystem from "react-notification-system";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import "../Batch/Batch.css";

class Batch extends React.Component {
  notificationSystem = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      batchName: null,
      currentBatches: null,
      currentBatch: null,
      selectedIndex: null,
      batchTableData: null,
      products: {},
      modal: false,
    };
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    this.uid = userData.uid;
    this.deleteBatch = this.deleteBatch.bind(this);
    this.archiveBatch = this.archiveBatch.bind(this);
    this.updateOnHand = this.updateOnHand.bind(this);
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
        if (doc.data().archivedBatch !== true) {
          listOfBatches.unshift(doc.id);
          if (doc.data().currentBatch === true) {
            this.setState({ currentBatch: doc.id });
          }
        }
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

  deleteBatch = () => {
    const currentBatchDB = db
      .collection("users")
      .doc(this.uid)
      .collection("batches");

    const { currentBatches, currentBatch } = this.state;
    try {
      const idCurrentBatch = currentBatches.indexOf(this.state.currentBatch);
      currentBatches.splice(idCurrentBatch, 1);
      this.setState({ currentBatches });

      currentBatchDB.doc(currentBatch).delete();
    } catch (error) {
      console.error(error);
    }
  };

  archiveBatch = () => {
    const currentBatchDB = db
      .collection("users")
      .doc(this.uid)
      .collection("batches");
    const { currentBatches, currentBatch } = this.state;

    const idCurrentBatch = currentBatches.indexOf(this.state.currentBatch);
    currentBatches.splice(idCurrentBatch, 1);
    this.setState({ currentBatches });

    currentBatchDB.doc(currentBatch).set({ archivedBatch: true });
  };

  updateOnHand = async () => {
    const currentBatches = db
      .collection("users")
      .doc(this.uid)
      .collection("batches");
    const currentInventory = db
      .collection("users")
      .doc(this.uid)
      .collection("MSKU");

    const inventory = await currentInventory.get();
    for (const product of inventory.docs) {
      currentInventory
        .doc(product.id)
        .set({ onHandUnits: "0" }, { merge: true });
    }

    for (const batch of this.state.currentBatches) {
      let batchData = await currentBatches.doc(batch).get();
      batchData = batchData.data();
      if (batchData.archivedBatch !== true) {
        let batchInventory = await currentBatches
          .doc(batch)
          .collection("Inventory")
          .get();
        for (const product of batchInventory.docs) {
          const productId = product.id;
          const quantity = product.data().quantity;
          console.log(quantity);
          currentInventory
            .doc(productId)
            .set({ onHandUnits: quantity }, { merge: true });
        }
      }
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

  handleModalShow = () => {
    this.setState({ Modal: true });
  };
  handleModalHide = () => {
    this.setState({ Modal: false });
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

        <Col sm="1">
          <Button onClick={this.archiveBatch}>Archive Batch</Button>
          <Button onClick={this.deleteBatch}>Delete Batch</Button>
          <Button>Rename Batch</Button>
          <Button onClick={this.updateOnHand}>Update Batch Amounts</Button>
        </Col>

        <Card className="table">
          <MaterialTable
            className="table"
            data={data}
            columns={columns}
            options={{ exportButton: true }}
          />
        </Card>
        <NotificationSystem ref={this.notificationSystem} />
      </Row>
    );
  }
}

export default Batch;
