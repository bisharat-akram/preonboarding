import { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Space, Table, Dropdown, Modal, Select } from 'antd';
import config from "../../amplify_outputs.json";
import { get } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth'

import { CognitoIdentityProviderClient, ListUsersCommand, AdminAddUserToGroupCommand, AdminListGroupsForUserCommand, ListGroupsCommand, AdminRemoveUserFromGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
const client = new CognitoIdentityProviderClient({
    region: config.auth.aws_region
});

export default function ListUser() {



    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRemoveRoleModalOpen, setIsRemoveRoleModalOpen] = useState(false);
    const [tableData, setTableData] = useState([])
    const [selectedUser, setSelectedUser] = useState();
    const [token, setToken] = useState();

    const showModal = () => {
        console.log(selectedUser)
        setIsModalOpen(true);
    };
    const showRemoveRoleModal = () => {
        console.log(selectedUser)
        setIsRemoveRoleModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleRemoveRoleOk = () => {
        setIsRemoveRoleModalOpen(false);
    };
    const handleRemoveRoleCancel = () => {
        setIsRemoveRoleModalOpen(false);
    };
    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    Delete
                </a>
            ),
        },
        {
            key: '2',

            label: (
                <a onClick={(e) => {

                    showModal()
                }}>
                    <Space>
                        Add Group
                        <DownOutlined />
                    </Space>
                </a>
            ),
        },
        {
            key: '3',
            label: (
                <a onClick={(e) => {

                    showRemoveRoleModal()
                }}>
                    <Space>
                        Remove Group
                        <DownOutlined />
                    </Space>
                </a>
            ),
        },
    ]
    function openactions(record) {
        console.log(record)
        setSelectedUser(record);
    }
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Email Verified',
            dataIndex: 'email_verified',
            key: 'email_verified',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            sorter: true,
            render: (_, record) => (
                <Dropdown menu={{ items }} trigger={['click']}>
                    <a onClick={(e) => openactions(record)}>
                        <Space>
                            Click
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            ),
        },
    ];
    const listAllUsers = async (token) => {
        try {
            const restOperation = get({
                apiName: config.custom.API.myRestApi.apiName,
                path: `gerUsersAndGroups?userPoolId=${config.auth.user_pool_id}`,
                options: {
                    headers: {
                        Authorization: token
                    }
                }

            });
            console.log(restOperation)
            let res = await restOperation.response;
            console.log('GET call succeeded: ', res);
            res = await res.body.json()
            console.log('GET call succeeded: ', res);
            const { Users, Groups } = res;
            setUsers(Users);
            const transformedData = Users?.map(user => {
                const userAttributes = user.Attributes.reduce((acc, attr) => {
                    acc[attr.Name] = attr.Value;
                    return acc;
                }, {});
                // let x=async getgroup();

                return {
                    key: user.Username,
                    ...userAttributes,
                };
            });
            setTableData(transformedData)

            let groupnames = Groups?.map((data) => { return { label: data?.GroupName, value: data?.GroupName } })
            console.log(groupnames)
            setGroups(groupnames);
        } catch (error) {
            console.error('Error listing users:', error);
        }
    };
    // async function getgroup() {
    //     const groupuser = new AdminListGroupsForUserCommand({
    //         Username: '91f31d3a-e001-7029-8e05-979274f22c70',
    //         UserPoolId: config.auth.user_pool_id,
    //     })
    //     const groupuserres = await client.send(groupuser);
    //     return groupuserres;
    // }

    const handleChange = (value) => {
        console.log(`selected`, selectedUser);

        get({
            apiName: config.custom.API.myRestApi.apiName,
            path: `addUserToGroup?userPoolId=${config.auth.user_pool_id}&user=${selectedUser.sub}&group=${value}`,
            options: {
                headers: {
                    Authorization: token
                }
            }

        });
    };
    const handleChangeRemoveRole = (value) => {
        console.log(`selected ${value}`);
        // removeuserfromgroup(value, selectedUser);
        get({
            apiName: config.custom.API.myRestApi.apiName,
            path: `removeUserFromGroup?userPoolId=${config.auth.user_pool_id}&user=${selectedUser.sub}&group=${value}`,
            options: {
                headers: {
                    Authorization: token
                }
            }

        });
    };
    useEffect(() => {

        async function init(){
            
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken
            setToken(token);
            
            listAllUsers(token);
        }

        init();
    }, [])

    return (
        <>
            <Table columns={columns} dataSource={tableData} />
            {console.log(groups, items)}
            <Modal title="Change Role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Select
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={groups}
                />
            </Modal>
            <Modal title="Remove Role" open={isRemoveRoleModalOpen} onOk={handleRemoveRoleOk} onCancel={handleRemoveRoleCancel}>
                <Select
                    style={{ width: 120 }}
                    onChange={handleChangeRemoveRole}
                    options={groups}
                />
            </Modal>
        </>
    )
}