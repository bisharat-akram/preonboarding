import React, { useState, useEffect } from 'react';
import '../CSS/model.css'
import { DownloadOutlined } from '@ant-design/icons';
import config from "../../amplify_outputs.json";
import { list } from 'aws-amplify/storage';
import { Button, Segmented } from 'antd';
import { get } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth'
import { useParams } from 'react-router-dom';
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
const Model = () => {
    let { id } = useParams();
    const [userSub,setUserSub] = useState() 
    async function getList() {
        try {
            const session = await fetchAuthSession();
            setUserSub(session.userSub);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        
        getList()
},[])
    return <div className="model-parent flex flex-col justify-center">
        <div className="flex flex-col model-bresdcrump-header">
            <div className="flex justify-between">
                <div>
                    <p className='modelname'>Model 01</p>
                    <span className='createdtime'>Created: May 22, 2024 12:04 PM PT</span>
                    <span className="m-4 createdtime">Created: May 22, 2024 12:04 PM PT</span>
                </div>
                <div>
                    <Button>Edit Model</Button>
                </div>
            </div>
            <div className='flex justify-start tab-parent-div items-center'>
                <Segmented
                    defaultValue="center"
                    style={{
                        marginBottom: 8,
                        background:'rgba(249, 250, 251, 1)'
                    }}
                    options={['Overview', 'Validation', 'Files']}
                />
            </div>
        </div>
        <div className='overview flex justify-between items-center'>
            <div style={{width:'75%'}}>
                <p style={{ fontWeight: 600,fontSize:'18px',lineHeight:'28px'}}>Overview</p>
                <p style={{
                    fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: 'rgba(71, 84, 103, 1)' }}>View the accuracy of your model by comparing its predictions against the actual data from your source file.</p>
            </div>
            <Button icon={<DownloadOutlined />} style={{ background: 'rgba(7, 148, 85, 1)', color:'rgba(255, 255, 255, 1)'}}>Download Graph</Button>
        </div>
        <div className='image-container'><img src={`${import.meta.env.VITE_S3URL}/assets/${userSub}/${id}/image/Actual_vs_Predicted+(2).png`}></img></div>
    </div>
        ;
};
export default Model;