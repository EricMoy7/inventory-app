/**
 * Import all of the store components and return an intialized store component, which is an instance of the expressjs router
 *
 * @param amazonWmsInstance utility for amazon wms
 */
module.exports = (amazonWmsInstance) => {

    const WmsService = require('./wms.service');
    const WmsController = require('./wms.controller');
    const WmsRouter = require('./wms.router');

    /* Instantiate the services */
    const wmsService = new WmsService(amazonWmsInstance);

    /* Instantiate the controllers */
    const wmsController = new WmsController(wmsService);

    /* Instantiate the routers */
    const wmsRouter = new WmsRouter(wmsController);

    return wmsRouter;
}
