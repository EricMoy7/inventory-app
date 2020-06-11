/**
 * This is just a wms controller
 */

module.exports = function(wmsService) {

    /**
     * Async method that returns a promise with the result or rejects with a message.
     * This describes the normal use of the controller calling then returning the result from the service
     */
    const getReport = () => {
        return wmsService.getData();
    };

    return {
        getReport
    };
};
