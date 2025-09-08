# 🏥 EHR: A Blockchain-Based Electronic Health Record Platform

<img width="1440" height="813" alt="ehr2" src="https://github.com/user-attachments/assets/ed8d4621-464d-4c08-86d5-3ef0cd9d15f7" />

EHR is a **decentralized platform** designed to revolutionize the management of **Electronic Health Records (EHR)**.
By leveraging **Hyperledger Fabric**, this project puts patients in control of their own medical data, ensuring **security, transparency, and interoperability** between healthcare stakeholders.

The system uses a **permissioned blockchain** to maintain an immutable log of all health-related transactions, while **large medical files** are stored off-chain using **IPFS** for efficiency.

---

## 🏛️ System Architecture

The platform is built on a **distributed architecture** to ensure **data integrity and decentralization**.

* **Hyperledger Fabric** → Provides a permissioned blockchain network. Manages identities, enforces access control policies, and stores an immutable ledger of transactions.
* **Node.js (Fabric SDK)** → Backend API server that bridges client apps and the Hyperledger Fabric network via RESTful APIs.
* **React.js** → Frontend framework (powered by Vite) for a fast, responsive, and interactive user interface.
* **IPFS (InterPlanetary File System)** → Off-chain storage for large files (lab reports, MRI scans, prescriptions). Only the **IPFS CID** is stored on-chain.
* **Docker** → Containerizes Fabric nodes and the app server for easy setup, deployment, and scalability.

---

## ✨ Core Features

### 👩‍⚕️ For Patients

* **Complete Data Ownership** → View full treatment history, prescriptions, and lab reports.
* **Access Control** → Grant/revoke access for doctors or institutions.
* **Insurance Claims** → Request and track claims directly.
* **Data Monetization** → Earn rewards/tokens for securely sharing anonymized data with researchers.

### 🏥 For Healthcare Providers

* **Doctor Management** → Hospitals can create/manage doctor profiles.
* **Patient Records** → Doctors can update/manage patient health records (with consent).
* **Lab Integration** → Labs receive prescriptions and upload reports directly (via IPFS).
* **Pharma Integration** → Pharmacies view prescriptions, dispense medicine, and manage stock.

### 🏛️ For Institutions

* **Consent-Based Research** → Researchers access anonymized patient data (with explicit consent).
* **Streamlined Claims** → Insurers receive, review, and approve claims transparently.

---

## 🎭 Roles and Permissions

The network is governed by **strict roles and permissions** to ensure secure access.

| **Actor**             | **Organization** | **Key Permissions**                                                                             |
| --------------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| **SuperAdmin**        | Org1             | Manage Org1 policies, onboard hospitals, doctors, patients, diagnostic centers, and pharmacies. |
| **Patient**           | Org1             | Full read/write access to their own records.                                                    |
| **Hospital**          | Org1             | Manage doctor profiles and hospital data.                                                       |
| **Doctor**            | Org1             | Read/write patient data (with consent).                                                         |
| **Diagnostic Center** | Org1             | Read/write diagnostic data.                                                                     |
| **Pharmacy**          | Org1             | Read prescriptions, update medicine stock.                                                      |
| **ResearchAdmin**     | Org2             | Manage Org2, onboard researchers.                                                               |
| **Researcher**        | Org2             | Read-only access (with consent).                                                                |
| **InsuranceAdmin**    | Org2             | Manage Org2, onboard insurers/agents.                                                           |
| **Insurance Company** | Org2             | Manage patient insurance claims.                                                                |
| **InsuranceAgent**    | Org2             | Submit and manage insurance claims.                                                             |

---

## 🚀 Getting Started

### ✅ Prerequisites

Ensure you have installed:

* **Docker & Docker Compose**
* **Node.js (v16.x)**
* **Go (Golang)**
* **Git**

---

### 🔧 Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/hatim85/Electronic-health-record.git
   cd Electronic-health-record
   ```

2. **Download Fabric Binaries & Samples**

   ```bash
   ./install-fabric.sh
   ```

3. **Start the Blockchain Network**

   ```bash
   cd fabric-samples/test-network/
   ./network.sh up createChannel -ca -s couchdb
   ```

   *Note: Use `-ca` for Fabric CAs instead of cryptogen (requires more resources).*

4. **Deploy the Chaincode**

   ```bash
   ./network.sh deployCC -ccn ehrChainCode -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
   ```

5. **Setup Admins & Users**

   ```bash
   cd ../../server-node-sdk/

   # Register Admins
   node cert-script/registerOrg1Admin.js
   node cert-script/registerOrg2Admin.js
   node cert-script/onboardResearchAdmin.js
   ```

6. **Start Backend Server**

   ```bash
   npm install
   npm run dev
   ```

   → Runs at **[http://localhost:3000](http://localhost:3000)**

7. **Start Frontend Application**

   ```bash
   cd ../frontend/
   npm install
   npm run dev
   ```

   → Accessible at **[http://localhost:5173](http://localhost:5173)**

---

## 🔗 API Endpoints

Some key endpoints include:

* `POST /api/v1/hospital/patient` → Register a new patient.
* `POST /api/v1/auth/login` → Authenticate a patient.
* `POST /api/v1/doctor/patientRecord` → Add a medical record.
* `GET /api/v1/patient/history/:userId` → Fetch patient history.
* `POST /api/v1/patient/grantAccess` → Patient grants doctor access.
* `POST /api/v1/patient/requestClaim` → Submit an insurance claim.
* `POST /api/v1/insurance/approveClaim` → Insurer approves a claim.
* and more

---

## 🤝 Contributing

Contributions are welcome! 🎉

1. Fork the project
2. Create your feature branch → `git checkout -b feature/AmazingFeature`
3. Commit changes → `git commit -m 'Add some AmazingFeature'`
4. Push branch → `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
See the [`LICENSE`](LICENSE) file for details.

---