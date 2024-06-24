import type { APIGatewayProxyHandler } from "aws-lambda";
import { AdminAddUserToGroupCommand, AdminRemoveUserFromGroupCommand, CognitoIdentityProviderClient, ListGroupsCommand, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient();

export const handler: APIGatewayProxyHandler = async (event) => {

    let response = null;

    async function addusertogroup(group:any, user:any) {
        console.log(user, group)

        const commandrole = new AdminAddUserToGroupCommand({
            Username: user,
            GroupName: group,
            UserPoolId: event.queryStringParameters?.userPoolId,
        })
        const responserole = await client.send(commandrole);
        console.log(responserole)
        return responserole;
    }

    async function removeuserfromgroup(group: any, user:any) {

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
            response = await addusertogroup(group, user)
        }
            break;
        case "removeUserFromGroup": if (event.queryStringParameters) {
            const { user, group } = event.queryStringParameters;
            response = await removeuserfromgroup(group, user)
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