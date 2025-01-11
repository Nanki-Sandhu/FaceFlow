
import './App.css';
import{Route, Routes,BrowserRouter as Router} from "react-router-dom";
import LandingPage from "./pages/landing.jsx";
import AuthenticationPage from "./pages/authentication.jsx";
import VideoMeetPage from "./pages/videoMeet.jsx";
import HomePage from './pages/home.jsx';
import HistoryPage from './pages/history.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';


function App() {
  return (
   <div className="App">
    <Router>
      <AuthProvider>
      <Routes>
        <Route path='/' element={<LandingPage />}></Route>
        <Route path='/auth' element={<AuthenticationPage />}></Route>
        <Route path='/home' element={< HomePage/>}></Route>
        <Route path='/history' element={< HistoryPage/>}></Route>
        <Route path="/home/:url" element={<VideoMeetPage />}></Route>
        </Routes>
        </AuthProvider>
    </Router>
   </div>
  );
}

export default App;
