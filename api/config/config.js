module.exports = {
    "port": 3000,
    "cors_allow_origin": "*",
    "cors_allow_headers": "*",
    "database": {
        host: "sql01.c4wpdrivb6hb.us-east-2.rds.amazonaws.com",
        user: "ericmoy77",
        password: "1295fr1295fr",
        database: "nodemysql"
    },
    "amazonMws": {
        credentials: {
            accessKey: "AKIAIPHR7XOXFJFBWQEQ",
            secretKey: "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"
        },
        sellerId: "A350A0H0CAQ28C",
        responseFormat: "JSON",
        reportType: "_GET_FLAT_FILE_OPEN_LISTINGS_DATA_",
        version: "2009-01-01",
        requestReport: "RequestReport",
        getReportRequestList: "GetReportRequestList",
        getReport: "GetReport"
    }
};

