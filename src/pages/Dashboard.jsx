import React, { useEffect, useState } from 'react';
import { Radio} from 'antd';
import icondual from '../assets/icondual.png'
import dots3 from '../assets/dots3.png'
import folder from '../assets/folder.png'
import Sidebar from '../Components/Sidebar';
import Arrowup from '../assets/arrowup.png';
import '../CSS/Dashboard.css'
import { Button, Segmented } from 'antd';
import config from "../../amplify_outputs.json";
import { fetchAuthSession } from 'aws-amplify/auth'
import { get } from 'aws-amplify/api';
import { useNavigate } from 'react-router-dom';
const items = [
    {
        key: '1',
        label: 'Tab 1',
        children: 'Content of Tab Pane 1',
    },
    {
        key: '2',
        label: 'Tab 2',
        children: 'Content of Tab Pane 2',
    },
    {
        key: '3',
        label: 'Tab 3',
        children: 'Content of Tab Pane 3',
    },
];
const Dashboard = () => {
    const [alignValue, setAlignValue] = useState('center');
    const [size, setSize] = useState('small');
    const [value, setValue] = useState('');
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    async function getList() {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken
            console.log(session)
            let restOperation = get({
                apiName: config.custom.API.myRestApi.apiName,
                path: `getimagediffbucket?user=${session?.userSub}`,
                options: {
                    headers: {
                        Authorization: token
                    }
                }
                
            });
            let result = await restOperation.response;
            result = await result.body.json()
            result = result.reduce((prev, curr) => {
                if (curr.startsWith(`assets/${session.userSub}`)) {
                    let urlarr = curr.split('/');
                    let id = urlarr[2]
                    if (prev) {
                        prev[id] = 1;
                    } else {
                        prev = { [id]: 1 }
                    }
                }
                console.log(prev)
                return prev;
            }, 0);
            // let ids = result.map((data) => {
                //     let urlarr = data.split('/');
                
                //     let id = urlarr[2]
                //     console.log(id);
                //     return id;
                // })
                
                setImages(result)
                console.log(result)
            } catch (error) {
                console.log(error);
            }
        }
        useEffect(() => {
            
            
            getList()
        }, [])
        const onChange = (e) => {
            setSize(e.target.value);
    };
    const optionsWithDisabled = [
        { label: '30 days', value: '30 days' },
        { label: '7 days', value: '7 days' },
        { label: '24 hours', value: '24 hours'},
    ];
    const radiogroup = ({ target: { value } }) => {
        console.log('radio4 checked', value);
        setValue(value);
    };
        return (
            <div className='h-full w-full dashboard' >
            <div className='text-start flex flex-col home'>
                <p >Home</p>
                <div className='tab '>
                    
              
                        <Radio.Group
                            style={{
                                marginBottom: 16,
                                color: 'black',
                                borderColor:'#D0D5DD'
                            }}
                           
                            options={optionsWithDisabled}
                            onChange={radiogroup}
                            value={value}
                            optionType="button"
                            buttonStyle="solid"
                        />
                </div>
            </div>
            <div className='flex justify-start w-full stats' >

                <div className='flex flex-col justify-between gap-4 child'>
                    <div className='flex justify-between gap-4 w-full text-image'>
                        <p>Total Models</p>
                        <span><img src={dots3} ></img></span>
                    </div>
                    <div className='flex justify-between items-center content'>
                        <p>4</p>
                        <div className="flex items-center  justify-center" >
                            <span><img src={Arrowup} ></img></span>
                            10%
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-between gap-4 child'>
                    <div className='flex justify-between gap-4 w-full text-image'>
                        <p>Total Models</p>
                        <span><img src={dots3} ></img></span>
                    </div>
                    <div className='flex justify-between items-center content'>
                        <p>4</p>
                        <div className="flex items-center  justify-center" >
                            <span><img src={Arrowup} ></img></span>
                            10%
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-between gap-4 child'>
                    <div className='flex justify-between gap-4 w-full text-image'>
                        <p>Total Models</p>
                        <span><img src={dots3} ></img></span>
                    </div>
                    <div className='flex justify-between items-center content'>
                        <p>4</p>
                        <div className="flex items-center  justify-center" >
                            <span><img src={Arrowup} ></img></span>
                            10%
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex flex-col modalsheading" >
                <p className='text-start'>Models (4)</p>
                <div className='flex justify-between'>
                    <p>View your recent models and their current statuses. Manage all your formulations in the Models section.</p>
                    <a href='#' >View All</a>
                </div>
            </div>
            <div className='modals'>
                {Object.keys(images).map((data) => <div className="child">
                    <div className="flex justify-between w-full gap-4 items-center images" >
                        <img src={icondual}></img>
                        <span ><img src={dots3}></img></span>
                    </div>
                    <div className="content"  >
                        <div className="pill" >
                            <p>Processing
                            </p>
                        </div>

                        <p className='text-start text-title'>Model Testing 03</p>

                        <p className='text-start  createdtime' >Created: May 17, 2024 11:18 PM</p>
                        <Button style={{ background: 'rgba(236, 253, 243, 1)' }} onClick={() => {
                            navigate(`model/${data}`)
                        }}>

                            <div className='view' >
                                <p>Approximately 3 hours left</p>
                            </div>
                        </Button>
                    </div>
                </div>)}

            </div>
            <div className="flex flex-col filesheading">
                <p className='text-start' >Files (14)</p>
                <div className='flex justify-between'>
                    <p>Quickly access your recently uploaded files. Manage all your formulation data in the Files section.</p>
                    <a href='#' >View All</a>
                </div>
            </div>
            <div className='files' >
                <div className="child">
                    <div className="flex flex-col " style={{ height: '161px', gap: '8px', padding: '24px 0px 0 24px' }}>
                        <div className='flex justify-start items-center' style={{ gap: '40px' }}>
                            <span style={{ height: '35px' }}>
                                <img src={folder} style={{ height: '100%' }}></img>
                            </span>
                            <div>
                                <p style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px' }}>1779282660-01-09T14_07_02.csv</p>
                            </div>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}>17 KBS</p>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}>Uploaded: May 16, 2024 10:23 PM</p>
                    </div>
                    <div className='flex justify-center items-center' style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)',
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)', fontWeight: '600', fontSize: '14px', lineHeight: '20px'
                        }}>View File</p>
                    </div>
                </div>
                <div style={{ flexGrow: 1, height: '202px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(234, 236, 240, 1)', borderRadius: '12px' }}>
                    <div className="flex flex-col" style={{ height: '161px', gap: '8px', padding: '24px 0px 0 24px' }}>
                        <div className='flex justify-start items-center' style={{ gap: '40px' }}>
                            <span style={{ height: '35px' }}>
                                <img src={folder} style={{ height: '100%' }}></img>
                            </span>
                            <div>
                                <p style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px' }}>1779282660-01-09T14_07_02.csv</p>
                            </div>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}>17 KBS</p>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}>Uploaded: May 16, 2024 10:23 PM</p>
                    </div>
                    <div className='flex  justify-center items-center' style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)'
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)', fontWeight: '600', fontSize: '14px', lineHeight: '20px'
                        }}>View File</p>
                    </div>
                </div>
                <div style={{ flexGrow: 1, height: '202px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(234, 236, 240, 1)', borderRadius: '12px' }}>
                    <div className="flex flex-col" style={{ height: '161px', gap: '8px', padding: '24px 0px 0 24px' }}>
                        <div className='flex justify-start items-center' style={{ gap: '40px' }}>
                            <span style={{ height: '35px' }}>
                                <img src={folder} style={{ height: '100%' }}></img>
                            </span>
                            <div>
                                <p style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px' }}>1779282660-01-09T14_07_02.csv</p>
                            </div>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}>17 KBS</p>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}>Uploaded: May 16, 2024 10:23 PM</p>
                    </div>
                    <div className='flex justify-center items-center' style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)'
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)', fontWeight: '600', fontSize: '14px', lineHeight: '20px'
                        }}>View File</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;