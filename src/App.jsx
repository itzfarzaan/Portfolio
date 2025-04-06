import './App.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar.jsx';
import LandingPage from './landingpage.jsx';
import Footer from './Footer.jsx';
import Projects from './Projects.jsx';
import Blog from './Blog.jsx';
import Login from './Login.jsx';
import Admin from './Admin.jsx';
import SpecificBlog from './SpecificBlog.jsx';
import EditBlog from './EditBlog.jsx';
import SpecificProject from './SpecificProject.jsx';
import EditProject from './EditProject.jsx';

function App() {

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage/>}></Route>
            <Route path="/projects" element={<Projects/>}></Route>
            <Route path="/blog" element={<Blog/>}></Route>
            <Route path="/blog/:id" element={<SpecificBlog />}></Route>
            <Route path="/projects/:id" element={<SpecificProject />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/admin" element={<Admin />}></Route>
            <Route path="/admin/edit/:blogId" element={<EditBlog />}></Route>
            <Route path="/admin/edit-project/:projectId" element={<EditProject />}></Route>
          </Routes>
          <Footer />
        </Router>
      </div>
    </div>
  )
}

export default App
