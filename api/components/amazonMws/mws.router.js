/**
 * This is just a mws router
 */

const express = require('express');
const bodyParser = require('body-parser');

module.exports = function MwsRouter(mwsController) {

    const router = express.Router();

    /* Parse HTTP request bodies as JSON */
    router.use(bodyParser.json());

    router.get('/reports', (req, res, next) => {
        mwsController.getReport()
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
