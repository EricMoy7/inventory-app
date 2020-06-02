//Libraries
const express = require("express");

const app = express();
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const credentials = {
  accessKey: "AKIAIPHR7XOXFJFBWQEQ",
  secretKey: "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",
  sellerId: "A350A0H0CAQ28C",
};

var amazonMws = require("../../../node_modules/amazon-mws/lib/amazon-mws")(
  credentials.accessKey,
  credentials.secretKey
);
amazonMws.setResponseFormat("JSON");

const inventoryReportParams = {
  reportType: "_GET_FLAT_FILE_OPEN_LISTINGS_DATA_",
};

var responseNew = "";
function request(function(req, res)) {
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
    }
  );
}

console.log(request());

// function sleep(milliseconds) {
//   let timeStart = new Date().getTime();
//   while (true) {
//     let elapsedTime = new Date().getTime() - timeStart;
//     if (elapsedTime > milliseconds) {
//       break;
//     }
//   }
// }
