import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Button, message, Upload, Progress } from 'antd';
const { Dragger } = Upload;
import uploadfileimage from '../assets/uploadfile.png'
import { uploadData } from 'aws-amplify/storage';
import fileicon from '../assets/fileicon.png';
import deleteicon from '../assets/delete.png'
// import { exceldatahandle } from '../../amplify/functions/exceldatahandle/resource.ts'
import '../CSS/Dragger.css'
import * as XLSX from "xlsx";
const DraggerComponent = ({ enablenext, uploadexceldata, changeuploadedfile, addColumns }) => {
    const [fileUploadStatus, setFileUploadStatus] = useState('');
    const [fileList, setFileList] = useState([]);
    const [percent, setPercent] = useState(0);
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
                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((d) => {
            let excelColumns = Object.keys(d[0]).map((data) => {
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
            uploadexceldata(arr);
        });
    };
    const props = {
        name: 'file',
        multiple: false,
        action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
        onChange(info) {
            const { status } = info.file;
            setFileUploadStatus(status)
            if (status === 'removed') {
                setFileUploadStatus('')
                setFileList([])
                enablenext(true);
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
            e.preventDefault();
        },
        onDragOver(e) {
            e.preventDefault(); // Prevent default behavior
        },
    };
    const customRequest = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        try {
            // Example of uploading file using axios
            const formData = new FormData();
            formData.append('file', file);
            onSuccess('file uploaded', file);
            let data = uploadData({
                path: `files-submissions/${file?.name}`,
                data: file,
            });
            changeuploadedfile(file);
            readExcel(file);
            
            const intervalId = setInterval(() => {
                if (percent >= 100) {
                    clearInterval(intervalId);
                    return;
                }
                setPercent((prevValue) => prevValue + 1);
            }, 200);

            setTimeout(() => {
                clearInterval(intervalId);
                enablenext(false);
                message.success(`${file.name} uploaded successfully.`);
            }, 20000);
        } catch (error) {
            // Handle error
            console.error('Upload error:', error);
            onError(error);

            message.error(`${file.name} upload failed.`);
        }
    };
    const handleBeforeUpload = (file) => {


       
        setFileList((prev) => {
            prev.push(file)
            return prev;
        });
        return true;
    };
    return (
        <div className='dragger-container'>
            <Dragger
                style={{
                    display: `${fileUploadStatus !== '' ? 'none' : ''}`, height: '100%', width: '702px', backgroundColor: 'white', border: '1px solid rgba(234, 236, 240, 1)'
                }}
                itemRender={(file, { preview, remove }) => (
                    fileUploadStatus !== '' ? (
                        <div className="custom-item-renderer">
                            <div style={{ display: "flex",justifyContent:'space-between' }}>
                                <div style={{ display: "flex",gap:'10px' }}>
                                    <img style={{ width: '24px', height: '24px' }} src={fileicon} alt={file.name} />
                                    <div style={{textAlign:'start'}}>
                                        <p>{fileList[0].name}</p>
                                        <p>{fileList[0].size}Kb</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: '10px' }} onClick={() => {
                                    if (percent < 100) {
                                        return;
                                    }
                                    setFileUploadStatus('')
                                    setFileList([])
                                    enablenext(true);
                                    setPercent(0);
                                }}>
                                    <img style={{ width: '24px', height: '24px' }} src={deleteicon} alt={file.name} />
                                </div>
                            </div>
                            <Progress percent={percent} strokeColor="#079455" status='normal' />
                        </div>
                    ) : null
                )}
                fileList={fileList}
                beforeUpload={handleBeforeUpload}
                customRequest={customRequest}
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