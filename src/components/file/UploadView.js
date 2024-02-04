import React, { useState, useEffect } from 'react';
import { uploadData, list, remove } from 'aws-amplify/storage';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import Papa from 'papaparse';
import FileTable from './FileTable';

function UploadViewPage() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const PAGE_SIZE = 20;
    let nextToken = undefined;

    useEffect(() => {
        fetchUploadedFiles();
    }, []);

    const handleChange = (e) => {
        setFile(e.target.files[0]);
    };

    function CSVTable({ data }) {
        if (data.length === 0) {
            return null;
        }

        const headers = Object.keys(data[0]);

        return (
            <table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {headers.map((header, idx) => (
                                <td key={idx}>{row[header]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }


    const fetchUploadedFiles = async () => {
        let response = await list({
            options: {
                limit: PAGE_SIZE,
                nextToken: nextToken
            }

        });
        if (response.items === 0) return;
        if (response.nextToken) {
            nextToken = response.nextToken;
        } else {
            nextToken = undefined;
        }

        setFiles(response.items);
    }

    const uploadDataInBrowser = async () => {
        setIsLoading(true);
        //upload csv to s3
        await uploadData({
            key: file.name,
            data: file
        }).result;

        fetchUploadedFiles();
    };

    const deleteFile = async (fileKey) => {

        try {
            await remove({ key: fileKey, options: { accessLevel: 'public' } });
            fetchUploadedFiles();
            setError('');
        } catch (error) {
            setError(error + ' Error deleting file. Please try again later. ');
        }
    }

    return (
        <Container>
            <Row className="px-4 my-5">
                <Col sm={12}>
                    <h2 className="font-weight-light text-center">Upload & View Files</h2>

                    <div style={{ marginTop: '20px', background: '#e6e6e6', padding: '20px 25px', borderRadius: '10px' }}>
                        <p className="font-weight-light">Upload & View Files</p>
                        <input type="file" onChange={handleChange} accept=".csv" />
                        <Button
                            variant="outline-info"
                            style={{ marginLeft: '1rem' }}
                            onClick={uploadDataInBrowser}
                        >
                            Upload CSV
                        </Button>
                    </div>

                </Col>

                <Col sm={12}>
                    {
                        files.length === 0 && (
                            <div className='mt-5'>
                                <h3 className='text-center'>Data not found!</h3>
                            </div>
                        )
                    }
                    {error && (
                        <Alert variant="danger" onClose={() => setError('')} dismissible style={{ marginTop: '10px' }}>
                            {error}
                        </Alert>
                    )}
                    {
                        files.length > 0 && (
                            <div style={{ marginTop: '20px' }}>
                                <p className="font-weight-light">Uploaded File List</p>

                                <FileTable files={files} deleteFile={deleteFile} />
                            </div>
                        )
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default UploadViewPage;