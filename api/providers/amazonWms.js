module.exports = function AmazonWmsProvider(amazonWmsConfig) {
    const amazonMws = require("../../../node_modules/amazon-mws/lib/amazon-mws")(
        amazonWmsConfig.credentials.accessKey,
        amazonWmsConfig.credentials.secretKey
    );
    amazonMws.setResponseFormat(amazonWmsConfig.responseFormat);
    
    const requestReport = () => {
        amazonMws.reports.submit(
            {
              Version: amazonWmsConfig.version,
              Action: amazonWmsConfig.requestReport,
              SellerId: amazonWmsConfig.sellerId,
              ReportType: amazonWmsConfig.reportType,
            },
            function (error, response) {
              if (error) {
                console.log("Error: ", error);
                return;
              } else {
                console.log("Found request Id");
                return response.ReportRequestInfo.ReportRequestId;
              }
            }
        );
    }

    const getReportRequestList = (requestId) => {
        amazonMws.reports.search(
            {
              Version: amazonWmsConfig.version,
              Action: amazonWmsConfig.getReportRequestList,
              SellerId: amazonWmsConfig.sellerId,
              "ReportRequestIdList.Id.1": requestId,
            },
            function (error, response) {
              if (error) {
                console.log("Error (ReportList)", error);
                return;
              } else {
                if (response.ReportRequestInfo.ReportProcessingStatus === "_DONE_") {
                  console.log("Success, report is now availible");
                  return response.ReportRequestInfo.GeneratedReportId;
                } else {
                  setTimeout(() => {
                    getReportRequestList(requestId);
                  }, 10000);
                }
              }
            }
        );
    }

    const getReport = (reportId) => {
        amazonMws.reports.search(
            {
              Version: amazonWmsConfig.version,
              Action: amazonWmsConfig.getReport,
              SellerId: amazonWmsConfig.sellerId,
              ReportId: reportId,
            },
            function (error, response) {
              if (error) {
                console.log("error ", error);
                return;
              } else {
                return response.data;
              }
            }
        );
    }

    return {
        amazonMws,
        requestReport,
        getReportRequestList,
        getReport
    };
};

