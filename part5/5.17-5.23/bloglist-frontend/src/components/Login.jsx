import { useState } from 'react';
import  LoginService from '../services/login'
import PropTypes from 'prop-types'

const Login = ( {setUser }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);


    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const user = await LoginService.login({ username, password }); 
            window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user)); 
            setUser(user);
            setUsername('');
            setPassword('');
        } catch (error) {
            setError('Invalid username or password');
            console.error('Login failed:', error);
            setTimeout(() => {
                setError(null); 
            }, 5000);
         }
        }
    

    return (
        <div className="login-container">   
            <h2>Login to application</h2>
            <form onSubmit = {handleLogin}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" name="username" 
                        placeholder="Username"
                        value={username} onChange={({target}) => {setUsername(target.value)}}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password"
                        placeholder="Password"
                        value={password} onChange={({target}) => {setPassword(target.value)}}
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    )
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired
}

export default Login;