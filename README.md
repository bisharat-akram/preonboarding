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

# Amplify Gen 2 Project

This project is a web application using AWS Amplify Gen 2, which integrates with AWS services such as Cognito for authentication, Lambda for serverless functions, and S3 for storage.

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Setup Locally](#setuplocally)

## Introduction

The project leverages AWS Amplify to simplify the development of cloud-powered applications. The application includes:

- **Authentication** using Amazon Cognito.
- **Serverless functions** with AWS Lambda.
- **File storage** with Amazon S3.

## Architecture

The architecture of this project involves the following components:

- **AWS Amplify**: Framework to build scalable mobile and web applications.
- **Amazon Cognito**: Service for user authentication, authorization, and user management.
- **AWS Lambda**: Serverless computing service to run code without provisioning or managing servers.
- **Amazon S3**: Scalable object storage service to store and retrieve any amount of data.

## Setup



### Prerequisites

- Node.js (>=12.x)
- AWS CLI
- Amplify CLI
- An AWS account

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/jwhwoo/aiagentplatform/tree/feature/new-ui
    cd aiagentplatform
    ```


### SetUp locally

run 
``npm i``

see how to configure ampx [sandbox](https://docs.amplify.aws/react/deploy-and-host/sandbox-environments/setup/#create-a-new-sandbox-environment)
Then run
``npx ampx sanbox``
amplify will create new resouce for your sandbox environment

``npm run dev``

the frontend of the project will open on the http://localhost:5173


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