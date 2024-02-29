import React, { useState, useEffect, useCallback } from 'react';
import { uploadData, list, remove } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import { Container, Row, Col, Button, Alert, Modal } from 'react-bootstrap';
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';
import FileTable from './FileTable';
import { ColorRing } from 'react-loader-spinner';

function UploadViewPage() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showFileUploadModal, setShowFileUploadModal] = useState(false);

    const PAGE_SIZE = 20;
    let nextToken = undefined;

    useEffect(() => {
        fetchUploadedFiles();

    }, []);

    const onDrop = useCallback(acceptedFiles => {
        const uploadedFile = acceptedFiles[0];
        if (uploadedFile) {
            setFile(uploadedFile);
        }


    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
        },
    });


    const fetchUploadedFiles = async () => {
        const userId = (await getCurrentUser()).userId;
        const prefix = `assets/${userId}/`;
        let response = await list({
            prefix: prefix,
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


    const resetModalBody = () => {
        setIsLoading(false);
        setFile(null);
    }

    const resetModal = () => {
        resetModalBody();
        setShowFileUploadModal(false);
    }

    const uploadDataInBrowser = async () => {
        setIsLoading(true);
        //upload csv to s3
        try {
            const userId = (await getCurrentUser()).userId;
            const result = await uploadData({
                key: `assets/${userId}/${file?.name}`,
                data: file
            }).result;

            fetchUploadedFiles();
            resetModal();
        } catch (error) {
            setError(error + ' Error uploading file. Please try again later. ');
        }
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
                    <Button
                        variant="info"
                        onClick={() => setShowFileUploadModal(true)}
                        style={{ float: 'right', color: '#fff' }}
                    >
                        Upload File
                    </Button>

                </Col>

                <Col sm={12}>
                    {
                        files.length === 0 && (
                            <div className='mt-5'>
                                <h3 className='text-center'>Data not found!</h3>
                            </div>
                        )
                    }

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

            <Modal
                show={showFileUploadModal}
                onHide={() => setShowFileUploadModal(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Upload File
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {
                        !isLoading &&
                        < div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                    <p>Drop the CSV file here ...</p> :
                                    <p>Drag 'n' drop your CSV file here, or click to select files</p>
                            }
                            {file && <p>Uploaded file: {file.name}</p>} {/* Display the name of the uploaded file */}
                        </div>
                    }
                    {error && (
                        <Alert variant="danger" onClose={() => setError('')} dismissible style={{ marginTop: '10px' }}>
                            {error}
                        </Alert>
                    )}
                    {
                        isLoading &&
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            <ColorRing
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="color-ring-loading"
                                wrapperStyle={{}}
                                wrapperClass="color-ring-wrapper"
                                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                            />
                            <h4>File is uploading ...</h4>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="info"
                        style={{ color: '#fff' }}
                        onClick={uploadDataInBrowser}
                        disabled={file ? false : true}
                    >
                        Upload
                    </Button>
                    <Button
                        variant="warning"
                        style={{}}
                        onClick={() => resetModalBody()}
                    >
                        Reset
                    </Button>
                    <Button onClick={() => setShowFileUploadModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container >
    )
}

export default UploadViewPage;