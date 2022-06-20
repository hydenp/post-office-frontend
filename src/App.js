import './App.css';
import {useEffect, useState} from 'react'
import jwt_decode from 'jwt-decode'

function App() {

  const [user, setUser] = useState({});

  function handleCallbackResponse(response) {
    console.log(response);
    const decoded = jwt_decode(response.credential);
    console.log(decoded);
    setUser(decoded);
    console.log(user)
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: '414346990222-dgm0rbabpsi9ldrpn3k6fqu2dgj9safb.apps.googleusercontent.com',
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      {theme: 'outline', size: 'large'}
    )
  }, [])


  return (
    <div className="App">
      <div id="signInDiv"></div>
    </div>
  );
}

export default App;
