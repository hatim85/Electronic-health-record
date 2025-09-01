import { useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./router/Index";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

export default App;