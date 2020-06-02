const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const credentials = {
  accessKey: "AKIAIPHR7XOXFJFBWQEQ",
  secretKey: "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",
  sellerId: "A350A0H0CAQ28C",
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

var amazonMws = require("../../../node_modules/amazon-mws/lib/amazon-mws")(
  credentials.accessKey,
  credentials.secretKey
);

function mwsCallBack(error, response, res) {
  if (error) {
    console.log("error products", error);
    return;
  }
  console.log(response);
  // The parameter from express.js that will help send this call to client
  res.send(response);
}

function request(function(req, res) {
    amazonMws.reports.submit(
    {
      Version: "2009-01-01",
      Action: "RequestReport",
      SellerId: credentials.sellerId,
      ReportType: inventoryReportParams.reportType,
    },
    function (error, response) {
      if (error) {
        console.log("Error: ", error);
        return;
      } else {
        console.log("Request sent with no errors.");
        console.log("----------------------------");
        return request(response.ReportRequestInfo.ReportRequestId);
      }
    });
};