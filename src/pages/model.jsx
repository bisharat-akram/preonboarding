import React, { useState, useEffect } from 'react';
import '../CSS/model.css'
import { DownloadOutlined } from '@ant-design/icons';
import config from "../../amplify_outputs.json";
import { list } from 'aws-amplify/storage';
import { Button, Segmented } from 'antd';
import { get } from 'aws-amplify/api';
import { fetchAuthSession } from 'aws-amplify/auth'
import { useParams } from 'react-router-dom';
import { Table } from 'antd';
import FileModel from '../Components/file';
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
    const [userSub, setUserSub] = useState();
    const [columns, setColumns] = useState();
    const [selectedTab, setSelectedTab] = useState('Overview');
    const [fileModelData, setFileModelData] = useState([]);
    const [tableData, setTableData] = useState();
    async function getList() {
        try {
            const session = await fetchAuthSession();
            const token = session.tokens?.idToken
            setUserSub(session.userSub);

            await fetch(`${import.meta.env.VITE_S3URL}/assets/${session.userSub}/${id}/json/data.json`)
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return await response.json();
                })
                .then(data => {

                    console.log(data);
                    let tablecolumn = data?.columns?.map((tempdata) => {
                        console.log(tempdata);
                        return {
                            title: tempdata.toUpperCase(),
                            dataIndex: tempdata,
                            key: tempdata
                        }
                    });

                    let tabledata=data?.data.map((temprow,ind) => {
                        let obj = {};
                        let currentindex = 0;
                        obj['key'] = ind;
                        console.log(temprow)
                        data?.columns?.map((coldata, index) => {
                            console.log(coldata)
                            obj[coldata] = temprow[currentindex++];
                        })
                        return obj;
                    })
                     
                    setTableData(tabledata)
                    setColumns(tablecolumn);
                })
                .catch(error => {
                    console.error('There was a problem fetching the data:', error);
                });
            
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
            console.log(result)
            result = result.filter((data) => {
                let pattern = new RegExp(`^assets\/${session.userSub}\/([^/]+)\/traintask`);
                return data.match(pattern)
            });
            result = result.map((data,index) => {
                console.log(data)
                return {
                    key: index,
                    name: data?.split('/')[4]
                }
            })
            setFileModelData(result)
          
        } catch (error) {
            console.log(error);
        }
    }
    async function onTabChange(value) {
        setSelectedTab(value);
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
                    defaultValue={selectedTab}
                    onChange={onTabChange}
                    style={{
                        background:'rgba(249, 250, 251, 1)'
                    }}
                    options={['Overview', 'Validation', 'Files']}
                />
            </div>
        </div>
        {selectedTab === 'Overview' ? <div className='overview flex justify-between items-center'>
            <div style={{width:'75%'}}>
                <p style={{ fontWeight: 600,fontSize:'18px',lineHeight:'28px'}}>Overview</p>
                <p style={{
                    fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: 'rgba(71, 84, 103, 1)' }}>View the accuracy of your model by comparing its predictions against the actual data from your source file.</p>
            </div>
            <Button type='primary' icon={<DownloadOutlined />} style={{  color:'rgba(255, 255, 255, 1)'}}>Download Graph</Button>
        </div> :
            selectedTab === 'Validation'?<div className='overview flex justify-between items-center'>
            <div style={{ width: '75%' }}>
                <p style={{ fontWeight: 600, fontSize: '18px', lineHeight: '28px' }}>Validation</p>
                <p style={{
                    fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: 'rgba(71, 84, 103, 1)'
                }}>Run validation tests by uploading new data rows to see how well your model's predictions match lab test  results</p>
            </div>
            <Button  style={{ background: 'rgba(7, 148, 85, 1)', color: 'rgba(255, 255, 255, 1)' }}>+ New Validation</Button>
            </div> : <FileModel fileModelData={fileModelData} />
        }
        {selectedTab === 'Overview' ? <div className='image-container'><img src={`${import.meta.env.VITE_S3URL}/assets/${userSub}/${id}/image/Actual_vs_Predicted.png`}></img></div>:''}
        {selectedTab !== 'Files'  && <div className='table-container'>
                <div className='flex justify-between items-center'
                    style={{ height: '81px', padding: '20px 24px' }}
                >
                    <div className='flex gap-4'>
                    <span style={{ fontSize: '18px', color: 'rgba(16, 24, 40, 1)', fontWeight: '600', lineHeight: '28px' }}>{tableData?.length > 1 ? `${tableData?.length} Files` : `${tableData?.length} File`} </span>
                        
                    </div>
                   
                </div>
                <Table className="modal-table" columns={columns} dataSource={tableData} /> 
            </div>}
    </div>
        ;
};
export default Model;