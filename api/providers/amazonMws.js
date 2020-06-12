module.exports = function AmazonMwsProvider(amazonMwsConfig) {
    const amazonMws = require("amazon-mws")(
        amazonMwsConfig.credentials.accessKey,
        amazonMwsConfig.credentials.secretKey
    );
    amazonMws.setResponseFormat(amazonMwsConfig.responseFormat);

    const getReportRequest = async () => {
        return amazonMws.reports.submit({
              Version: amazonMwsConfig.version,
              Action: amazonMwsConfig.requestReport,
              SellerId: amazonMwsConfig.sellerId,
              ReportType: amazonMwsConfig.reportType,
            })
            .then((response) => {
                return getReportRequestList(response.ReportRequestInfo.ReportRequestId);
            })
            .then((reportId) => {
                return getReport(reportId);
            })
            .catch((err) => {
                console.log('error: ', err);
            });
    }

    const getReportRequestList = async (requestId) => {
        let response;
        try {
            do {
                await new Promise(r => setTimeout(r, 10000));
                response = await amazonMws.reports.search({
                    Version: amazonMwsConfig.version,
                    Action: amazonMwsConfig.getReportRequestList,
                    SellerId: amazonMwsConfig.sellerId,
                    "ReportRequestIdList.Id.1": requestId,
                });
            } while (response.ReportRequestInfo.ReportProcessingStatus !== '_DONE_')
            return response.ReportRequestInfo.GeneratedReportId;
        } catch (err) {
            console.log("Error (getReportRequestList)", err);
            return;
        }
    }

    const getReport = async (reportId) => {
        let response;
        try {
            response = await amazonMws.reports.search({
                Version: amazonMwsConfig.version,
                Action: amazonMwsConfig.getReport,
                SellerId: amazonMwsConfig.sellerId,
                ReportId: reportId,
            });
            return response;
        } catch (err) {
            console.log("Error (getReport)", err);
            return;
        }
    }

    return {
        getReportRequest
    };
};

