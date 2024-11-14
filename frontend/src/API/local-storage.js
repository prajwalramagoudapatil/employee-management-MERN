import React, { useState, useEffect } from 'react';

const UserComponent = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch user data (for example, from your API)
    const user = 'exampleUser'; // Replace with actual user data fetching logic

    // Store the username in local storage
    localStorage.setItem('username', user);
  }, []);

  useEffect(() => {
    // Retrieve the username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div>
      <h1>Welcome, {username}</h1>
    </div>
  );
};

export default UserComponent;
