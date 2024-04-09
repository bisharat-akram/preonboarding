import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCurrentUser } from 'aws-amplify/auth';
import { Container, Row, Col } from 'react-bootstrap';
import "../../assets/css/results.css";

const Results = () => {
    const apiUrl = "https://m1vqmhqu9g.execute-api.us-west-1.amazonaws.com/dev";
    const [results, setResults] = useState([]);

    const navigate = useNavigate();

    const getS3UrlBodies = (urlKey) => {
        // return bucket and key
        const parts = urlKey.replace("s3://", "").split('/');
        return {
            bucket: parts[0],
            key: parts.slice(1).join('/')
        };
    }

    const fetchResults = async () => {
        const userId = (await getCurrentUser()).userId;

        axios.get(apiUrl).then((response) => {
            const data = response.data?.body;
            const body = JSON.parse(data);
            const files = body?.files;
            const tempResults = [];

            files.forEach(path => {
                const fielData = path.split('/');
                if (userId !== fielData[1]) return;
                let urlObj = getS3UrlBodies(path);
                const imageUrl = `https://lambda-png-opentoall.s3.us-west-1.amazonaws.com/${path}`;
                // Push the result into the results array
                tempResults.push(imageUrl);
            });

            setResults(tempResults);
        }).catch((error) => {

        });
    }


    useEffect(() => {
        fetchResults();
    }, []);


    return (
        <div style={{ width: '95%', margin: 'auto', marginTop: '20px' }}>
            <h4>Results</h4>
            <Container
                fluid
                style={{ marginTop: '20px' }}
            >
                <Row>
                    {results.map((item, index) => (
                        index % 2 === 0 && <Col key={index} sm={12} md={4} lg={3} xl={2} className="mb-4">
                            <div className="result-box" onClick={() => navigate(`/results/${index}`)}>
                                <img src={item} style={{ display: 'block', width: '100%' }} />
                            </div>
                        </Col>
                    ))}
                    {
                        results.length === 0 && (
                            <div className='mt-5'>
                                <h3 className='text-center'>Data not found!</h3>
                            </div>
                        )
                    }
                </Row>
            </Container>
        </div>
    )
}

export default Results;