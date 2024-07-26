
## Features

 - **Authentication:** Managed by Amazon Cognito with user pools and IAM roles.
 - **Storage:** Amazon S3 buckets for file storage.
 - **API Management:** Amazon API Gateway for creating and managing API endpoints.
 - **Lambda Functions:** AWS Lambda functions to handle API requests.
 - **IAM Policies:** Custom IAM policies to manage permissions.

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