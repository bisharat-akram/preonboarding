import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaUser } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { get } from "aws-amplify/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
  datasets: [
    {
      label: "July",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "August",
      data: [2, 3, 20, 5, 1, 4],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const options = {
  plugins: {
    title: {
      display: true,
      text: "Chart.js Bar Chart - Stacked",
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all users from cognito user pool
  async function getUserList() {
    setLoading(true);
    try {
      const restOperation = get({
        apiName: "aiagentplatform",
        path: "/get-users",
      });
      const data = await (await restOperation.response).body.json();
      setUsers(data?.users);
      setLoading(false);
    } catch (error) {
      console.log("GET call failed: ", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <React.Fragment>
      <Container className="mt-3">
        <Row className="g-4">
          <Col md={12}>
            <h2>Dashboard</h2>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Total Users</Card.Title>
                <Card.Text>
                  <h3>{users.length}</h3>
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
              {loading ? (
                <p className="text-center py-5">Loading...</p>
              ) : (
                <Table striped bordered hover size="md">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Created Date</th>
                      <th>Roles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map through your data here */}
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt)?.toUTCString()}</td>
                        <td style={{ textTransform: "capitalize" }}>
                          {user?.roles?.toString().replaceAll(",", " | ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
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
  );
}

export default HomePage;
