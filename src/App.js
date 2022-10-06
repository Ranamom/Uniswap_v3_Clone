import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers';
import { address0, address1 } from './AlphaRouterService'
import ERC20ABI from './abi.json'
import Navbar from './components/Navbar';
import Body from './components/Body';
import UserState from './components/context/userState';

function App() {
  const REACT_APP_ALCHEMY_URL_TEST = process.env.REACT_APP_ALCHEMY_URL_TEST
  const Web3Provider = new ethers.providers.JsonRpcProvider(REACT_APP_ALCHEMY_URL_TEST)
  const wethContract = new ethers.Contract(address0, ERC20ABI, Web3Provider)
  const uniContract = new ethers.Contract(address1, ERC20ABI, Web3Provider)
  const [signerAddress, setSignerAddress] = useState(undefined)

  const getWalletAddress = async () => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(res => {
        setSignerAddress(res[0])
      })
    const providerInstance = new ethers.providers.JsonRpcProvider(window.ethereum)
    const signerInstance = providerInstance.getSigner()
    setSignerAddress(signerInstance.getAddress())
    console.log(signerAddress)
  }

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
