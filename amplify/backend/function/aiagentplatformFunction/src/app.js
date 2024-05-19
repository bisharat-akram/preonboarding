/* Amplify Params - DO NOT EDIT
	AUTH_AIAGENTPLATFORM307412C5_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */ const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const cors = require("cors");
const {
  ListUsersCommand,
  ListUsersInGroupCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { client, userPoolID } = require("./config");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(awsServerlessExpressMiddleware.eventContext());

/**********************
 * Example get method *
 **********************/

app.get("/get-users", async function (req, res) {
  const listUserParams = {
    UserPoolId: userPoolID,
    AttributesToGet: ["email"],
  };
  const adminListUsersParams = {
    UserPoolId: userPoolID,
    GroupName: "admins",
  };
  const executeListUsersParams = {
    UserPoolId: userPoolID,
    GroupName: "executes",
  };

  try {
    // Get all authenticated users
    const userList = await client.send(new ListUsersCommand(listUserParams));

    // Get admin list from "admins" user pool group
    const adminList = await client.send(
      new ListUsersInGroupCommand(adminListUsersParams)
    );

    // Get admin list from "executes" user pool group
    const executeList = await client.send(
      new ListUsersInGroupCommand(executeListUsersParams)
    );

    // format the user data + check if this user is admin then set the role
    const modifiedUserList = userList.Users.map((user) => {
      const isAdmin = adminList.Users.find((u) => u.Username === user.Username);
      const isExecute = executeList.Users.find(
        (u) => u.Username === user.Username
      );
      const userRoles = ["Viewer"];
      if (isExecute) userRoles.push("Execute");
      if (isAdmin) userRoles.push("Admin");

      return {
        email: user.Attributes[0].Value,
        createdAt: user.UserCreateDate,
        userId: user.Username,
        roles: userRoles,
      };
    });

    res.json({
      success: "Users retrieved successfully!",
      users: modifiedUserList,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Error retrieving users" });
  }
});

const addRemoveUserFromGroup = async (type, groupName, userId) => {
  const adminGroupParams = {
    UserPoolId: userPoolID,
    GroupName: groupName,
    Username: userId,
  };

  switch (type) {
    case "add":
      const addResult = await client.send(
        new AdminAddUserToGroupCommand(adminGroupParams)
      );
      if (addResult["$metadata"].httpStatusCode === 200) {
        return {
          status: true,
          message: `User ${groupName} role has been Updated successfully!`,
        };
      }
      return {
        status: false,
        message: `Failed to update role`,
      };

    case "remove":
      const removeResult = await client.send(
        new AdminRemoveUserFromGroupCommand(adminGroupParams)
      );
      if (removeResult["$metadata"].httpStatusCode === 200) {
        return {
          status: true,
          message: `User ${groupName} role has been Updated successfully!`,
        };
      }
      return {
        status: false,
        message: `Failed to update role`,
      };

    default:
      return {
        status: false,
        message: `Something wrong here!`,
      };
  }
};

app.post("/update-roles", async function (req, res) {
  const { isAdmin, isExecute, userId } = req.body;

  try {
    // update role for admin
    if (isAdmin) {
      const result = await addRemoveUserFromGroup("add", "admins", userId);
      if (!result.status) throw new Error("Faild to Update role");
      res.json(result);
    } else {
      const result = await addRemoveUserFromGroup("remove", "admins", userId);
      if (!result.status) throw new Error("Faild to Update role");
      res.json(result);
    }

    // update role for execute role
    if (isExecute) {
      const result = await addRemoveUserFromGroup("add", "executes", userId);
      if (!result.status) throw new Error("Faild to Update role");
      res.json(result);
    } else {
      const result = await addRemoveUserFromGroup("remove", "executes", userId);
      if (!result.status) throw new Error("Faild to Update role");
      res.json(result);
    }
  } catch (error) {
    console.error("Error updating user's role:", error);
    res.status(500).json({ error: "Error updating user's role" });
  }
});

// ERROR handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(500).json({
    error: err,
    message: err.message,
  });
};

app.use(errorHandler);

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
