const {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

exports.handler = async (event, context, callback) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  // Constants
  const client = new CognitoIdentityProviderClient({});
  const userPoolID = "us-east-1_DiPfATP7x";

  // Retrieve user attributes from the event object
  const { request } = event;
  const { userAttributes } = request;
  const email = userAttributes.email;

  const adminGroupParams = {
    UserPoolId: userPoolID,
    GroupName: "viewers",
    Username: email,
  };

  try {
    const addResult = await client.send(
      new AdminAddUserToGroupCommand(adminGroupParams)
    );
    if (addResult["$metadata"].httpStatusCode === 200) {
      callback(null, event);
    } else {
      throw new Error("Failed to add user to the group");
    }
  } catch (error) {
    console.error("Error adding user to group:", error);
    callback(error);
  }
};
