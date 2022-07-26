import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';

const minLength = 6;
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const handleClick = (event) => {
    event.preventDefault();
    localStorage.setItem('user', JSON.stringify({ email }));
    localStorage.setItem('mealsToken', 1);
    localStorage.setItem('cocktailsToken', 1);
    history.push('foods');
  };
  return (
    <div className="background">
      <main className="Login">
        <form onSubmit={ handleClick }>
          <input
            data-testid="email-input"
            type="email"
            value={ email }
            onChange={ (e) => setEmail(e.target.value) }
            placeholder="Digite seu email"
          />
          <input
            data-testid="password-input"
            type="password"
            value={ password }
            onChange={ (e) => setPassword(e.target.value) }
            placeholder="Digite sua senha"
          />
          <button
            type="submit"
            data-testid="login-submit-btn"
            disabled={ !(email.match(/\S+@\S+\.\S+/) && password.length > minLength) }
          >
            Enter
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;
