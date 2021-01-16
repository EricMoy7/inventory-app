import React from "react";
import Products from "../Components/Tables/Products/Products";
import BatchSelector from "../Components/Tables/Batch/Utilities/BatchSelector";

function Inventory() {
  const uid = JSON.parse(sessionStorage.getItem("userData")).uid;
  const headersPath = `users/${uid}/settings/tableHeaders`;
  const inventoryPath = `users/${uid}/MSKU`;
  return (
    <div>
      <BatchSelector fullWidth={true} uid={uid} className="batch-selector" />
      <Products
        uid={uid}
        headersPath={headersPath}
        inventoryPath={inventoryPath}
      />
    </div>
  );
}

export default Inventory;
