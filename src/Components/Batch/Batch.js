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
import ProductCRUD from "../Utils";
import Products from "../../Components/Products/Products";

function Batch() {
  const uid = JSON.parse(sessionStorage.getItem("userData")).uid;
  const headersPath = `users/${uid}/settings/batchTableHeaders`;
  const inventoryPath = `users/${uid}/batches/current/batches`;
  return (
    <Products
      uid={uid}
      headersPath={headersPath}
      inventoryPath={inventoryPath}
    />
  );
}

export default Batch;
