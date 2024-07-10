import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { Table } from 'antd';
import '../CSS/file.css';
import config from "../../amplify_outputs.json";
import { fetchAuthSession } from 'aws-amplify/auth';
import { get } from 'aws-amplify/api';
import { list } from 'aws-amplify/storage';
import Filetypeicon from '../assets/Filetypeicon.png'
const columns = [
    {
        title: 'File name',
        dataIndex: 'name',
        render: (text) => <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center',gap:'5px' }}><div><img src={Filetypeicon} style={{height:'30px'}}></img></div><div style={{fontWeight:500,fontSize:'14px'}}>{text}</div></div>,
    },
    {
        title: 'File size',
        dataIndex: 'size',
    },
    
];

const FileModel = ({ fileModelData }) => {
    const [modelData,setModelData] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRows);
        setSelectedRowKeys(() => {
            console.log(newSelectedRowKeys)
            return newSelectedRowKeys;
        });
    };


    async function getListAmp() {
        const session = await fetchAuthSession();
        const result = await list({
            path: `files-submissions/${session?.userSub}`,
        });
       let columndata= result?.items?.map((data,index) => {
            return {
                key: index,
                name: data?.path?.split('/')[2]
            }
       })
        setModelData(columndata);
    }
    useEffect(() => {
        console.log('xdd', fileModelData)
        if (!fileModelData) {
            getListAmp()
            
        }
    }, [])




    return (
        <div className='filemodel' >
            <div className='overview flex justify-between items-center'>
                <div style={{ width: '75%' }}>
                    <p style={{ fontWeight: 600, fontSize: '18px', lineHeight: '28px' }}>Files</p>
                    <p style={{
                        fontWeight: 400, fontSize: '14px', lineHeight: '20px', color: 'rgba(71, 84, 103, 1)'
                    }}>Access all files related to your model, including the training file and any additional files used for validation tests.</p>
                </div>
            </div>
            <div className='file-table'>
                <div style={{ width: '75%',padding:'24px',textAlign:'start' }}>
                    <p style={{ fontWeight: 600, fontSize: '18px', lineHeight: '28px' }}>Training File</p>
                </div>
                <Table rowSelection={{
                    selectedRowKeys,
                    onChange: onSelectChange,
                }} className="modal-table" columns={columns} dataSource={fileModelData ? fileModelData : modelData}/> 
            </div>
        </div>
    );
};
export default FileModel;