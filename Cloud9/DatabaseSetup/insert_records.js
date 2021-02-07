var AWS = require("aws-sdk"),
    DDB = new AWS.DynamoDB({
        apiVersion: "2012-08-10",
        region: "us-east-1"
    }),
    USER_DATA_ARR = require("./user_data.json");

function addNewItemsFromJSON(){
	console.log("All items now removed, re-seeding now");
	var user = {},
		user_formatted_arr = [],
		params = {};


	for(var i_int = 0; i_int < USER_DATA_ARR.length; i_int += 1){
		user = {
	    	PutRequest: {
	    		Item: {
	    			user_id: {
	    				"N": String(USER_DATA_ARR[i_int].user_id)
	    			},
	    			fullname: {
	    				"S": USER_DATA_ARR[i_int].fullname
	    			},
	    			email: {
	    				"S": USER_DATA_ARR[i_int].email
	    			},
	    			user_password: {
	    				"S": USER_DATA_ARR[i_int].user_password
	    			},
	    			role_id: {
	    				"N": String(USER_DATA_ARR[i_int].role_id)
	    			}
	    		}
	    	}
	    };
	    user_formatted_arr.push(user);
	}
	params = {
		RequestItems: {
			"competition_system_dynamo": user_formatted_arr.reverse()
		}
	};
	DDB.batchWriteItem(params, function(err, data){   
		if(err){
			throw err;
		}
		console.log("OK");         
	});
}

(function init(){
	addNewItemsFromJSON();
})();