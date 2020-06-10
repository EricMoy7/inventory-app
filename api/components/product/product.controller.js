/**
 * This is just a product controller
 */

module.exports = function(productService) {

    /**
     * Async method that returns a promise with the result or rejects with a message.
     * This describes the normal use of the controller calling then returning the result from the service
     */
    const getData = () => {
        return productService.getData();
    };

    return {
        getData: getData
    };
};
