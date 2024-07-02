import { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Image, Input, Layout, Menu, Typography, Badge } from "antd";
import { signOut } from "aws-amplify/auth";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../redux/actions/userAction";
import { useNavigate } from "react-router-dom";
import { ModalComponent } from "./modal";

const { Sider, Content } = Layout;

const layoutStyle = {
    height: "100%",
    width: "100%"
}

const secondsidebaritems = [
    {
        key: "Overview",
        label: <Typography.Text className="font-semibold">Overview</Typography.Text>,
        icon: <img src="/icons/home.svg" />,
    },
    {
        key: "Notifications",
        label: (
            <div className="flex items-center  gap-2" style={{ width: '200px', justifyContent: 'space-between' }}>
                <Typography.Text className="font-semibold">Notifications</Typography.Text>
                <Badge count={10} />
            </div>
        ),
        icon: <img src="/icons/models.svg" />,
        return: () => {

        }
    },
    {
        key: "Analytics",
        label: <Typography.Text className="font-semibold">Analytics</Typography.Text>,
        icon: <img src="/icons/files.svg" />,
    },
    {
        key: "Saved Reports",
        label: <Typography.Text className="font-semibold">Saved Reports</Typography.Text>,
        icon: <img src="/icons/pagi.svg" />,
    },
    {
        key: "Scheduled Reports",
        label: <Typography.Text className="font-semibold">Scheduled Reports</Typography.Text>,
        icon: <img src="/icons/files.svg" />,
    },
    {
        key: "User Reports",
        label: <Typography.Text className="font-semibold">User Reports</Typography.Text>,
        icon: <img src="/icons/files.svg" />,
    },
    {
        key: "Notifications",
        label: <Typography.Text className="font-semibold">Notifications</Typography.Text>,
        icon: <img src="/icons/account.svg" />,
    }
]
export default function LayoutSiderWrapper({ children }) {
    const dispatch = useDispatch();
    const user = useSelector(st => st?.user);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);



    const closeOpenModal = () => {
        setOpen(false)
    }

    const items = [
        {
            key: "home",
            label: <Typography.Text className="font-semibold">Home</Typography.Text>,
            icon: <img src="/icons/home.svg" />,
            onClick: () => navigate('/')
        },
        {
            key: "models",
            label: <Typography.Text className="font-semibold">Models</Typography.Text>,
            icon: <img src="/icons/models.svg" />,
        },
        {
            key: "files",
            label: <Typography.Text className="font-semibold">Files</Typography.Text>,
            icon: <img src="/icons/files.svg" />,
        },
        {
            key: "pagi",
            label: <Typography.Text className="font-semibold">PAGI</Typography.Text>,
            icon: <img src="/icons/pagi.svg" />,
        },
        {
            key: "createmodel",
            label: <Typography.Text className="font-semibold">Create Model</Typography.Text>,
            icon: <img src="/icons/pagi.svg" />,
            onClick: () => setOpen(true)
        },
        {
            key: "account",
            label: <Typography.Text className="font-semibold">Account</Typography.Text>,
            icon: <img src="/icons/account.svg" />,
            onClick: () => navigate("/account")
        }
    ]
    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    useEffect(() => {
        console.log(user)
    }, [user.isSignedIn])
    return (
        <Layout style={layoutStyle}>
            <Sider width="20%" theme="light" style={{ borderRight: "1px solid rgba(234, 236, 240, 1)" }} onMouseEnter={showDrawer}
                onMouseLeave={closeDrawer}>
                <div className="gap-6 flex h-full flex-col justify-start items-center py-4 px-3">
                    <Image src="siderlogo.png" preview={false} />
                    <Input size="large" prefix={<SearchOutlined />} placeholder="Search" />
                    <Menu
                        style={{ borderInlineEnd: "none" }}
                        mode="inline"
                        items={items}
                    />
                    <div className="flex justify-between mt-auto items-center gap-3 w-full">
                        <div className="flex gap-2 items-center" onClick={() => { navigate('/list') }}>
                            <Avatar src="Avatar.png" size="large" />
                            <div className="flex flex-col text-left">
                                <Typography.Text>{user?.name ? user?.name : ''}</Typography.Text>
                                <Typography.Text>{user?.email ? user?.email : ''}</Typography.Text>
                            </div>
                        </div>
                        <img src="/icons/logout.svg" onClick={() => { signOut(); dispatch(removeUser()); }} style={{ height: "20px", width: "20px" }} />
                    </div>
                </div>
                {drawerVisible ? <div style={{
                    width: '300px',
                    backgroundColor: '#fff',
                    borderLeft: '1px solid rgba(234, 236, 240, 1)',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: '100%',
                    transition: 'width 0.3s',
                }}>
                    <div className="gap-6 flex h-full flex-col justify-start items-center py-4 px-3">
                        <Menu
                            style={{ borderInlineEnd: "none" }}
                            mode="inline"
                            items={secondsidebaritems}
                        />

                    </div>
                </div> : ''}
            </Sider>
            <Content style={{ overflow: 'auto', backgroundColor: 'white', marginLeft: `${drawerVisible ? '300px' : '0px'}` }}>{children}</Content>
            {open ? <ModalComponent open={open} closeOpenModal={closeOpenModal} /> : ''}
        </Layout>
    )
}