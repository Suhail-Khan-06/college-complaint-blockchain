import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MyComplaints from './pages/MyComplaints';
import AdminPanel from './pages/AdminPanel';
import { CONTRACT_ADDRESS, RPC_URL, ADMIN_PRIVATE_KEY, STUDENT_PRIVATE_KEY } from './blockchain/contractConfig';
import ContractABI from './blockchain/contractABI.json';
import './index.css';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');

  async function connectAs(selectedRole) {
    try {
      setLoading(true);
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const privateKey = selectedRole === 'admin' ? ADMIN_PRIVATE_KEY : STUDENT_PRIVATE_KEY;
      const wallet = new ethers.Wallet(privateKey, provider);
      const deployedContract = new ethers.Contract(CONTRACT_ADDRESS, ContractABI, wallet);
      const adminAddress = await deployedContract.admin();
      setAccount(wallet.address);
      setContract(deployedContract);
      setIsAdmin(wallet.address.toLowerCase() === adminAddress.toLowerCase());
      setRole(selectedRole);
    } catch (err) {
      console.error('Connection error:', err);
      alert('Make sure Hardhat node is running: npx hardhat node');
    } finally {
      setLoading(false);
    }
  }

  function disconnect() {
    setAccount('');
    setContract(null);
    setIsAdmin(false);
    setRole('');
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar
          account={account}
          isAdmin={isAdmin}
          role={role}
          onConnectAdmin={() => connectAs('admin')}
          onConnectStudent={() => connectAs('student')}
          onDisconnect={disconnect}
          loading={loading}
        />
        <Routes>
          <Route path="/" element={
            <Dashboard
              contract={contract}
              account={account}
              isAdmin={isAdmin}
              onConnectAdmin={() => connectAs('admin')}
              onConnectStudent={() => connectAs('student')}
            />
          } />
          <Route path="/my-complaints" element={
            account ? <MyComplaints contract={contract} account={account} isAdmin={isAdmin} /> : <Navigate to="/" />
          } />
          <Route path="/admin" element={
            isAdmin ? <AdminPanel contract={contract} /> : <Navigate to="/" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
