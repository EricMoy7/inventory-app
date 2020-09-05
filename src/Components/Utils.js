/*-----------------------------------------------------------------------------------------------------------
This file contains utility components to access the backend api quickly

productCRUD():

parameters: action(str create,read,update,delete),path(str /collection/doc format for DB), data(str JSON),
workerName(str Current Worker), key(str MSKU)

returns: API response
------------------------------------------------------------------------------------------------------------*/

import Axios from "axios";

class ProductCRUD {
  constructor(action, type, data, uid, workerName, key) {
    this.action = action;
    this.type = type;
    this.newData = data;
    this.uid = uid;
    this.workerName = workerName;
    this.key = key;
  }

  init() {
    const pathBank = {
      workerProducts: `users/${this.uid}/workers/${this.workerName}/Inventory/${this.key}`,
      mainProducts: `users/${this.uid}/MSKU/${this.key}`,
    };
    switch (this.type) {
      case "worker":
        this.postRequest(pathBank.workerProducts);
        break;
      case "main":
        this.postRequest(pathBank.mainProducts);
        break;
    }
  }

  postRequest(path) {
    const newData = this.newData;
    const body = {
      MSKU: newData.MSKU,
      ASIN: newData.ASIN,
      product_cost: newData.product_cost,
      supplier: newData.supplier,
      supplier_url: newData.supplier_url,
      Price: newData.Price,
    };
    Axios.request({
      method: "post",
      url: `https://us-central1-inventorywebapp-d01bc.cloudfunctions.net/productRequest?action=${this.action}&path=${path}`,
      data: body,
    });
  }
}

export default ProductCRUD;
