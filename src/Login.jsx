import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config/api';

function Login(){
    return<>
        <Form />
    </>
}

const Form = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      
      try {
        const response = await fetch(`${API_URL}/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Save token to localStorage
          localStorage.setItem('token', data.token);
          // Dispatch auth change event
          window.dispatchEvent(new Event('authChange'));
          navigate('/admin');
        } else {
          setError(data.message || 'Login failed');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    return (
      <StyledWrapper>
        <div className="login-box">
          <p>Admin Login</p>
          <form onSubmit={handleSubmit}>
            <div className="user-box">
              <input 
                required 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Username</label>
            </div>
            <div className="user-box">
              <input 
                required 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-btn" disabled={loading}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              {loading ? 'Logging in...' : 'Submit'}
            </button>
          </form>
          <p>Login is restricted to Admins only.</p>
        </div>
      </StyledWrapper>
    );
  }
  
  const StyledWrapper = styled.div`
    .login-box {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 400px;
      padding: 40px;
      margin: 20px auto;
      transform: translate(-50%, -55%);
      background: #042b2f;
      box-sizing: border-box;
      box-shadow: 0 15px 25px rgba(0,0,0,.6);
      border-radius: 10px;
    }
  
    .login-box p:first-child {
      margin: 0 0 30px;
      padding: 0;
      color: #fff;
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
      letter-spacing: 1px;
    }
  
    .login-box .user-box {
      position: relative;
    }
  
    .login-box .user-box input {
      width: 100%;
      padding: 10px 0;
      font-size: 16px;
      color: #fff;
      margin-bottom: 30px;
      border: none;
      border-bottom: 1px solid #5eeae3;
      outline: none;
      background: transparent;
    }
  
    .login-box .user-box label {
      position: absolute;
      top: 0;
      left: 0;
      padding: 10px 0;
      font-size: 16px;
      color: #fff;
      pointer-events: none;
      transition: .5s;
    }
  
    .login-box .user-box input:focus ~ label,
    .login-box .user-box input:valid ~ label {
      top: -20px;
      left: 0;
      color: #5eeae3;
      font-size: 12px;
    }
  
    .error-message {
      color: #ff6b6b;
      margin-bottom: 20px;
      text-align: center;
    }

    .submit-btn {
      position: relative;
      display: inline-block;
      padding: 10px 20px;
      font-weight: bold;
      color: #fff;
      font-size: 16px;
      text-decoration: none;
      text-transform: uppercase;
      overflow: hidden;
      transition: .5s;
      margin-top: 40px;
      letter-spacing: 3px;
      background: transparent;
      border: none;
      cursor: pointer;
      width: 100%;
      text-align: center;
    }
  
    .submit-btn:hover {
      background: #5eeae3;
      color: #042b2f;
      border-radius: 5px;
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  
    .submit-btn span {
      position: absolute;
      display: block;
    }
  
    .submit-btn span:nth-child(1) {
      top: 0;
      left: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #5eeae3);
      animation: btn-anim1 1.5s linear infinite;
    }
  
    @keyframes btn-anim1 {
      0% {
        left: -100%;
      }
  
      50%,100% {
        left: 100%;
      }
    }
  
    .submit-btn span:nth-child(2) {
      top: -100%;
      right: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(180deg, transparent, #5eeae3);
      animation: btn-anim2 1.5s linear infinite;
      animation-delay: .375s
    }
  
    @keyframes btn-anim2 {
      0% {
        top: -100%;
      }
  
      50%,100% {
        top: 100%;
      }
    }
  
    .submit-btn span:nth-child(3) {
      bottom: 0;
      right: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(270deg, transparent, #5eeae3);
      animation: btn-anim3 1.5s linear infinite;
      animation-delay: .75s
    }
  
    @keyframes btn-anim3 {
      0% {
        right: -100%;
      }
  
      50%,100% {
        right: 100%;
      }
    }
  
    .submit-btn span:nth-child(4) {
      bottom: -100%;
      left: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(360deg, transparent, #5eeae3);
      animation: btn-anim4 1.5s linear infinite;
      animation-delay: 1.125s
    }
  
    @keyframes btn-anim4 {
      0% {
        bottom: -100%;
      }
  
      50%,100% {
        bottom: 100%;
      }
    }
  
    .login-box p:last-child {
      color: #aaa;
      font-size: 14px;
      margin-top: 20px;
      text-align: center;
    }
  `;
  
export default Login;