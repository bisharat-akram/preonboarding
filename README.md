# AI Agent Platform

## Project Overview

Welcome to the documentation for our AI Agent Platform application. This application serves as a comprehensive platform for **\_\_\_**. It has been built using AWS Amplify and React.js.

Here, you can view a list of all registered users, edit their roles, and manage access permissions. The application also includes a file upload and view feature, allowing you to handle various documents within the system. To ensure the security of your data, the application uses AWS Amplify Auth for authentication. This ensures that only authorized personnel can access sensitive user data and administrative functions.
<br/><br/>

## Features

- **User Management**: Loading users from the Cognito user pool through a Lambda function named `aiagentplatformFunction`.
- **Role-Based Access Control**: Users have multiple roles such as `Viewer`, `Executor`, and `Admin`. This allows for granular control over what actions users can perform in the system.
- **Admin Features**: Admins have the ability to change the role of any user from the user list. This provides flexibility in managing user permissions.
- **Protected Routes**: The application includes protected routes that are only accessible to Admins, enhancing the security of sensitive operations and data.
- **Authentication**: The application includes comprehensive authentication features, including Sign Up, Sign In, and Logout. This ensures that only authorized users can access the system.
  <br/><br/>

## Installation

To install and set up the AI Agent Platform application, follow these steps:

1. **Clone the [Repository](https://github.com/jwhwoo/aiagentplatform/tree/feature/upload-file-to-s3)**: Open your terminal and run the following command to clone the project repository:

```bash
git clone https://github.com/jwhwoo/aiagentplatform.git
```

This will create a copy of the project on your local machine. Then go to your project directory:

```bash
cd aiagentplatform
```

1. **Switch to the Relevant Branch**: Navigate into the cloned repository and switch to the "feature/upload-file-to-s3" branch, which contains the most recent updates. Use the command to switch to this branch.

```bash
git checkout feature/new-ui
```

1. **Install Amplify**: As this project is built using AWS Amplify, make sure you have it installed on your system. If not, run the following command to install it:

```bash
npm install -g @aws-amplify/cli
```

## to initial a new project
initiate an amplify project using the [quickstart guide](https://docs.amplify.aws/react/start/quickstart/)

## SetUp locally

run 
``npm i``

see how to configure ampx [sandbox](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/setup/#create-a-new-sandbox-environment)
Then run
``npx ampx sanbox``
amplify will create new resouce for your sandbox environment

``npm run dev``

the frontend of the project will open on the http://localhost:5173

## Project Structure
- the projects consists or congnito (for auth)
- lambda got creating functionality
- s3 for storing files

## Authentication

The AI Agent Platform application uses AWS Amplify Auth for authentication, which ensures that only authorized users can access the system. The authentication features include Sign Up, Sign In, and Logout.

When a new user signs up, they are automatically added to the `Viewer` group (or role). This is accomplished through a Lambda function called `addUserToDefautGroupAfterSignUp`, which is triggered upon confirmation of the user's registration. This function is located in the Cognito user pool under User Pool Properties > Lambda Triggers.

### Auth Flow

1. **Sign Up**: A new user signs up using their credentials. Once the user confirms their registration, the `addUserToDefautGroupAfterSignUp` Lambda function is triggered.
2. **Add User to Default Group**: The Lambda function automatically adds the new user to the `Viewer` group in the Cognito user pool.
3. **Sign In**: The user can now sign in using their credentials. The application will authenticate the user and grant them access based on their assigned role (in this case, `Viewer`).
4. **Access Control**: Depending on their role, the user will have certain permissions within the system. For example, `Viewer` users can view content but may not have permissions to make changes.
5. **Logout**: Users can securely log out of the system when they have finished their session.

### User Roles:

In the AI Agent Platform application, there are three user roles: Viewer, Executor, and Admin. Each role has a specific set of permissions that determine what features they can access and the actions they can perform in the system.

1. **Viewer**: **\_\_\_**.
2. **Executor**: **\_\_**.
3. **Admin**: **\_\_**.
   <br/><br/>

## Lambda Functions

The AI Agent Platform utilizes two key Lambda functions to manage user roles and perform custom operations that are not directly covered by AWS Amplify. These two Lambda functions have custom ENV that need to be filled when you change the environment or migrate the application. Please check the **Environment Variables** section below.

1. **addUserToDefautGroupAfterSignUp**: Triggered upon confirmation of a user's registration, this function will be triggered from the Cognito user pool under User Pool Properties > Lambda Triggers. The purpose of this function is to automatically add new users to the `Viewer` group (or role). For this function to work correctly, it requires either full access to Cognito or permission to add a user to a group in Cognito.
2. **aiagentplatformFunction**: This function is primarily used for APIs and to handle custom logic that cannot be addressed directly by Amplify. The function uses serverless Express.js. This function needs full access to the Cognito to work correctly. Here is an example of how this function is implemented:

```jsx
const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const cors = require("cors");
const {
  ListUsersCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { client, userPoolID } = require("./config");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(awsServerlessExpressMiddleware.eventContext());

app.get("/get-users", async function (req, res) {
  // other codes....
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
```

Basically, both of these functions need the `AmazonCognitoPowerUser` permission policy to work correctly.

- **Policy Name:** AmazonCognitoPowerUser
- **Policy ARN:** arn:aws:iam::aws:policy/AmazonCognitoPowerUser
- **Policy JSON:** Click on the arrow to view JSON.
  ```jsx
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "cognito-identity:*",
                  "cognito-idp:*",
                  "cognito-sync:*",
                  "iam:ListRoles",
                  "iam:ListOpenIdConnectProviders",
                  "iam:GetRole",
                  "iam:ListSAMLProviders",
                  "iam:GetSAMLProvider",
                  "kinesis:ListStreams",
                  "lambda:GetPolicy",
                  "lambda:ListFunctions",
                  "sns:GetSMSSandboxAccountStatus",
                  "sns:ListPlatformApplications",
                  "ses:ListIdentities",
                  "ses:GetIdentityVerificationAttributes",
                  "mobiletargeting:GetApps",
                  "acm:ListCertificates"
              ],
              "Resource": "*"
          },
          {
              "Effect": "Allow",
              "Action": "iam:CreateServiceLinkedRole",
              "Resource": "*",
              "Condition": {
                  "StringEquals": {
                      "iam:AWSServiceName": [
                          "cognito-idp.amazonaws.com",
                          "email.cognito-idp.amazonaws.com"
                      ]
                  }
              }
          },
          {
              "Effect": "Allow",
              "Action": [
                  "iam:DeleteServiceLinkedRole",
                  "iam:GetServiceLinkedRoleDeletionStatus"
              ],
              "Resource": [
                  "arn:aws:iam::*:role/aws-service-role/cognito-idp.amazonaws.com/AWSServiceRoleForAmazonCognitoIdp*",
                  "arn:aws:iam::*:role/aws-service-role/email.cognito-idp.amazonaws.com/AWSServiceRoleForAmazonCognitoIdpEmail*"
              ]
          }
      ]
  }
  ```

<br/><br/>

## Environment Variables

1. `AMPLIFY_AUTH_USERPOOL_ID`

The AI Agent Platform utilizes environment variables in its Lambda functions for better security and manageability. The two Lambda functions, `aiagentplatformFunction` and `addUserToDefautGroupAfterSignUp`, use an environment variable named `AMPLIFY_AUTH_USERPOOL_ID`.

This environment variable needs to be set when you change the environment or migrate the application. Here's how to set up this environment variable:

1. Navigate to the AWS Lambda console.
2. Open the `aiagentplatformFunction` and `addUserToDefautGroupAfterSignUp` function.
3. Select the “Configuration” tab.
4. Scroll down to the 'Environment variables' section.
5. Click on 'Edit.'
6. In the 'Key' field, enter `AMPLIFY_AUTH_USERPOOL_ID`.
7. In the 'Value' field, enter the ID of your user pool.
8. Click on 'Save.'

Remember to ensure that the value of `AMPLIFY_AUTH_USERPOOL_ID` corresponds to the ID of your Cognito user pool. Repeat the steps for these two functions that utilize this environment variable.
<br/><br/>

## API Endpoints

The AI Agent Platform includes two key API endpoints that allow for interaction between the frontend and backend of the system. These endpoints use the `aiagentplatformFunction`, which is a Lambda function built with serverless Express.js. Here is a detailed overview of these two endpoints:

### 1. GET /get-users

This endpoint retrieves a list of all authenticated users in the system. It also checks if the user is an admin or an executor, and sets their role accordingly.

**Request:** No payload is required for this endpoint.

**Response:** The response will include a status message and an array of users. Each user object in the array will include the user's email, the date the user was created, the user's ID, and their roles.

```json
{
  "success": "Users retrieved successfully!",
  "users": [
    {
      "email": "user@email.com",
      "createdAt": "2021-07-01T00:00:00Z",
      "userId": "123456",
      "roles": ["Viewer", "Execute"]
    }
    //  ....
  ]
}
```

If there is an error when retrieving the users, the response will be a status of 500 and an error message.

```json
{ "error": "Error retrieving users" }
```

### 2. POST /update-roles

This endpoint allows for updating a user's roles in the system. It can be used to add or remove a user from the user pool groups.

**Request:** The request payload should include whether the user is an admin or an executor and the user's ID.

```json
{
  "isAdmin": "boolean",
  "isExecute": "boolean",
  "userId": "string"
}
```

**Response:** The response will be a success message if the role update is successful.

```json
{
  "status": true,
  "message": "User role updated successfully!"
}
```

If there is an error when updating the user's role, the response will be a status of 500 and an error message.

```json
{ "error": "Error updating user's role" }
```

<br/><br/><br/>

Happy Coding ✨