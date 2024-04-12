import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './component/login';
import Registration from './component/signup';
import Dashboard from './component/dashboard';
import UploadResume from './component/uploadResume';
import Homepage from './component/homepage';
import ProfileStatistics from './component/assets/userProfile';
import Profiles from './component/assets/team/team'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path ="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/resumeUpload" element={< UploadResume/>} />
          <Route path="/userProfile" element={< ProfileStatistics/>} />
          <Route path="/team" element={< Profiles/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;