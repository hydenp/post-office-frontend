import './App.css';

import GoogleOauth from './components/GoogleAuth'

function App() {

  return (
    <div className="App">

      {/* Component to start google oauth flow, store it in state variable and print token */}
      <GoogleOauth/>
    </div>
  );
}

export default App;
