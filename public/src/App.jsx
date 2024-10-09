import { Routes, Route } from "react-router-dom";
import Login from  "./pages/Login";
import Register from "./pages/Register";
import SetAvatar from "./pages/SetAvatar";
import Chat from "./pages/Chat";
function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
      </Routes>
  );
}

export default App;
