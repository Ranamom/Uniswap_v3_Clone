import './App.css';
import Navbar from './components/Navbar';
import Body from './components/Body';
import UserState from './components/context/userState';
import TokenChangeModal from './components/TokenChangeModal';

function App() {

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
