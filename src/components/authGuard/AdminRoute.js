import { fetchAuthSession } from "aws-amplify/auth";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const [isLoading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const navigate = useNavigate();

  const getSeasion = async () => {
    const session = await fetchAuthSession();
    const roles = session.tokens.idToken.payload["cognito:groups"];
    if (!roles) return;
    if (roles.includes("admins")) {
      setAdmin(true);
    } else {
      navigate("/dashboard");
      setAdmin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getSeasion();
  }, []);

  return (
    <>
      {isLoading && (
        <div
          className="py-5 d-flex justify-content-center align-items-center"
          style={{ height: "60dvh" }}
        >
          <Spinner animation="border" />
        </div>
      )}

      {isAdmin && children}
    </>
  );
};

export default AdminRoute;
