/**
 * Import all of the store components and return an intialized store component, which is an instance of the expressjs router
 *
 * @param config is the config object
 * @param logger utility for logging messages
 */
module.exports = (config, pool) => {

    const ProductService = require('./product.service');
    const ProductController = require('./product.controller');
    const ProductRouter = require('./product.router');

    /* Instantiate the services */
    const productService = new ProductService(config, pool);

    /* Instantiate the controllers */
    const productController = new ProductController(productService);

    /* Instantiate the routers */
    const productRouter = new ProductRouter(productController);

    return productRouter;
}
