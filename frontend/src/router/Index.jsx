import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

// Doctor
import DoctorDashboard from "../pages/Doctor/DoctorDashboard";
import CreateRecord from "../pages/Doctor/CreateRecord";
import UpdateRecord from "../pages/Doctor/UpdateRecord";
import MyPatients from "../pages/Doctor/MyPatients";

// Patient
import PatientDashboard from "../pages/Patient/PatientDashboard";
import GrantAccess from "../pages/Patient/GrantAccess";
import MyHistory from "../pages/Patient/MyHistory";
import MyPrescriptions from "../pages/Patient/MyPrescriptions";
import MyReports from "../pages/Patient/MyReports";
import MyRewards from "../pages/Patient/MyRewards";
import RequestClaim from "../pages/Patient/RequestClaim";

// Diagnostics
import DiagnosticsDashboard from "../pages/Diagnostics/DiagnosticsDashboard";
import UploadReport from "../pages/Diagnostics/UploadReport";
import ViewLabReports from "../pages/Diagnostics/ViewLabReports";

// Insurance
import InsuranceDashboard from "../pages/Insurance/InsuranceDashboard";
import RegisterAgent from "../pages/Insurance/RegisterAgent";
import IssueInsurance from "../pages/Insurance/IssueInsurance";
import ClaimList from "../pages/Insurance/ClaimList";
import ApproveClaim from "../pages/Insurance/ApproveClaim";
import RegisterInsuranceCompany from "../pages/Insurance/RegisterInsuranceCompany";

// Pharma
import PharmaDashboard from "../pages/Pharma/PharmaDashboard";
import DispenseMedicine from "../pages/Pharma/DispenseMedicine";
import UpdateStock from "../pages/Pharma/UpdateStock";

// Researcher
import ResearcherDashboard from "../pages/Researcher/ResearcherDashboard";
import AllPrescriptions from "../pages/Researcher/AllPrescriptions";
import AllLabReports from "../pages/Researcher/AllLabReports";
import ProcessData from "../pages/Researcher/ProcessData";

// Auth
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import HospitalDashboard from "../pages/Hospital/HospitalDashboard";
import ManageDoctors from "../pages/Hospital/ManageDoctors";
import RegisterDoctor from "../pages/Hospital/RegisterDoctor";
import RegisterPatient from "../pages/Hospital/RegisterPatient";
import RegisterPharmacy from "../pages/Hospital/RegisterPharmacy";
import RegisterDiagnostics from "../pages/Hospital/RegisterDiagnostics";
import RegisterHospital from "../pages/Hospital/RegisterHospital";
import RegisterResearcher from "../pages/Researcher/RegisterResearcher";
import UpdateDoctor from "../pages/Hospital/UpdateDoctor";
import ViewPatientPrescription from "../pages/Diagnostics/ViewPatientPrescription";
import MyClaims from "../pages/Patient/MyClaims";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Common Dashboard */}
        <Route path="/" element={<Dashboard />} />

        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/manage-doctors" element={<ManageDoctors />} />
        <Route path="/hospital/register-hospital" element={<RegisterHospital />} />
        <Route path="/hospital/register-doctor" element={<RegisterDoctor />} />
        <Route path="/hospital/register-patient" element={<RegisterPatient />} />
        <Route path="/hospital/register-pharmacy" element={<RegisterPharmacy />} />
        <Route path="/hospital/register-diagnostics" element={<RegisterDiagnostics />} />
        <Route path="/hospital/update-doctor" element={<UpdateDoctor />} />

        {/* Doctor */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/my-patients" element={<MyPatients />} />
        <Route path="/doctor/create-record" element={<CreateRecord />} />
        <Route path="/doctor/update-record" element={<UpdateRecord />} />

        {/* Patient */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/grant-access" element={<GrantAccess />} />
        <Route path="/patient/history" element={<MyHistory />} />
        <Route path="/patient/prescriptions" element={<MyPrescriptions />} />
        <Route path="/patient/reports" element={<MyReports />} />
        <Route path="/patient/rewards" element={<MyRewards />} />
        <Route path="/patient/request-claim" element={<RequestClaim />} />
        <Route path="/patient/view-claims" element={<MyClaims />} />

        {/* Diagnostics */}
        <Route path="/diagnostics/dashboard" element={<DiagnosticsDashboard />} />
        <Route path="/diagnostics/upload" element={<UploadReport />} />
        <Route path="/diagnostics/view-lab-reports" element={<ViewLabReports />} />
        <Route path="/diagnostics/view-patient-prescriptions" element={<ViewPatientPrescription />} />

        {/* Insurance */}
        <Route path="/insurance/dashboard" element={<InsuranceDashboard />} />
        <Route path="/insurance/register-agent" element={<RegisterAgent />} />
        <Route path="/insurance/issue" element={<IssueInsurance />} />
        <Route path="/insurance/claims" element={<ClaimList />} />
        <Route path="/insurance/approve-claim" element={<ApproveClaim />} />
        <Route path="/insurance/register-company" element={<RegisterInsuranceCompany />} />

        {/* Pharma */}
        <Route path="/pharma/dashboard" element={<PharmaDashboard />} />
        <Route path="/pharma/dispense" element={<DispenseMedicine />} />
        <Route path="/pharma/update-stock" element={<UpdateStock />} />

        {/* Researcher */}
        <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />
        <Route path="/researcher/prescriptions" element={<AllPrescriptions />} />
        <Route path="/researcher/lab-reports" element={<AllLabReports />} />
        <Route path="/researcher/process-data" element={<ProcessData />} />
        <Route path="/researcher/register-researcher" element={<RegisterResearcher />} />
      </Routes>
    </Router>
  );
}
