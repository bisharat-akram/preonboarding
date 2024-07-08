import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
import uploadfileimage from '../assets/uploadfile.png'
import { uploadData } from 'aws-amplify/storage';
// import { exceldatahandle } from '../../amplify/functions/exceldatahandle/resource.ts'
import '../CSS/Dragger.css'
import * as XLSX from "xlsx";
const DraggerComponent = ({ enablenext, uploadexceldata, changeuploadedfile, addColumns }) => {
    const [fileUploadStatus, setFileUploadStatus] = useState('');
    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);
                console.log(data);
                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((d) => {
            // exceldatahandle(d);
            console.log(d)
            let excelColumns = Object.keys(d[0]).map((data) => {
                console.log(data)
                return {
                    title: data,
                    label: data,
                    value: data,
                    dataIndex: data
                }
            })
            addColumns(excelColumns);

            let arr = d.map((data, ind) => {
                data['key'] = ind + 1;
                return data;
            });
            console.log(excelColumns)
            uploadexceldata(arr);
        });
    };
    const props = {
        name: 'file',
        multiple: false,
        action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
        onChange(info) {
            const { status } = info.file;
            console.log(status)
            setFileUploadStatus(status)
            if (status === 'removed') {
                setFileUploadStatus('')
                enablenext(true);
            }
            else if (status !== 'uploading') {
                console.log(info.file, info?.file?.originFileObj);
                // setFile(info.file);
                let data = uploadData({
                    path: `files-submissions/${info?.file?.name}`,
                    data: info?.file?.originFileObj,
                });
                changeuploadedfile(info?.file?.originFileObj)
                readExcel(info?.file?.originFileObj);
                console.log(data);
                enablenext(false);
            }

            // if (status === 'done') {
            //     message.success(`${info.file.name} file uploaded successfully.`);
            //     enablenext(false)
            // } else if (status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            //     enablenext(false)
            // }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    return (
        <div className='dragger-container'>
            <Dragger
                
            style={{
                display: `${fileUploadStatus !== '' ? 'none' : ''}`, height: '100%', width: '702px', backgroundColor: 'white', border: '1px solid rgba(234, 236, 240, 1)'
            }}
            {...props}
                listType="picture">
            <div className="flex  justify-center" style={{ height: '40px', marginBottom: '10px' }}>
                <img src={uploadfileimage}></img>
            </div>
            <p className="ant-upload-text" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}><span style={{
                fontWeight: 600,
                color: '#067647'
            }}>Click or drag file</span> to this area to upload</p>
            <p className="ant-upload-text" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>CSV and XLS files only (max. 100 MB).</p>

        </Dragger> 
           
        </div >
    )

}
export default DraggerComponent;