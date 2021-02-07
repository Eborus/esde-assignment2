const aws = require("aws-sdk");
const ddb = new aws.DynamoDB({ region: "us-east-1" });
const headers = { "Content-Type": "application/json; charset=utf-8" };
const TableName = "competition_system_dynamo";
const IndexName = "email_index"

module.exports.authenticate = (email, callback) => {
    try {
        var params = { 
         TableName: TableName,
         IndexName: IndexName,
         KeyConditionExpression: 'email = :email',
         ExpressionAttributeValues: { ':email': { S: email }}
        };
        ddb.query(params, function(err, data) {
            if (err) {
                throw err;
            } else {
                if (data.Count > 0) {
                    console.log(data.Items[0]);
                    return callback(null, data);
                } else {
                    return callback('Login has failed', null);
                }
            }
        })
    } catch (error) {
        return callback(error, null);
    }
};