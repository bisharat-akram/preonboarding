import { fetchAuthSession } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function SiteNav(props) {
  const [isAdmin, setAdmin] = useState(false);
  const handleLogout = () => {
    props.logOut();
  };

  const getSeasion = async () => {
    const session = await fetchAuthSession();
    const roles = session.tokens.idToken.payload["cognito:groups"];
    if (!roles) return;
    setAdmin(roles.includes("admins"));
  };

  useEffect(() => {
    getSeasion();
  }, []);

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Contacts App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-md-auto">
              {isAdmin && <Nav.Link href="/dashboard">Dashboard</Nav.Link>}
              {isAdmin && (
                <Nav.Link href="/users-roles">Users & Roles</Nav.Link>
              )}
              <Nav.Link href="/upload-file">Upload & View Files</Nav.Link>
              <Nav.Link href="/results">Results</Nav.Link>
              <Nav.Link onClick={handleLogout} style={{ color: "#ff3333" }}>
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default SiteNav;
