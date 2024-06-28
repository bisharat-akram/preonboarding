import { defineBackend } from '@aws-amplify/backend';
import { Stack } from "aws-cdk-lib";
import { auth } from './auth/resource';
import { storage } from './storage/resource';
import * as iam from "aws-cdk-lib/aws-iam"
// import * as sns from "aws-cdk-lib/aws-sns"
import {
  AuthorizationType,
  Cors,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { myApiFunction } from "./functions/api-function/resource";

const backend = defineBackend({
  auth,
  storage,
  myApiFunction,
});

const myApiFunctionLamda = backend.myApiFunction.resources.lambda;


const statement = new iam.PolicyStatement({
  sid: "AllowPublishToDigest",
  actions: ["cognito-idp:ListUsers", "cognito-idp:ListGroups", "cognito-idp:AdminAddUserToGroup", "cognito-idp:AdminRemoveUserFromGroup", "s3:*"],
  resources: ["*"],
})


myApiFunctionLamda.addToRolePolicy(statement)

// create a new API stack
const apiStack = backend.createStack("apistack");

const myRestApi = new RestApi(apiStack, "RestApi", {
  restApiName: "myRestApi",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
    allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
    allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
  },
});

// create a new Lambda integration
const lambdaIntegration = new LambdaIntegration(
  backend.myApiFunction.resources.lambda
);

// create a new resource path with IAM authorization
const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth", {
  cognitoUserPools: [backend.auth.resources.userPool],
});

// const gerUsersAndGroupsPath = myRestApi.root.addResource("gerUsersAndGroups", {
//   defaultMethodOptions: {
//     authorizationType: AuthorizationType.COGNITO,
//     authorizer: cognitoAuth,
//   },
// });


const gerUsersAndGroupsPath = myRestApi.root.addResource("gerUsersAndGroups");
gerUsersAndGroupsPath.addMethod("GET", lambdaIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});
const addUserToGroupPath = myRestApi.root.addResource("addUserToGroup");
addUserToGroupPath.addMethod("GET", lambdaIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});
const removeUserFromGroupPath = myRestApi.root.addResource("removeUserFromGroup");
removeUserFromGroupPath.addMethod("GET", lambdaIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});
const getImageFromDifferentBucket = myRestApi.root.addResource("getimagediffbucket");
getImageFromDifferentBucket.addMethod("GET", lambdaIntegration, {
  authorizationType: AuthorizationType.COGNITO,
  authorizer: cognitoAuth,
});

// const topic = new sns.Topic(apiStack, "Topic", {
//   displayName: "digest",
// })


// const statement = new iam.PolicyStatement({
//   sid: "AllowPublishToDigest",
//   actions: ["sns:Publish"],
//   resources: [topic.topicArn],
// })


// backend.myApiFunction.resources.lambda.addToRolePolicy(statement)
// create a new IAM policy to allow Invoke access to the API
const apiRestPolicy = new Policy(apiStack, "RestApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [
        `${myRestApi.arnForExecuteApi("*", "/gerUsersAndGroups", "dev")}`,
        `${myRestApi.arnForExecuteApi("*", "/gerUsersAndGroups/*", "dev")}`,
        '*'
      ],
    }),
  ],
})
// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
  apiRestPolicy
);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
  apiRestPolicy
);

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      [myRestApi.restApiName]: {
        endpoint: myRestApi.url,
        region: Stack.of(myRestApi).region,
        apiName: myRestApi.restApiName,
      },
    },
  },
})
