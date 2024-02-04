import React from 'react';
import { Table } from 'react-bootstrap';

const FileTable = ({ files, deleteFile }) => {

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>File Name</th>
                    <th>E Tag</th>
                    <th>Last Updated</th>
                    <th>Size (Bytes)</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {files.map(file => (
                    <tr key={file.key}>
                        <td>{file.key}</td>
                        <td>{file.eTag}</td>
                        <td>{new Date(file.lastModified).toLocaleString()}</td>
                        <td>{file.size}</td>
                        <td>
                            <a style={{ marginRight: '10px' }} href={`/files/${file.key}`}>Details</a>
                            <a style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteFile(file.key)}>Delete</a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default FileTable;