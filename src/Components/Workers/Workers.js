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
      products: {},
      MSKU: null,
      ASIN: null,
      product_cost: null,
      supplier: null,
      listMSKU: null,
      supplier_url: null,
      Price: null,
    };
    this.userData = JSON.parse(sessionStorage.getItem("userData"));
    this.uid = this.userData.uid;
  }

  async componentDidMount() {
    const uid = this.uid;
    const workerData = await Axios.get(
      `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/getWorkers`,
      {
        params: { uid },
      }
    );
    this.setState({ workerData: workerData.data });

    for (const worker of this.state.workerData) {
      if (worker.isCurrent === true) {
        this.setState({ currentWorker: worker.workerName });
      }
    }

    await this.getDataFromDB();
  }

  async getDataFromDB() {
    //Initializing empty array for column headers and row data
    var colList = [];
    var rowList = [];

    //Pulling settings data from user database
    //TODO: Create settings for user provided headers
    let userSet = db
      .collection("users")
      .doc(this.uid)
      .collection("settings")
      .doc("workerTableHeaders");

    //Getting user column headers
    await userSet.get().then((snap) => {
      //Saving column headers to previous empty array
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

    let userInv = db
      .collection("users")
      .doc(this.uid)
      .collection("workers")
      .doc(this.state.currentWorker)
      .collection("Inventory");
    userInv.orderBy("asc");
    await userInv
      .get()
      .then((snap) => {
        const items = {};
        snap.forEach((item) => {
          items[item.id] = item.data();
          return items;
        });
        Object.keys(items).forEach((key) => {
          rowList.push(items[key]);
        });
      })
      .then(() => {
        this.setState({ products: { columns: colList, rows: rowList } });
      });
  }

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    console.log(this.state);
  };

  addProduct = () => {
    Axios.get(
      `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/workerAddProductRequest?` +
        `uid=${this.uid}&` +
        `workerName=${this.state.currentWorker}&` +
        `ASIN=${this.state.ASIN}&` +
        `MSKU=${this.state.MSKU}&` +
        `product_cost=${this.state.product_cost}&` +
        `supplier=${this.state.supplier}&` +
        `supplier_url=${this.state.supplier_url}&` +
        `Price=${this.state.Price}`
    );
  };

  render() {
    const {
      MSKU,
      ASIN,
      product_cost,
      supplier,
      supplier_url,
      Price,
    } = this.state;
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

          <Form onSubmit={this.addProduct}>
            <Form.Row className="">
              <Col>
                <Form.Control
                  placeholder="MSKU"
                  onChange={this.updateInput}
                  value={MSKU || ""}
                  name="MSKU"
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="ASIN"
                  onChange={this.updateInput}
                  value={ASIN || ""}
                  name="ASIN"
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Product Cost"
                  onChange={this.updateInput}
                  value={product_cost || ""}
                  name="product_cost"
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Supplier"
                  onChange={this.updateInput}
                  value={supplier || ""}
                  name="supplier"
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Supplier URL"
                  onChange={this.updateInput}
                  value={supplier_url || ""}
                  name="supplier_url"
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="List Price"
                  onChange={this.updateInput}
                  value={Price || ""}
                  name="Price"
                />
              </Col>
              <Col sm="1">
                <Button type="submit">Submit </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>

        <Container fluid className="body-float">
          <MaterialTable
            className="fill-space"
            title={`${this.state.currentWorker}'s Finds`}
            columns={this.state.products.columns}
            data={this.state.products.rows}
          />
        </Container>
      </Container>
    );
  }
}

export default Workers;
