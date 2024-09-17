import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Home from "./components/Home/Home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
