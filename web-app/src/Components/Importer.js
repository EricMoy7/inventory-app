const fetch = require("node-fetch");

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

function asyncTest() {
  console.log("Starting requests");
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
        console.log("Found request Id");
        requestId = response.ReportRequestInfo.ReportRequestId;
        getReportRequestList(requestId);
      }
    }
  );
}

function getReportRequestList(requestId) {
  amazonMws.reports.search(
    {
      Version: "2009-01-01",
      Action: "GetReportRequestList",
      SellerId: credentials.sellerId,
      "ReportRequestIdList.Id.1": requestId,
    },
    function (error, response) {
      if (error) {
        console.log("Error (ReportList)", error);
        return;
      } else {
        if (response.ReportRequestInfo.ReportProcessingStatus === "_DONE_") {
          console.log("Success, report is now availible");
          reportId = response.ReportRequestInfo.GeneratedReportId;
          reportId = reportId.toString();
          getReport(reportId);
        } else {
          setTimeout(() => {
            getReportRequestList(requestId.toString());
          }, 10000);
        }
      }
    }
  );
}

function getReport(Id) {
  amazonMws.reports.search(
    {
      Version: "2009-01-01",
      Action: "GetReport",
      SellerId: credentials.sellerId,
      ReportId: Id,
    },
    function (error, response) {
      if (error) {
        console.log("error ", error);
        return;
      } else {
        body = response.data;
      }
    }
  );
}

asyncTest();
