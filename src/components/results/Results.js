import React from "react";
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
    return (
        <div style={{ width: '95%', margin: 'auto', marginTop: '20px' }}>
            <h4>Results</h4>
            <Container
                fluid
                style={{ marginTop: '20px' }}
            >
                <Row>
                    {testData.map((item, index) => (
                        <Col key={index} sm={12} md={4} lg={3} xl={2} className="mb-4">
                            <div className="result-box">
                                <h5>{item.title}</h5>
                                <p>{item.info}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    )
}

export default Results;