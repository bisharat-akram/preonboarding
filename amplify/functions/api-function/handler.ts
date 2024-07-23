import type { APIGatewayProxyHandler } from "aws-lambda";
import { AdminAddUserToGroupCommand, AdminRemoveUserFromGroupCommand, CognitoIdentityProviderClient, ListGroupsCommand, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { env } from '$amplify/env/api-function';
import {
    S3Client,
    ListObjectsV2Command,
    HeadObjectCommand
} from "@aws-sdk/client-s3";

const Bucketclient = new S3Client();
const client = new CognitoIdentityProviderClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    let response = null;
    async function getimagediffbucket() {
        
        const command = new ListObjectsV2Command({
            Bucket:env.BUCKET,
            MaxKeys: 1000,
        });

        try {
            let isTruncated = true;
            
            console.log("Your bucket contains the following objects:\n");
            const filePaths = [];

            console.log("Your bucket contains the following objects:\n");

            while (isTruncated) {
                const response = await Bucketclient.send(command);
                const { Contents, IsTruncated, NextContinuationToken } = response;

                // Iterate through contents and filter out only file paths
                if (Contents) {
                    const files = Contents.filter((obj) => !obj?.Key?.endsWith('/')); // Filter out objects that end with '/'
                    const fileKeys = files.map(async (file) => {
                        const input = {
                            Bucket: env.BUCKET,
                            Key: file.Key, // required
                        };
                        const commandmetadata = new HeadObjectCommand(input);
                        const metadata = await Bucketclient.send(commandmetadata);
                        return {key:file.Key,metadata:metadata}
                    });
                      
                    filePaths.push(...fileKeys);
                }

                isTruncated = IsTruncated || false;
                command.input.ContinuationToken = NextContinuationToken;
            }
            return filePaths;
        } catch (err) {
            console.error(err);
        }
    }

    async function addusertogroup(group: string, user: string) {

        const commandrole = new AdminAddUserToGroupCommand({
            Username: user,
            GroupName: group,
            UserPoolId: event.queryStringParameters?.userPoolId,
        })
        const responserole = await client.send(commandrole);
        console.log(responserole)
        return responserole;
    }

    async function removeuserfromgroup(group: string, user: string) {

        const commandrole = new AdminRemoveUserFromGroupCommand({
            Username: user,
            GroupName: group,
            UserPoolId: event.queryStringParameters?.userPoolId
        })
        const responserole = await client.send(commandrole);
        console.log(responserole)
        return responserole
    }

    async function getUsersAndGroups() {
        const command = new ListUsersCommand({
            Limit: 60,
            UserPoolId: event.queryStringParameters?.userPoolId
        });
        const response_users = await client.send(command);

        console.log(response_users);

        const groupsresp = new ListGroupsCommand({ UserPoolId: event.queryStringParameters?.userPoolId });

        const groupsres = await client.send(groupsresp);

        console.log("aklsidfjskf", groupsres)
        return { Users: response_users.Users, Groups: groupsres.Groups }
    }

    console.log("event", event);

    const path = event.path.split('/')[1];

    console.log("path", path);

    switch (path) {
        case "gerUsersAndGroups": response = await getUsersAndGroups();
            break;
        case "addUserToGroup": if (event.queryStringParameters) {
            const { user, group } = event.queryStringParameters;
            response = await addusertogroup(group || "", user || "")
        }
            break;
        case "removeUserFromGroup": if (event.queryStringParameters) {
            const { user, group } = event.queryStringParameters;
            response = await removeuserfromgroup(group || "", user || "")
        }
            break;
        case "getimagediffbucket": console.log(event.queryStringParameters)
            if (event.queryStringParameters) {
            response = await getimagediffbucket()
        }
            break;


    }

    return {
        statusCode: 200,
        // Modify the CORS settings below to match your specific requirements
        headers: {
            "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
            "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
        },
        body: JSON.stringify(response),
    };
};