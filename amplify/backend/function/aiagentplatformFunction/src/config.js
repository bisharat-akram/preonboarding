const {
  CognitoIdentityProviderClient,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({});

// Constants
const userPoolID = "us-east-1_DiPfATP7x";

module.exports = {
  client,
  userPoolID,
};
