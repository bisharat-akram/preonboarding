import { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Space, Table, Dropdown, Modal, Select } from 'antd';
import config from "../../amplify_outputs.json"
import { CognitoIdentityProviderClient, ListUsersCommand, AdminAddUserToGroupCommand, AdminListGroupsForUserCommand, ListGroupsCommand, AdminRemoveUserFromGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
const client = new CognitoIdentityProviderClient({
    region: config.auth.aws_region,
    credentials: {
        accessKeyId: 'AKIA6DBPHLCV5BH7PVKX',
        secretAccessKey: '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'
    }
});

export default function ListUser() {
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRemoveRoleModalOpen, setIsRemoveRoleModalOpen] = useState(false);
    const [tableData,setTableData] = useState([])
    const [selectedUser, setSelectedUser] = useState();
    async function addusertogroup(group, user) {
        console.log(user,group)
        const commandrole = new AdminAddUserToGroupCommand({
            Username: user.Username,
            GroupName: group,
            UserPoolId: config.auth.user_pool_id,
        })
        const responserole = await client.send(commandrole);
        console.log(responserole)
    }
    async function removeuserfromgroup(group, user) {
        
        const commandrole = new AdminRemoveUserFromGroupCommand({
            Username: user.Username,
            GroupName: group,
            UserPoolId: config.auth.user_pool_id,
        })
        const responserole = await client.send(commandrole);
        console.log(responserole)
    }
    
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
            render: (_,record) => (
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
    const listAllUsers = async () => {
        let usersdata = [];
        try {
                const command = new ListUsersCommand({
                    Limit: 60,
                    UserPoolId: config.auth.user_pool_id
                });
                const response = await client.send(command);

                console.log(response);
                usersdata = usersdata.concat(response.Users);
           
            usersdata.map(data => {
                data?.Attributes?.push(
                    {
                        Name: "Username",
                        Value: data?.Username
                    }
                )
            });
            setUsers(usersdata);
            const transformedData = usersdata?.map(user => {
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
            let userfields = usersdata[0]?.Attributes?.map((data) => {
                if (data?.Name === "sub" || data?.Name === "Username")
                    return undefined;
                return {
                    title: data?.Name?.toUpperCase().split('_').join(' '),
                    dataIndex: data?.Name,
                    key: data?.Name,
                };
            });
            userfields = userfields.filter((data) => { return data !== undefined })
            // setColumns(userfields)
            
            // const groupuser = new AdminListGroupsForUserCommand({
            //     Username:'91f31d3a-e001-7029-8e05-979274f22c70',
            //     UserPoolId: config.auth.user_pool_id,
            // })
            const groupsresp = new ListGroupsCommand({ UserPoolId: config.auth.user_pool_id, });
            const groupsres = await client.send(groupsresp);
            let groupnames = groupsres.Groups?.map((data) => { return { label:data?.GroupName,value:data?.GroupName } })
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
    
    const handleChange = ( value) => {
        console.log(`selected ${value}`);
        addusertogroup(value, selectedUser);
    };
    const handleChangeRemoveRole = (value) => {
        console.log(`selected ${value}`);
        removeuserfromgroup(value, selectedUser);
    };
    useEffect(() => {
        listAllUsers();
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