import React from "react";
import { Link } from "react-router-dom";

const SignedOutLinks = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Login</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </div>
  );
};

export default SignedOutLinks;
