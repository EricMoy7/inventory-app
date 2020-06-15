/**
 * Import all of the store components and return an intialized store component, which is an instance of the expressjs router
 *
 * @param amazonMwsInstance utility for amazon mws
 */
module.exports = (amazonMwsInstance) => {

    const MwsService = require('./mws.service');
    const MwsController = require('./mws.controller');
    const MwsRouter = require('./mws.router');

    /* Instantiate the services */
    const mwsService = new MwsService(amazonMwsInstance);

    /* Instantiate the controllers */
    const mwsController = new MwsController(mwsService);

    /* Instantiate the routers */
    const mwsRouter = new MwsRouter(mwsController);

    return mwsRouter;
}
