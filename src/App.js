import './App.css';

import GoogleOauth from './components/GoogleAuth'
import FileUpload from './components/FileUpload';
import {useState} from "react";

function App() {

  const [data, setData] = useState({})

  function handleUpload(data) {
    setData(data)
  }

  function printData() {
    console.log(data);
  }

  return (
    <div className="App">
      <div style={{
        width: '70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <h1>PostOffice</h1>

        {/* Component to handle file upload*/}
        <FileUpload handleUpload={handleUpload}/>

        <div>
          <h2>View your Data</h2>
          <button onClick={printData}>Print Data in Parent</button>
        </div>

        {/* Component to start google oauth flow, store it in state variable and print token */}
        <div>
          <h2>Give Google the Keys</h2>
          <GoogleOauth/>
        </div>
      </div>
    </div>
  );
}

export default App;
