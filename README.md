# Smart Contract-Based Decentralized College Complaint Management System

A decentralized platform where students can raise complaints and college
authorities can manage them transparently using Ethereum smart contracts.

## Features

- Students submit complaints (hostel, mess, academics, infrastructure)
- Optional anonymous complaint submission
- Admin updates complaint status (Pending → In Progress → Resolved)
- All complaints immutably recorded on blockchain
- Role-based access (student/admin)
- React frontend with MetaMask wallet integration

## Tech Stack

- **Solidity** (smart contracts)
- **Remix IDE** (compile/deploy)
- **React + Vite + Ethers.js** (frontend)
- **MetaMask** (wallet)
- **Ethereum** (Remix VM / Sepolia Testnet)

## Quick Start

### 1. Deploy Smart Contracts (Remix)

- Go to https://remix.ethereum.org
- Copy ComplaintSystem.sol → contracts/
- Compile with Solidity 0.8.20
- Deploy using Remix VM (London)
- Copy deployed contract address

### 2. Run Frontend

cd frontend
npm install
npm run dev

### 3. Test Flow

- Student: submitComplaint("Hostel Water Issue", "No water supply", 0, false)
- Admin: updateComplaintStatus(0, 1) → In Progress
- Admin: updateComplaintStatus(0, 2) → Resolved
- Anyone: getAllComplaints()
- Student: getMyComplaints()

## Folder Structure

college-complaint-blockchain/
├── smart-contracts/
│ ├── contracts/ # ComplaintSystem.sol
│ ├── scripts/ # deploy.js
│ └── tests/ # complaint.test.js
├── frontend/
│ ├── src/
│ │ ├── components/ # Navbar, ComplaintForm, ComplaintCard, WalletConnect
│ │ ├── pages/ # Dashboard, MyComplaints, AdminPanel
│ │ ├── blockchain/ # contractABI.js, connectWallet.js, contractConfig.js
│ │ └── styles/ # main.css
│ └── package.json
└── docs/ # Architecture, screenshots

## Next Phase

**Phase 2**: Write `ComplaintSystem.sol` in Remix and test all functions.

---

**Made by Suhail | Blockchain Course Project**
