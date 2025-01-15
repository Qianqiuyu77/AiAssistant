import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/home';
import Login from './pages/Login/login';

function App() {

  return (
    <Router>
      <div>

        {/* 路由配置 */}
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App
