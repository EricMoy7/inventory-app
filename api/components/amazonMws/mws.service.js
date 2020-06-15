/**
 * This is just a mws service
 */

module.exports = function MwsService(amazonMwsInstance) {

    const getReport = () => {
        return amazonMwsInstance.getReportRequest();
    };

    return {
        getReport
    };
};
