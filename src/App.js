import './App.css';
import {CompletionInput} from './components/completions/CompletionInput';
import {CompletionList} from './components/completions/CompletionList';

function App() {
  return (
    <div className="App">
      <CompletionInput />
      <br />
      <CompletionList />
    </div>
  );
}

export default App;
