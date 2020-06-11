/**
 * This is just a wms service
 */

module.exports = function WmsService(amazonWmsInstance) {

    const getReport = async () => {
        const requestId = await amazonWmsInstance.requestReport();
        console.log('1', requestId);
        const reportId = await amazonWmsInstance.getReportRequestList(requestId);
        console.log('2', reportId);
        const wmsResponse = await amazonWmsInstance.getReport(reportId.toString());

        return {
            success: true,
            data: { wmsResponse }
        };
    };

    return {
        getReport
    };
};
