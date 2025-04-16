import './App.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/home';
import Login from './pages/Login/login';
import Admin from './pages/Admin/admin';
import RequireAuth from './component/requireAuth';

function App() {

  return (
    <Router>
      <div>

        {/* 路由配置 */}
        <Routes>
          <Route
            path="/Home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/Admin"
            element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            }
          />
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App
