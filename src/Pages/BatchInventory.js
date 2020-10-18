import { render } from "@testing-library/react";
import React from "react";
import Batch from "../Components/Tables/Batch/Batch";

const BatchInventory = (props) => {
  const uid = JSON.parse(sessionStorage.getItem("userData")).uid;
  const headersPath = `users/${uid}/settings/tableHeaders`;
  const inventoryPath = `users/${uid}/MSKU`;
  render(
    <Batch uid={uid} headersPath={headersPath} inventoryPath={inventoryPath} />
  );
};

export default BatchInventory;
