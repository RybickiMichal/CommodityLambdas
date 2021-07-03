const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'eu-central-1'});

exports.lambdaHandler = async (event, context, callback) => {
    if (event.body.index === undefined) {
        event.body = JSON.parse(event.body);
    }
    validateCommodityFields(event.body);
    await addCommodity(event.body, context.awsRequestId)
        .then(() => {
            callback(null, {
                statusCode: 201,
                body: "",
                headers: {
                    "Access-Control-Allow-Headers" : "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST"
                }
            })
        }).catch(err => {
            console.log(err)
        })
};

function validateCommodityFields(body) {
    console.log(body)
    if (isNull(body.index) || isNull(body.scrapingStrategy) || isNull(body.commodityType)) {
        throw new Error('Required field is empty! ' + body);
    }
}

function isNull(field) {
    return field == null;
}

function addCommodity(body, requestId) {
    const params = {
        TableName: 'Commodity',
        Item: {
            'commodityId': requestId,
            'index': body.index.toUpperCase(),
            'scrapingStrategy': body.scrapingStrategy.toUpperCase(),
            'dataSource': body.dataSource,
            'commodityType': body.commodityType.toUpperCase(),
            'commoditySector': body.commoditySector === undefined ? body.commoditySector : body.commoditySector.toUpperCase()
        }
    }
    return ddb.put(params).promise();
}
