import React from 'react';
import { Table } from 'react-bootstrap';

const FileTable = ({ files, deleteFile }) => {

    const bytesToMB = (bytes) => {
        return (bytes / 1048576).toFixed(2);
    }

    const getFileNameFromKey = (key) => {
        const parts = key.split('/');
        const lastElement = parts[parts.length - 1];
        return lastElement;
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>File Name</th>
                    <th>Last Updated</th>
                    <th>Size (Bytes)</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {files.map(file => (
                    <tr key={file.key}>
                        <td>{getFileNameFromKey(file.key)}</td>
                        <td>{new Date(file.lastModified).toLocaleString()}</td>
                        <td>{bytesToMB(file.size)} MB</td>
                        <td>
                            <a style={{ marginRight: '10px' }} href={`/files/${getFileNameFromKey(file.key)}`}>Details</a>
                            <a style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteFile(file.key)}>Delete</a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default FileTable;