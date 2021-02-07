const aws = require("aws-sdk");
const ddb = new aws.DynamoDB({ region: "us-east-1" })
const headers = { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" };
const TableName = "competition_system_dynamo"
exports.handler = function (event) {
    return new Promise((resolve, reject) => {

        ddb.getItem({
          TableName: TableName,
          Key: {
            'user_id': {N: String(event.pathParameters.recordid)}
          },
          ProjectionExpression: 'user_id, email, fullname, user_password, role_id'
        }).promise().then(data => {
            let item = data
            if (item) {
                resolve({ statusCode: 200, headers, body: JSON.stringify(item) })
            } else {
                resolve({ statusCode: 404, headers, body: JSON.stringify({ message: "Unable to retrieve data, user does not exist" }) })
            }

        }).catch(err=>{
            resolve(JSON.stringify(err))
        })
    })
}