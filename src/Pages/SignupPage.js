import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import app from "../firebase";

const auth = getAuth(app);

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const signUpUserWithEmailPassword = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
      navigate('/')
  };

  return (
    <div className="container">
      <h1>Sign Up Page Rishab</h1>
      <div className="field">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="someone@example.com"
        />
      </div>
      <div className="field">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="password"
        />
      </div>
      <div className="field">
        <label>Confirm Password</label>
        <input type="password" placeholder="confirm password" />
      </div>
      <button className="button-54" onClick={signUpUserWithEmailPassword}>
        Sign Up
      </button>
      <div>
        Already have an account?{" "}
        <Link to="/login">
          <span className="login-here-text">Login here</span>
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
