import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, InputGroup, FormControl, FormGroup, Checkbox } from 'react-bootstrap';

function RoleListPage() {
    const [showModal, setShowModal] = useState(false);
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    // Dummy data for permissions (you might want to fetch this from a server)
    const permissions = ['Create Post', 'Edit Post', 'Delete Post', 'View Analytics', 'Manage Users'];
    const roleDummyData = [
        {
            roleName: 'System Admin',
            users: 5,
            permissionCount: 40,
            createdBy: 'Nazmul',
            lastUpdated: '03/04/2024 12:00 pm',
        },
        {
            roleName: 'Admin',
            users: 15,
            permissionCount: 20,
            createdBy: 'Neo',
            lastUpdated: '03/04/2024 12:00 pm',
        },
        {
            roleName: 'Editor',
            users: 25,
            permissionCount: 10,
            createdBy: 'Neo',
            lastUpdated: '03/04/2024 12:00 pm',
        },
        {
            roleName: 'Viewer',
            users: 4,
            permissionCount: 5,
            createdBy: 'Neo',
            lastUpdated: '03/04/2024 12:00 pm',
        }
    ]

    return (
        <React.Fragment>
            <Container className='mt-3'>
                <Row className="g-4">
                    <Col md={12}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h2>Role & Permission</h2>
                            <Button variant="primary" size='sm' onClick={handleModalShow}>New Role</Button>
                        </div>
                    </Col>
                    <Col md={12}>
                        <Card>
                            <Card.Header>Role list</Card.Header>
                            <Table striped bordered hover size="md">
                                <thead>
                                    <tr>
                                        <th>Role Name</th>
                                        <th>User Count</th>
                                        <th>Permission Count</th>
                                        <th>Created By</th>
                                        <th>Last Updated</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Map through your data here */}
                                    {
                                        roleDummyData.map((role, index) => (
                                            <tr key={index}>
                                                <td>{role.roleName}</td>
                                                <td>{role.users}</td>
                                                <td>{role.permissionCount}</td>
                                                <td>{role.createdBy}</td>
                                                <td className="text-success">{role.lastUpdated}</td>
                                                <td>
                                                    <Button variant="primary" size="sm" style={{ marginRight: '7px' }}>Edit</Button>
                                                    <Button variant="danger" size="sm">Delete</Button>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal for adding a new role */}
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a New Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <FormGroup className="mb-3">
                            <Form.Label>Role Name</Form.Label>
                            <FormControl type="text" placeholder="Enter role name" />
                        </FormGroup>
                        <FormGroup>
                            <Form.Label>Permissions</Form.Label>
                            <Row>
                                {permissions.map((permission, index) => (
                                    <Col md={6} key={index} className="mb-3">
                                        <InputGroup>
                                            <InputGroup.Checkbox />
                                            <FormControl type="text" value={permission} readOnly />
                                        </InputGroup>
                                    </Col>
                                ))}
                            </Row>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleModalClose}>
                        Create Role
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default RoleListPage;