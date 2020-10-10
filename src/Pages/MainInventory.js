import React from "react";
import Products from "../Components/Products/Products";

function Inventory() {
  const uid = JSON.parse(sessionStorage.getItem("userData")).uid;
  const headersPath = `users/${uid}/settings/tableHeaders`;
  const inventoryPath = `users/${uid}/MSKU`;
  return (
    <Products
      uid={uid}
      headersPath={headersPath}
      inventoryPath={inventoryPath}
    />
  );
}

export default Inventory;
