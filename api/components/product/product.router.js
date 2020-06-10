/**
 * This is just a product router
 */

const express = require('express');
const bodyParser = require('body-parser');

module.exports = function ProductRouter(productController) {

    const router = express.Router();

    /* Parse HTTP request bodies as JSON */
    router.use(bodyParser.json());

    router.get('/data', (req, res, next) => {
        productController.getData()
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                console.log('error: ', err)
                res.status(502).send(err);
            });
    });

    return router;
};
