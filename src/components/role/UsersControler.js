import React, { memo, useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { get } from "aws-amplify/api";
import { fetchAuthSession } from "aws-amplify/auth";
import UpdateRoleModal from "./UpdateRoleModal";

const UsersControler = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userID, setUserID] = useState("");
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

  // const getSeasion = async () => {
  //   const session = await fetchAuthSession();

  //   console.log("id token", session.tokens.idToken);
  //   console.log("access token", session.tokens.accessToken);
  // };

  useEffect(() => {
    getUserList();
    // getSeasion();
  }, []);

  return (
    <React.Fragment>
      <Container className="mt-3 mb-5">
        <Row className="g-4">
          <Col md={12}>
            <div className="d-flex justify-content-between align-items-center">
              <h2>Users</h2>
            </div>
          </Col>
          <Col md={12}>
            <Card>
              <Card.Header>User List</Card.Header>
              {loading ? (
                <p className="text-center py-5">Loading...</p>
              ) : (
                <Table striped bordered hover size="md">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Created Date</th>
                      <th>Roles</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Map through your data here */}
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>{user.email}</td>
                        <td>{user.createdAt}</td>
                        <td style={{ textTransform: "capitalize" }}>
                          {user?.roles?.toString().replaceAll(",", " | ")}
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            style={{ marginRight: "7px" }}
                            onClick={() => {
                              setShowModal(true);
                              setUserID(user.userId);
                            }}
                          >
                            Update Role
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal to update role of a particular user */}
      {showModal && userID && (
        <UpdateRoleModal
          showModal={showModal}
          setShowModal={setShowModal}
          setUserID={setUserID}
          getUserList={getUserList}
          users={users}
          userID={userID}
        />
      )}
    </React.Fragment>
  );
};

export default memo(UsersControler);
