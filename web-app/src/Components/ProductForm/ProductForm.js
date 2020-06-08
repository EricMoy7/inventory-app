import React from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  Row,
  Col,
  CardTitle,
} from "reactstrap";
import "./ProductForm.css";

class ProductForm extends React.Component {
  render() {
    return (
      <Row>
        <Col sm="3" id="newSkuForm">
          <Card>
            <CardBody>
              <CardTitle className="CardTitle">New SKU Form</CardTitle>
              <div className="DivLine"></div>
              <Form>
                <FormGroup>
                  <Label for="newSku" className="Bold">
                    New Sku:
                  </Label>
                  <Input
                    type="text"
                    name="Sku"
                    id="newSku"
                    place="Enter new SKU here."
                  />
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default ProductForm;
