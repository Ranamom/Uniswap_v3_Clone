import './App.css';
// import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import Body from './components/Body';
import UserState from './components/context/userState';

function App() {
  // const REACT_APP_ALCHEMY_URL_TEST = process.env.REACT_APP_ALCHEMY_URL_TEST
  // const Web3Provider = new ethers.providers.JsonRpcProvider(REACT_APP_ALCHEMY_URL_TEST)

  return (
    <UserState>
      <div className="App">
        <Navbar />
        <Body />
      </div>
    </UserState>
  );
}

export default App
