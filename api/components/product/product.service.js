/**
 * This is just a product service
 */

module.exports = function ProductService(config, pool) {

    const getData = () => {
        return new Promise((resolve, reject) => {
            pool.query('select * from products', function (err, rows, fields) {
                if (err) {
                    console.error('query error', err.message, err.stack)
                    return reject(err.message);
                }
                resolve({
                    success: true,
                    data: rows
                });
            });
        });
    };

    return {
        getData: getData
    };
};
