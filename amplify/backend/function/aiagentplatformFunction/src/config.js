const {
  CognitoIdentityProviderClient,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({});

// Constants
const userPoolID = process.env.AUTH_AIAGENTPLATFORM307412C5_USERPOOLID;
// const userPoolID = process.env.AMPLIFY_AUTH_USERPOOL_ID;

module.exports = {
  client,
  userPoolID,
};
