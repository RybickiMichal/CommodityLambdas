const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'eu-central-1'});

exports.lambdaHandler = async (event, context, callback) => {
    try {
        const ids = await readCommoditiesIdsByType(event.pathParameters.commodityType);
        console.log("Data from GSI for commodity type: " + JSON.stringify(ids));

        const commodities = await readCommodities(ids);
        console.log("commodities by type" + event.pathParameters.commodityType + commodities);

        callback(null, {
            statusCode: 200,
            body: JSON.stringify(commodities),
            headers: {
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET"
            },
        });
    } catch (err) {
        console.log(err);
    };
};

async function readCommoditiesIdsByType(commodityType) {
    console.log("Starting querying GSI CommodityTypeIndex for commodityType: " + commodityType);
    const params = {
        TableName: 'Commodity',
        IndexName: "CommodityTypeIndex",
        KeyConditionExpression: "commodityType = :v_type",
        ExpressionAttributeValues: {
            ":v_type": commodityType
        },
    }
    return ddb.query(params).promise();
}

async function readCommodities(ids) {
    const commodities = [];
    for (let item of ids.Items) {
        console.log("Start getting commodity from ddb with index: " + item.commodityId)
        commodities.push(await readCommodity(item.commodityId));
    }

    return commodities;
}

async function readCommodity(commodityId) {
    const params = {
        TableName: 'Commodity',
        Key: {
            'commodityId': commodityId
        }
    }
    return ddb.get(params).promise();
}