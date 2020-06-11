/**
 * This is just a wms router
 */

const express = require('express');
const bodyParser = require('body-parser');

module.exports = function WmsRouter(wmsController) {

    const router = express.Router();

    /* Parse HTTP request bodies as JSON */
    router.use(bodyParser.json());

    router.get('/reports', (req, res, next) => {
        wmsController.getReport()
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
