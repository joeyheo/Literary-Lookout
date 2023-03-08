import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

//Pages & Component Imports
import Home from "./components/home";
import NotFound from "./components/404";
import Navbar from "./components/navbar";
import ReviewWall from "./components/community/reviewwall";
import CommunityWall from "./components/community/communitywall";
import Suggestion from "./components/suggestion/suggestion";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/reviewwall" element={<ReviewWall />} />
        <Route path="/communitywall" element={<CommunityWall />} />
        <Route path="/suggestion" element={<Suggestion />} />
        <Route path="*" element={<Navigate to="404" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
