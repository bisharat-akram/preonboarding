// import sparklogin from '../assets/sparklogin.png'
// import sparklogo from '../assets/sparklogo.png'
// import { Button, Checkbox, Form, Input } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { signUp, confirmSignUp } from "aws-amplify/auth"
// import { Hub } from 'aws-amplify/utils';
// import { useState,useEffect } from 'react';
// import { fetchUserAttributes } from "aws-amplify/auth"
// import { Schema } from "../../amplify/data/resource"
// import { generateClient } from "aws-amplify/data"
// import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
// const onFinishFailed = (errorInfo) => {
//     console.log('Failed:', errorInfo);
// };
// const client = generateClient < Schema > ()

// export default function SignUp() {
//     const [sendOtp, setSendOtp] = useState(true);
//     const navigate = useNavigate();
//     const [form] = Form.useForm();
//     const addUserToGroup = async (username = "Harshit1", groupname ="ADMIN") => {
//         // const userPoolId = 'ap-south-1_KpLtKO5xJ';
//         // const region = 'ap-south-1';
      
//         // const client = new CognitoIdentityProviderClient({
//         //     apiVersion: '2016-04-18',
//         //     region: region,
//         // });

//         // // Parameters for adding user to group
//         // const params = {
//         //     GroupName: groupname,
//         //     UserPoolId: userPoolId,
//         //     Username: "c1e34d2a-30e1-7015-eceb-9e4abe3ebaff"
//         // };

//         // try {
//         //     // await client.mutations.addUserToGroup({
//         //     //     groupName: "ADMINS",
//         //     //     userId: "5468d468-4061-70ed-8870-45c766d26225",
//         //     // })
//         //     // const command = new AdminAddUserToGroupCommand(params);
//         //     // await client.send(command);
//         //     // console.log(`User ${"c1e34d2a-30e1-7015-eceb-9e4abe3ebaff"} added to group ${groupname}`);
//         // } catch (error) {
//         //     console.error('Error adding user to group:', error,params);
//         // }
//     };
//     useEffect(() => {
//         async function init() {
//             Hub.listen('auth', ({ payload }) => {
//                 console.log(payload)
              
//             });
//         }
//         init();

//     }, [])
  
//     return '';
// }
