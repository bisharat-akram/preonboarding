import React, { useState } from 'react';
import icondual from '../assets/icondual.png'
import dots3 from '../assets/dots3.png'
import folder from '../assets/folder.png'
import Sidebar from '../Components/Sidebar';
import Arrowup from '../assets/arrowup.png';
import '../CSS/Dashboard.css'
import { Button, Segmented, Tabs } from 'antd';
import { ModalComponent as Modal } from '../Components/modal'
const onChange = (key) => {
    console.log(key);
};
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
    const [open, setOpen] = useState(false);
    async function closeOpenModal(val) {
        setOpen(val);
    }
    return (
        <div className='h-full w-full dashboard' >
            <div className='text-start flex flex-col home'>
                <p >Home</p>
                <div className='tab'>
                    <Segmented
                        defaultValue="30 days"
                        style={{
                            marginTop: 8,
                            marginBottom: 8,
                            background: 'white',
                            border: '1px solid rgba(208, 213, 221, 1)'
                        }}
                        itemColor='blue'
                        onChange={(value) => setAlignValue(value)}
                        options={['30 days', '7 days', '24 hours']}
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
                <div className="child">
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
                        <Button style={{ background: 'rgba(236, 253, 243, 1)' }} onClick={() => setOpen(true)}>

                            <div className='view' >
                                <p>Approximately 3 hours left</p>
                            </div>
                        </Button>
                    </div>
                </div>
                <div className="child">
                    <div className="flex justify-between w-full gap-4 items-center images" >
                        <img src={icondual}></img>
                        <span ><img src={dots3} ></img></span>
                    </div>
                    <div className="content"  >
                        <div className="pill" >
                            <p>Processing
                            </p>
                        </div>

                        <p className='text-start text-title'>Model Testing 03</p>

                        <p className='text-start  createdtime'>Created: May 17, 2024 11:18 PM</p>
                        <Button style={{ background: 'rgba(236, 253, 243, 1)' }} onClick={() => setOpen(true)}>

                            <div className='view' >
                                <p>Open</p>
                            </div>
                        </Button>
                    </div>
                </div>
                <div className="child">
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

                        <p className='text-start  createdtime'>Created: May 17, 2024 11:18 PM</p>
                        <Button style={{ background: 'rgba(236, 253, 243, 1)' }} onClick={() => setOpen(true)}>

                            <div className='view' >
                                <p>Open</p>
                            </div>
                        </Button>
                    </div>
                </div>
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
                        <div className='flex justify-start items-center' style={{gap:'40px'}}>
                            <span style={{ height: '35px' }}>
                                <img src={folder} style={{ height: '100%' }}></img>
                            </span>
                            <div>
                                <p style={{ fontSize: '15px', fontWeight: '600', lineHeight: '24px' }}>1779282660-01-09T14_07_02.csv</p>
                            </div>
                        </div>
                        <p className="text-start" style={{ color: 'rgba(130, 130, 130, 1)' }}>17 KBS</p>
                        <p className="text-start" style={{ color:'rgba(130, 130, 130, 1)'}}>Uploaded: May 16, 2024 10:23 PM</p>
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
                        <p className="text-start" style={{ color:'rgba(130, 130, 130, 1)'}}>Uploaded: May 16, 2024 10:23 PM</p>
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
                        <p className="text-start" style={{ color:'rgba(130, 130, 130, 1)'}}>17 KBS</p>
                        <p className="text-start" style={{ color:'rgba(130, 130, 130, 1)'}}>Uploaded: May 16, 2024 10:23 PM</p>
                    </div>
                    <div className='flex justify-center items-center' style={{
                        height: '40px', borderTop: '1px solid rgba(234, 236, 240, 1)'
                    }}>
                        <p style={{
                            color: 'rgba(7, 148, 85, 1)',fontWeight:'600',fontSize:'14px',lineHeight:'20px'}}>View File</p>
                    </div>
                </div>

               
                {open ? <Modal open={open} closeOpenModal={closeOpenModal} /> : ''}
            </div>
        </div>
    );
};
export default Dashboard;