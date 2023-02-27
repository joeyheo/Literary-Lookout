import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

//Pages & Component Imports
import Home from "./components/home";
import NotFound from "./components/404";
import Navbar from "./components/navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/">
          <Route path="" element={<Navigate to="home" />} />
          {/*<Route path="landing" element={<Landing />}/>*/}
          <Route path="home" element={<Home />} />
          <Route path="404" element={<NotFound />} />
        </Route>
        <Route path="*" element={<Navigate to="404" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
