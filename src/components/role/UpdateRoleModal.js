import { memo, useState } from "react";
import { Button, Modal, Form, FormGroup } from "react-bootstrap";
import { post } from "aws-amplify/api";

const UpdateRoleModal = ({
  showModal,
  setShowModal,
  setUserID,
  getUserList,
  users,
  userID,
}) => {
  const matchUser = users.find((u) => u.userId === userID);
  const isAdmin = matchUser.roles.includes("Admin");
  const isExecute = matchUser.roles.includes("Execute");
  const [isAdminEnable, setAdminEnable] = useState(isAdmin);
  const [isExecuteEnable, setExecuteEnable] = useState(isExecute);
  const [isLoading, setLoading] = useState(false);

  const handleUpdateRoleSubmit = async () => {
    setLoading(true);
    // If nothing change then don't call the api
    if (isAdmin === isAdminEnable && isExecute === isExecuteEnable) {
      setUserID("");
      setShowModal(false);
      return;
    }
    // If something changed on the role then call the api to update
    const updateData = {
      isAdmin: isAdminEnable,
      isExecute: isExecuteEnable,
      userId: userID,
    };

    try {
      const restOperation = post({
        apiName: "aiagentplatform",
        path: "/update-roles",
        options: {
          body: updateData,
        },
      });
      const { body } = await restOperation.response;
      const response = await body.json();

      console.log("POST call succeeded");
      console.log(response);

      getUserList();
      setUserID("");
      setShowModal(false);
      setLoading(false);
    } catch (error) {
      console.log("POST call failed: ", JSON.parse(error.response.body));
      setLoading(false);
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add a New Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <FormGroup className="mb-3">
            <Form.Label className="mb-3">Roles</Form.Label>
            <Form.Check
              defaultChecked={true}
              disabled
              type="switch"
              id="viewer-switch"
              label="Viewer"
              className="mb-2"
            />
            <Form.Check
              defaultChecked={isExecute}
              onChange={(e) => setExecuteEnable(e.target.checked)}
              type="switch"
              id="execute-switch"
              label="Execute"
            />
            <Form.Check
              defaultChecked={isAdmin}
              onChange={(e) => setAdminEnable(e.target.checked)}
              type="switch"
              id="admin-switch"
              label="Admin"
              className="mb-2"
            />
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdateRoleSubmit}>
          {isLoading ? "Loading..." : "Update Role"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(UpdateRoleModal);
