const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'eu-central-1'});;

exports.lambdaHandler = async (event, context, callback) => {
    await addCommodity(event, context)
        .then(() => {
            callback(null, {
                statusCode: 201,
                body: "",
                headers: {
                    'Access-Control-Allow-Origin' : '*'
                }
            })
        }).catch(err => {
            console.log(err)
        })
};

function addCommodity(event, context) {
    const params = {
        TableName: 'Commodity',
        Item: {
            'commodityId' : context.awsRequestId,
            'index' : event.index,
            'scrapingStrategy' : event.scrapingStrategy,
            'dataSource' : event.dataSource,
            'commodityType' : event.commodityType
        }
    }
    return ddb.put(params).promise();
}
