import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUser } from 'aws-amplify/auth';
import { Container, Row, Col, Button } from 'react-bootstrap';
import "../../assets/css/results.css";

const ResultsDetails = () => {
    const apiUrl = "https://m1vqmhqu9g.execute-api.us-west-1.amazonaws.com/dev";

    const navigate = useNavigate();

    const [predictedImage, setPredictedImage] = useState("");
    const [predictedJson, setPredictedJson] = useState(null);

    const { key } = useParams();

    const getS3UrlBodies = (urlKey) => {
        // return bucket and key
        const parts = urlKey.replace("s3://", "").split('/');
        return {
            bucket: parts[0],
            key: parts.slice(1).join('/')
        };
    }

    const renderDataTable = (columns, data) => {
        return (
            <table className="table table-bordered">
                <thead>
                    <tr>
                        {columns && columns.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((row, index) => (
                        <tr key={index}>
                            {row.map((cell, idx) => (
                                <td key={idx}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    const fetchResults = async () => {
        let itemIndex = parseInt(key);
        axios.get(apiUrl).then((response) => {
            const res = response.data;
            if (res.statusCode === 200) {
                const data = response.data?.body;
                const body = JSON.parse(data);
                const files = body?.files;

                const imageUrl = `https://lambda-png-opentoall.s3.us-west-1.amazonaws.com/${files[itemIndex]}`;
                const jsonSignedUrl = `https://lambda-png-opentoall.s3.us-west-1.amazonaws.com/${files[itemIndex + 1]}`;

                setPredictedImage(imageUrl);

                axios({
                    method: 'get',
                    url: jsonSignedUrl
                }).then(response => {
                    setPredictedJson(response.data);
                }).catch(error => {
                    console.error('Error getting prediction data:', error);
                });
            }


        }).catch((error) => {

        });
    }


    useEffect(() => {
        let itemIndex = parseInt(key);
        if (itemIndex % 2 !== 0) navigate("/results");
        fetchResults();
    }, []);


    return (
        <div style={{ width: '95%', margin: 'auto', marginTop: '20px' }}>
            <Container
                fluid
                style={{ marginTop: '20px' }}
            >
                <div style={{ width: '100%', padding: '10px 40px', marginTop: '15px' }}>
                    <Button variant="danger" size="sm" style={{ float: 'right' }}>Delete</Button>
                    <p style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate("/results")}>{'Back to Results'}</p>
                    {predictedImage && <img
                        style={{ display: 'block', margin: 'auto' }}
                        src={predictedImage}
                    />
                    }
                    <div style={{ width: '80%', margin: 'auto', marginTop: '20px' }}>
                        <h5 style={{ marginBottom: '20px' }}>Prediction Data Table</h5>
                        {predictedJson && renderDataTable(predictedJson.columns, predictedJson.data)}
                    </div>
                </div>

            </Container>
        </div>
    )
}

export default ResultsDetails;