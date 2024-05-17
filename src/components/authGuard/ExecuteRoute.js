import React from "react";
import { useNavigate } from "react-router-dom";

const ExecuteRoute = () => {
  const [isLoading, setLoading] = useState(false);
  const [isExecute, setExecute] = useState(false);
  const navigate = useNavigate();

  const getSeasion = async () => {
    const session = await fetchAuthSession();
    const roles = session.tokens.idToken.payload["cognito:groups"];

    if (roles && roles.includes("executes")) {
      setExecute(true);
    } else {
      navigate("/");
      setExecute(false);
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

      {isExecute && children}
    </>
  );
};
export default ExecuteRoute;
