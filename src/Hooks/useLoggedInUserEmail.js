import { useState } from 'react';

const useLoggedInUserEmail = () => {
  const [loggedInUserEmail, setLoggedInUserEmail] = useState('');

  const setLoggedInEmail = (email) => {
    setLoggedInUserEmail(email);
  };

  return [loggedInUserEmail, setLoggedInEmail];
};

export default useLoggedInUserEmail;
