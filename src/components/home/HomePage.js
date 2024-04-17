import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { FaUser } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
    datasets: [
        {
            label: 'July',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'August',
            data: [2, 3, 20, 5, 1, 4],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
};

const options = {
    plugins: {
        title: {
            display: true,
            text: 'Chart.js Bar Chart - Stacked',
        },
    },
    responsive: true,
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

function HomePage() {
    return (
        <React.Fragment>
            <Container fluid className='mt-3'>
                <Row className="g-4">
                    <Col md={12}>
                        <h2>Dashboard</h2>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Title>Total Users</Card.Title>
                                <Card.Text>
                                    <h3>345k</h3>
                                    <p>Feb 1 - Apr 1, @WorldWide</p>
                                    <p className="text-success">↑ 18.2% Since last month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Title>Number of lambda excution</Card.Title>
                                <Card.Text>
                                    <h3>43,594</h3>
                                    <p>Feb 1 - Apr 1, @WorldWide</p>
                                    <p className="text-success">↑ 28.4% Since last month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100">
                            <Card.Body>
                                <Card.Title>Traffic Share</Card.Title>
                                {/* You would include your donut chart component here */}
                                <p>Desktop 60%</p>
                                <p>Mobile Web 30%</p>
                                <p>Tablet Web 10%</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={8}>
                        <Card>
                            <Card.Header>User list</Card.Header>
                            <Table striped bordered hover size="md">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Joined Date</th>
                                        <th>Last Login</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Map through your data here */}
                                    <tr>
                                        <td>Jhon Doe</td>
                                        <td>jhon.doe@gmail.com</td>
                                        <td>12/03/2023</td>
                                        <td className="text-success">03/04/2024 12:00 pm</td>
                                    </tr>
                                    <tr>
                                        <td>Nazmul Hasan</td>
                                        <td>nazmul-trade@boxy.com</td>
                                        <td>12/03/2023</td>
                                        <td className="text-success">03/04/2024 12:00 pm</td>
                                    </tr>
                                    <tr>
                                        <td>Nazmul Hasan</td>
                                        <td>nazmul-trade@boxy.com</td>
                                        <td>12/03/2023</td>
                                        <td className="text-success">03/04/2024 12:00 pm</td>
                                    </tr>
                                    <tr>
                                        <td>Nazmul Hasan</td>
                                        <td>nazmul-trade@boxy.com</td>
                                        <td>12/03/2023</td>
                                        <td className="text-success">03/04/2024 12:00 pm</td>
                                    </tr>

                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Number of lambda excution in last week</Card.Title>
                                <Card.Text>
                                    <h2>452</h2>
                                    <p className="text-success">↑ 18.2%</p>
                                </Card.Text>
                                <Bar data={data} options={options} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default HomePage;