# 🔗 ComplaintChain — Decentralized College Complaint Management System

> A blockchain-powered platform where students raise complaints and authorities manage them transparently on Ethereum.

![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.28-orange)
![React](https://img.shields.io/badge/Frontend-React+Vite-61dafb)
![Hardhat](https://img.shields.io/badge/Dev-Hardhat-yellow)

---

## ✨ Features

- 📝 Students submit complaints (Hostel, Mess, Academics, Infrastructure)
- 🕵️ Optional anonymous submissions
- 🔄 Admin updates complaint status (Pending → In Progress → Resolved)
- 🔐 All records immutably stored on Ethereum blockchain
- 👥 Role-based login (Student / Admin) — no MetaMask required
- 📊 Live dashboard with complaint statistics
- 🎨 Modern dark UI with smooth animations

---

## 🛠️ Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Smart Contract | Solidity 0.8.28                 |
| Blockchain Dev | Hardhat + Hardhat Ignition      |
| Frontend       | React + Vite                    |
| Web3 Library   | Ethers.js v6                    |
| UI Animations  | Framer Motion                   |
| Icons          | Lucide React                    |
| Wallet         | Role-based (no MetaMask needed) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- Git

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/college-complaint-blockchain.git
cd college-complaint-blockchain
```

2. Start local blockchain
   bash
   cd smart-contracts
   npm install
   npx hardhat node

3. Deploy contract (new terminal)
   bash
   cd smart-contracts
   npx hardhat ignition deploy ignition/modules/Deploy.js --network localhost
   Copy the deployed address → paste into frontend/src/blockchain/contractConfig.js

4. Run frontend (new terminal)
   bash
   cd frontend
   npm install
   npm run dev

5. Open browser
   text
   http://localhost:5173

🧪 Test Flow
Action Role How
Submit complaint Student Login as Student → New Complaint
View all complaints Anyone Dashboard
Update status Admin Login as Admin → Admin Panel
View my complaints Student My Complaints page

📁 Project Structure
text
college-complaint-blockchain/
├── smart-contracts/
│ ├── contracts/
│ │ └── ComplaintSystem.sol # Main smart contract
│ ├── ignition/modules/
│ │ └── Deploy.js # Deployment script
│ └── hardhat.config.ts
├── frontend/
│ ├── src/
│ │ ├── components/ # Navbar, ComplaintForm, ComplaintCard
│ │ ├── pages/ # Dashboard, MyComplaints, AdminPanel
│ │ ├── blockchain/ # ABI, config, wallet connection
│ │ └── App.jsx
│ └── package.json
└── docs/
└── screenshots/
🔐 Smart Contract Functions
Function Access Description
submitComplaint() Student Submit new complaint
getAllComplaints() Public View all complaints
getMyComplaints() Student View own complaints
updateComplaintStatus() Admin only Change complaint status
getStats() Public Get dashboard statistics
Made by Suhail | Blockchain Development Project
