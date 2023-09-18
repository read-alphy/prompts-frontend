import './pico.min.css'
import './App.css';
import {Input} from './components/Input';
import {SubmissionList} from './components/SubmissionList';

function App() {
  return (
    <div className="App">
      <Input />
      <br />
      <SubmissionList />
    </div>
  );
}

export default App;
