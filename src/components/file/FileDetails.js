import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import Papa from 'papaparse';
import FileTable from './FileTable';

function FileDetailsPage() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { fileKey } = useParams();

    useEffect(() => {
        getSignUrl();
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

    const getSignUrl = async () => {
        const getUrlResult = await getUrl({
            key: fileKey
        });
        const signedUrl = getUrlResult.url.href;
        const response = await fetch(signedUrl);
        const text = await response.text();
        Papa.parse(text, {
            header: true,
            complete: (results) => {
                setData(results.data);
                setIsLoading(false);
            },
            error: (error) => {
                console.error('Error parsing CSV file:', error);
                setIsLoading(false);
            }
        });
    }


    return (
        <Container>
            <Row className="px-4 my-5">
                <Col sm={12}>
                    <h2 className="font-weight-light text-center">Uploaded File Details</h2>
                    <p><a href="/files">Back to Files</a></p>

                    {/* Loader or Message */}
                    {isLoading ? (
                        <div style={{ textAlign: 'center', margin: '20px' }}>
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <CSVTable data={data} />
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default FileDetailsPage;