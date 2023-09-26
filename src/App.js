import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './routes/HomePage';
import Chapterization from './routes/Chapterization';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapter" element={<Chapterization />}  />
      </Routes>
    
    </div>
  );
}

export default App;
