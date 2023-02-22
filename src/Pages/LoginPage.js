import React, { useState } from 'react';
import './LoginPage.css'
import app from '../firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';

const auth = getAuth(app)

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword]= useState('')
    const navigate = useNavigate()

    const signUpUserWithEmailPassword = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // User is signed in
          const user = userCredential.user;
          // Do something with the user object
        })
        .catch((error) => {
          // Handle errors here
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`Error: ${errorCode} - ${errorMessage}`);
        });
        navigate('/')
    }

    return (
        <div className='container'>
            <h1>
            ToDo 
            </h1>
            <div className='field'>
                <label>Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='someone@example.com' />
            </div>
            <div className='field'>
                <label>Password</label>
                <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" placeholder='password' />
            </div>
            
            <button className='button-54' onClick={signUpUserWithEmailPassword}>Sign In</button>
            <div>Don't have an account? <Link to='/signup'><span className='login-here-text'>Sign up here</span></Link></div>
        </div>
    );
};

export default LoginPage;