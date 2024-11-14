import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const LoginPage = ()=>{
    // const usernamePattern = /[0-9]/g ; 
    const [usernameRequirements, setUsernameRequirements] = useState('');
    var [passwordRequirements, setPasswordRequirements] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(()=>{
        localStorage.setItem('token', 'null');
    })

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log('login: in try block');                 
            const res = await axios.post('http://localhost:8000/login', { username, password });
            setMessage(res.data.message);
            console.log('login:', res.status);
            if (res.status === 200) {
                console.log( 'token from server', res.data.token);
                localStorage.setItem('token', 'null');
                if(res.data.token) localStorage.setItem('token', res.data.token);
                else {
                    alert('No token recived');
                }
                alert('Login successful! ', res.data.token);
                localStorage.setItem('username', username);
                navigate("/dashboard");
            } 

            else {
                alert(res.data.message); 
            }
        } catch (err) {
            setMessage(err.response?.data || 'Error logging in');
        }
    };

    return <>
    <div className="card m-1">
        <div className="card-header">
            Login Page
        </div>
        <div className="card-body">
            <form onSubmit={handleLogin}> 
            <div className=''>
                <label htmlFor="username" className=' col-3 form-control-lg'> User Name</label>
                <input type='text' id='username' placeholder="User Name"
                    value={username}
                    onChange={(e) => { 
                        // setUsername(e.target.value);
                        // usernamePattern.test(e.target.value);
                        // usernameRequirements += /[0-9]/.test(e.target.value)? '' : 'A number' ;
                        // usernameRequirements += /[A-Z]/.test(e.target.value)? '' : 'A <b>capital (uppercase)</b> letter' ;
                        // usernameRequirements += (e.target.value.length >= 8)? '' : 'Minimum <b>8 characters</b>' ;
                        // usernameRequirements += /[a-z]/.test(e.target.value)? '' : 'A <b>capital (uppercase)</b> letter' ;
                        const name = e.target.value;
                        const namePattern = /^[a-zA-Z0-9-_\\.]+$/; // Allows letters, numbers, and hyphens 
                        if (!namePattern.test(name)) {
                            setUsernameRequirements( 'Please enter a valid name.(Only letters, numbers, underscores, and hyphens)');
                            console.log('Please enter a valid name. Only letters, spaces, and hyphens are allowed.');
                            e.preventDefault();
                        } else {
                            setUsernameRequirements('');
                        }
                        setUsername(e.target.value)
                    }}
                    required />
                    <div className='row justify-content-end'> <div className='col-6 ps-5 '>  <div className='row bg-primar justify-content-start ps-3' dangerouslySetInnerHTML={{ __html: usernameRequirements }} /> </div> </div>

            </div>
            <div>
            <label htmlFor="password" className='col-3 form-control-lg'>Password</label>
            <input type='password' id='password' placeholder="Password"
                    value={password}
                    onChange={function(e){
                        const inputValue = e.target.value;
                        setPassword(inputValue);
                        let temp = 'Required';

                        if (!/[A-Z]/.test(inputValue)) {
                            temp += ' A capital (uppercase) letter<br>'; // HTML line break
                        }
                        if (inputValue.length < 8) {
                            temp += ' Minimum 8 characters<br>';
                        }
                        if (!/[a-z]/.test(inputValue)) {
                            temp += ' A lowercase letter<br>';
                        }
                        if (!/[0-9]/.test(inputValue)) {
                            temp += ' A number<br>';
                        }
                        
                        temp === 'Required'? setPasswordRequirements('') : setPasswordRequirements(temp);
                        // console.log('temp:', temp);
                        // setPasswordRequirements( /[0-9]/.test(e.target.value)? '' : 'A number' );
                        // setPasswordRequirements(passwordRequirements + (/[A-Z]/.test(e.target.value)? '' : 'A capital (uppercase) letter')) ;
                        // setPasswordRequirements( passwordRequirements +( (e.target.value.length >= 8)? '' : 'Minimum 8 characters' ) );
                        // setPasswordRequirements( passwordRequirements + ( /[a-z]/.test(e.target.value)? '' : 'A capital (uppercase) letter' ) ) ;

                    }}
                    required />
                    <div className='row justify-content-end'> <div className='col-6 ps-5'>  <div className='row bg-primar justify-content-start ps-3' dangerouslySetInnerHTML={{ __html: passwordRequirements }} /> </div> </div>
                    
            </div>
            <div>
            <button className='btn btn-success' type="submit">Login</button>
            </div>
            </form>
        </div>
        {message && <p>{message}</p>}
    </div>
    </>
}

export {
    LoginPage
}