import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import SessionDetails from "@/pages/SessionDetails";
import SessionHistory from "@/pages/SessionHistory";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/session/:sessionId" element={<SessionDetails />} />
        <Route path="/history" element={<SessionHistory />} />
      </Routes>
    </Layout>
  );
}

export default App;
