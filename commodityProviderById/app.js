const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'eu-central-1'});

exports.lambdaHandler = async (event, context, callback) => {
    await readCommodity(event.pathParameters.commodityId).then(data => {
        console.log(JSON.stringify(data));
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
        })
    }).catch(err => {
        console.log(err)
    })
};

function readCommodity(commodityId) {
    const params = {
        TableName: 'Commodity',
        Key: {
            'commodityId': commodityId
        }
    }
    return ddb.get(params).promise();
}