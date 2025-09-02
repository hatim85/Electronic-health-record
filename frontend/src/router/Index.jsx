import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import PrivateRoute from "../pages/Auth/PrivateRoute"; // Make sure you have this component

// Auth
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Common Dashboard / Landing
import Dashboard from "../pages/Dashboard";

// Hospital
import HospitalDashboard from "../pages/Hospital/HospitalDashboard";
import ManageDoctors from "../pages/Hospital/ManageDoctors";
import RegisterDoctor from "../pages/Hospital/RegisterDoctor";
import RegisterPatient from "../pages/Hospital/RegisterPatient";
import RegisterPharmacy from "../pages/Hospital/RegisterPharmacy";
import RegisterDiagnostics from "../pages/Hospital/RegisterDiagnostics";
import RegisterHospital from "../pages/Hospital/RegisterHospital";
import UpdateDoctor from "../pages/Hospital/UpdateDoctor";

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
import MyClaims from "../pages/Patient/MyClaims";

// Diagnostics
import DiagnosticsDashboard from "../pages/Diagnostics/DiagnosticsDashboard";
import UploadReport from "../pages/Diagnostics/UploadReport";
import ViewLabReports from "../pages/Diagnostics/ViewLabReports";
import ViewPatientPrescription from "../pages/Diagnostics/ViewPatientPrescription";

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
import RegisterResearcher from "../pages/Researcher/RegisterResearcher";
import Profile from "../pages/Profile";
import PrescriptionFetcher from "../pages/Pharma/PrescriptionFetcher";

export default function AppRouter() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

            {/* Common Landing / Dashboard */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile/>} />

            {/* Hospital */}
            <Route
              path="/hospital/dashboard"
              element={
                <PrivateRoute user={user} allowedRoles={["superAdmin", "hospital"]}>
                  <HospitalDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospital/manage-doctors"
              element={
                <PrivateRoute user={user} allowedRoles={["superAdmin", "hospital"]}>
                  <ManageDoctors />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospital/register-hospital"
              element={
                <PrivateRoute user={user} allowedRoles={["superAdmin", "hospital"]}>
                  <RegisterHospital />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospital/register-doctor"
              element={
                <PrivateRoute user={user} allowedRoles={["superAdmin", "hospital"]}>
                  <RegisterDoctor />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospital/register-patient"
              element={
                <PrivateRoute user={user} allowedRoles={["superAdmin", "hospital"]}>
                  <RegisterPatient />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospital/register-pharmacy"
              element={
                <PrivateRoute user={user} allowedRoles={["superAdmin", "hospital"]}>
                  <RegisterPharmacy />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospital/register-diagnostics"
              element={
                <PrivateRoute user={user} allowedRoles={["superAdmin", "hospital"]}>
                  <RegisterDiagnostics />
                </PrivateRoute>
              }
            />
            <Route
              path="/hospital/update-doctor"
              element={
                <PrivateRoute user={user} allowedRoles={["superAdmin", "hospital"]}>
                  <UpdateDoctor />
                </PrivateRoute>
              }
            />

            {/* Doctor */}
            <Route
              path="/doctor/dashboard"
              element={
                <PrivateRoute user={user} allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/my-patients"
              element={
                <PrivateRoute user={user} allowedRoles={["doctor"]}>
                  <MyPatients />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/create-record"
              element={
                <PrivateRoute user={user} allowedRoles={["doctor"]}>
                  <CreateRecord />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/update-record"
              element={
                <PrivateRoute user={user} allowedRoles={["doctor"]}>
                  <UpdateRecord />
                </PrivateRoute>
              }
            />

            {/* Patient */}
            <Route
              path="/patient/dashboard"
              element={
                <PrivateRoute user={user} allowedRoles={["patient"]}>
                  <PatientDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/grant-access"
              element={
                <PrivateRoute user={user} allowedRoles={["patient"]}>
                  <GrantAccess />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/history"
              element={
                <PrivateRoute user={user} allowedRoles={["patient"]}>
                  <MyHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/prescriptions"
              element={
                <PrivateRoute user={user} allowedRoles={["patient"]}>
                  <MyPrescriptions />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/reports"
              element={
                <PrivateRoute user={user} allowedRoles={["patient"]}>
                  <MyReports />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/rewards"
              element={
                <PrivateRoute user={user} allowedRoles={["patient"]}>
                  <MyRewards />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/request-claim"
              element={
                <PrivateRoute user={user} allowedRoles={["patient"]}>
                  <RequestClaim />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/view-claims"
              element={
                <PrivateRoute user={user} allowedRoles={["patient"]}>
                  <MyClaims />
                </PrivateRoute>
              }
            />

            {/* Diagnostics */}
            <Route
              path="/diagnostics/dashboard"
              element={
                <PrivateRoute user={user} allowedRoles={["diagnostics"]}>
                  <DiagnosticsDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/diagnostics/upload"
              element={
                <PrivateRoute user={user} allowedRoles={["diagnostics"]}>
                  <UploadReport />
                </PrivateRoute>
              }
            />
            <Route
              path="/diagnostics/view-lab-reports"
              element={
                <PrivateRoute user={user} allowedRoles={["diagnostics"]}>
                  <ViewLabReports />
                </PrivateRoute>
              }
            />
            <Route
              path="/diagnostics/view-patient-prescriptions"
              element={
                <PrivateRoute user={user} allowedRoles={["diagnostics"]}>
                  <ViewPatientPrescription />
                </PrivateRoute>
              }
            />

            {/* Insurance */}
            <Route
              path="/insurance/dashboard"
              element={
                <PrivateRoute user={user} allowedRoles={["insuranceAdmin", "insuranceCompany", "insuranceAgent"]}>
                  <InsuranceDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/insurance/register-agent"
              element={
                <PrivateRoute user={user} allowedRoles={["insuranceAdmin","insuranceCompany"]}>
                  <RegisterAgent />
                </PrivateRoute>
              }
            />
            <Route
              path="/insurance/issue"
              element={
                <PrivateRoute user={user} allowedRoles={["insuranceAdmin","insuranceAgent"]}>
                  <IssueInsurance />
                </PrivateRoute>
              }
            />
            <Route
              path="/insurance/claims"
              element={
                <PrivateRoute user={user} allowedRoles={["insuranceAdmin", "insuranceAgent"]}>
                  <ClaimList />
                </PrivateRoute>
              }
            />
            <Route
              path="/insurance/approve-claim"
              element={
                <PrivateRoute user={user} allowedRoles={["insuranceAdmin,insuranceAgent"]}>
                  <ApproveClaim />
                </PrivateRoute>
              }
            />
            <Route
              path="/insurance/register-company"
              element={
                <PrivateRoute user={user} allowedRoles={["insuranceAdmin"]}>
                  <RegisterInsuranceCompany />
                </PrivateRoute>
              }
            />

            {/* Pharma */}
            <Route
              path="/pharma/dashboard"
              element={
                <PrivateRoute user={user} allowedRoles={["pharmacy"]}>
                  <PharmaDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/pharma/dispense"
              element={
                <PrivateRoute user={user} allowedRoles={["pharmacy"]}>
                  <DispenseMedicine />
                </PrivateRoute>
              }
            />
            <Route
              path="/pharma/update-stock"
              element={
                <PrivateRoute user={user} allowedRoles={["pharmacy"]}>
                  <UpdateStock />
                </PrivateRoute>
              }
            />
            <Route
              path="/pharma/fetch-prescription"
              element={
                <PrivateRoute user={user} allowedRoles={["pharmacy"]}>
                  <PrescriptionFetcher />
                </PrivateRoute>
              }
            />

            {/* Researcher */}
            <Route
              path="/researcher/dashboard"
              element={
                <PrivateRoute user={user} allowedRoles={["researcher", "researchAdmin"]}>
                  <ResearcherDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/researcher/prescriptions"
              element={
                <PrivateRoute user={user} allowedRoles={["researcher", "researchAdmin"]}>
                  <AllPrescriptions />
                </PrivateRoute>
              }
            />
            <Route
              path="/researcher/lab-reports"
              element={
                <PrivateRoute user={user} allowedRoles={["researcher", "researchAdmin"]}>
                  <AllLabReports />
                </PrivateRoute>
              }
            />
            <Route
              path="/researcher/process-data"
              element={
                <PrivateRoute user={user} allowedRoles={["researcher", "researchAdmin"]}>
                  <ProcessData />
                </PrivateRoute>
              }
            />
            <Route
              path="/researcher/register-researcher"
              element={
                <PrivateRoute user={user} allowedRoles={["researchAdmin"]}>
                  <RegisterResearcher />
                </PrivateRoute>
              }
            />
      </Routes>
    </Router>
  );
}
