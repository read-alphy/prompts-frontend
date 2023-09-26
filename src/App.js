import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import {CompletionInput} from './components/completions/CompletionInput';
import {CompletionList} from './components/completions/CompletionList';

function LandingPage() {
  return (
    <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', paddingTop: '30vh'}}>
      <h2>Welcome</h2>
    </div>
  );
}

function ChapterPage() {
  return (
    <div>
      <h2>Chapter List</h2>
    </div>
  );
}

function CompletionPage() {
  return (
    <div>
      <h2>Completions</h2>
      <CompletionInput />
      <br />
      <CompletionList />
    </div>
  );
}


function App() {
  return (
    <div className="App" style={{height: '100vh'}}>
      <nav style={{paddingTop: "1em", paddingBottom: "1em", paddingLeft: "3em", paddingRight: "3em"}}>
        <ul>
          <li><a href="/"><strong>Prompts</strong></a></li>
        </ul>
        <ul>
          <li><a href="/completions">Completions</a></li>
          <li><a href="/chapters">Chapters</a></li>
        </ul>
      </nav>  
    
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/completions" element={<CompletionPage />} />
        <Route path="/chapters" element={<ChapterPage />} />
      </Routes>
    </div>
  );
}

export default App;
