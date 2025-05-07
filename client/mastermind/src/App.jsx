import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import ChallengeDetails from "./pages/ChallengeDetails";
import CreateChallenge from "./pages/CreateChallenge";
import EditChallenge from "./pages/EditChallenge";
import NotFound from "./pages/NotFound";
import { Container } from "react-bootstrap";

function App() {
  return (
    <>
      <Header />
      <Container className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/challenges/create" element={<CreateChallenge />} />
          <Route path="/challenges/:id" element={<ChallengeDetails />} />
          <Route path="/challenges/:id/edit" element={<EditChallenge />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;
