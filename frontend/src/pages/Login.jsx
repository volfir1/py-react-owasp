import React from 'react';
import { useNavigate } from 'react-router-dom';
import bugFillIcon from '../assets/svg/bug-fill.svg'; // Make sure to add this SVG to your assets

const LoginPage = ({ title, project, author, version, url }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Handle login logic here
    // You might want to make an API call to your backend
    console.log('Login attempt:', username, password);
  };

  return (
    <div className="text-center">
      <main className="container d-flex align-items-center justify-content-center min-vh-100">
        <form 
          className="form-signin" 
          onSubmit={handleSubmit}
          style={{ width: '100%', maxWidth: '330px', padding: '15px', margin: 'auto' }}
        >
          <img 
            className="mb-4" 
            src={bugFillIcon} 
            alt="" 
            width="72" 
            height="72" 
          />
          <h1 className="h3 mb-3 font-weight-normal">{title}</h1>
          
          <div className="form-floating mb-3">
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              name="username" 
              placeholder="Username" 
              required 
              autoFocus 
            />
            <label htmlFor="username" className="sr-only">Username</label>
          </div>
          
          <div className="form-floating mb-3">
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              name="password" 
              placeholder="Password" 
              required 
            />
            <label htmlFor="password" className="sr-only">Password</label>
          </div>

          <button className="btn btn-lg btn-primary btn-block w-100" type="submit">
            Sign in
          </button>
        </form>
      </main>

      <footer className="footer mt-auto py-3">
        <div className="container">
          <div className="row">
            <div className="col-6 text-start">
              <small>&copy; 2021 {author}</small>
            </div>
            <div className="col-6 text-end">
              <small>
                <a href={url}>{version}</a>
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;