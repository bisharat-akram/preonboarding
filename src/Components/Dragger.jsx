import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
const { Dragger } = Upload;
import uploadfileimage from '../assets/uploadfile.png'

const DraggerComponent = ({enablenext}) => {
    const props = {
        name: 'file',
        multiple: true,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
                enablenext(true)
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                enablenext(false)
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                enablenext(false)
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    return (
        <Dragger style={{
            height: '100%', width: '702px', backgroundColor: 'white', border: '1px solid rgba(234, 236, 240, 1)'}} {...props}>
        <div className="flex  justify-center" style={{height:'40px',marginBottom:'10px'}}>
                <img src={uploadfileimage}></img>
        </div>
            <p className="ant-upload-text" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}><span style={{
                fontWeight: 600,
                color: 'rgba(105, 65, 198, 1)'
            }}>Click or drag file</span> to this area to upload</p>
            
            <p className="ant-upload-text" style={{ fontSize: '14px', fontWeight: 400, lineHeight: '20px' }}>CSV and XLS files only (max. 100 MB).</p>
            
    </Dragger>)

}
export default DraggerComponent;