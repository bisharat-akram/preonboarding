import React, { useEffect, useState } from "react";
import axios from 'axios';
import { getCurrentUser } from 'aws-amplify/auth';
import { Container, Row, Col } from 'react-bootstrap';
import "../../assets/css/results.css";

const testData = [
    { title: "Result 1", info: "Some data info for Result 1" },
    { title: "Result 2", info: "Some data info for Result 2" },
    { title: "Result 3", info: "Some data info for Result 3" },
    // Add more test data up to 10/12 items
    { title: "Result 4", info: "Some data info for Result 10" },
];

const Results = () => {
    const apiUrl = "https://m1vqmhqu9g.execute-api.us-west-1.amazonaws.com/dev";
    const [results, setResults] = useState([]);

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
                const signedUrl = `https://${urlObj.bucket}.s3.amazonaws.com/${urlObj.key}`;
                // Push the result into the results array
                if (signedUrl) {
                    tempResults.push(signedUrl);
                }
            });

            setResults(tempResults);
            // split by / and get the last element, get the second element which is userId. match with the userId and keep in a list
            // const userFiles = files.filter((file) => file.split('/')[1] === userId);
            // console.log(userFiles);
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
                            <div className="result-box">
                                <img src={item} />
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