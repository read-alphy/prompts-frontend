import { Routes, Route} from 'react-router-dom';
import './App.css';
import { API_BASE, WS_PREFIX } from './constants';
import { Input } from './components/Input';
import { List } from './components/List';


const promptTemplatePlaceholder = `This is a Jinja2 template.

When you put a transcript, it is inserted into the payload variable:

{{ payload }}

You can also use variables:

Hello {{ name }}!`;


function LandingPage() {
  return (
    <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', paddingTop: '30vh' }}>
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

  const transcriptPlaceholder = `Put the transcript here.

If a prompt template is given, this is inserted into the {{ payload }} variable.

If no prompt template is given, this is directly sent to the model.`;


  return (
    <div>
      <h2>Completions</h2>
      <Input 
        promptTemplatePlaceholder={promptTemplatePlaceholder} 
        payloadPlaceholder={transcriptPlaceholder} 
        postUrl={`${API_BASE}/completions`} 
        fillEventName='fillCompletion'
        createdEventName='newCompletion'
      />
      <br />
      <List 
        resourceUrl={`${API_BASE}/completions`}
        createdEventName={'newCompletion'}
        fillEventName={'fillCompletion'}
        wsUrl={`${WS_PREFIX}/completions/ws`}
        itemType={'Completion'}
        payloadType={'Payload'}
      />
      {/* <CompletionList /> */}
    </div>
  );
}


function App() {
  return (
    <div className="App" style={{ height: '100vh' }}>
      <nav style={{ paddingTop: "1em", paddingBottom: "1em", paddingLeft: "3em", paddingRight: "3em" }}>
        <ul>
          <li><a href="/"><strong>Prompts</strong></a></li>
        </ul>
        <ul>
          <li><a href="/completions">Completions</a></li>
          <li><a href="/chapters">Chapters</a></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/completions" element={<CompletionPage />} />
        <Route path="/chapters" element={<ChapterPage />} />
      </Routes>
    </div>
  );
}

export default App;
