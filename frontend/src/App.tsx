import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import ProgramsPage from "./pages/ProgramsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/programs" replace />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:id" element={<ProgramDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
