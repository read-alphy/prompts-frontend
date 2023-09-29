import './App.css';
import { API_BASE } from './constants';
import { Input } from './components/Input';
import { List } from './components/List';


const promptTemplatePlaceholder = `This is a Jinja2 template.

When you put a transcript, it is inserted into the payload variable:

{{ payload }}`;


// function LandingPage() {
//   return (
//     <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', paddingTop: '30vh' }}>
//       <h2>Welcome</h2>
//     </div>
//   );
// }

// function CompletionPage() {
//   const payloadPlaceholder = `Put your payload here.

// If a prompt template is given, this is inserted into the {{ payload }} variable.

// If no prompt template is given, this is directly sent to the model.`;

//   return (
//     <div>
//       <h2>Completions</h2>
//       <Input 
//         promptTemplatePlaceholder={promptTemplatePlaceholder} 
//         payloadPlaceholder={payloadPlaceholder} 
//         postUrl={`${API_BASE}/completions`} 
//         fillEventName='fillCompletion'
//         createdEventName='newCompletion'
//       />
//       <br />
//       <List 
//         resourceUrl={`${API_BASE}/completions`}
//         createdEventName={'newCompletion'}
//         fillEventName={'fillCompletion'}
//         wsUrl={`${WS_PREFIX}/completions/ws`}
//         itemType={'Completion'}
//         payloadType={'Payload'}
//       />
//     </div>
//   );
// }

function SubmissionPage() {
  const transcriptPlaceholder = `Put your payload or the transcript here.

If a prompt template is given, this is inserted into the {{ payload }} variable.

If no prompt template is given, this is directly sent to the model.`;

  return (
    <div>
      <h2>Submissions</h2>
      <Input 
        promptTemplatePlaceholder={promptTemplatePlaceholder} 
        payloadPlaceholder={transcriptPlaceholder} 
        postUrl={`${API_BASE}/submissions`} 
        fillEventName='fillSubmission'
        createdEventName='newSubmission'
      />
      <br />
      <List 
        resourceUrl={`${API_BASE}/submissions`}
        createdEventName={'newSubmission'}
        fillEventName={'fillSubmission'}
        itemType={'Submission'}
        payloadType={'Payload or Transcript'}
      />
    </div>
  );
}


function App() {
  return (
    <div className="App" style={{ height: '100vh' }}>
      {/* <nav style={{ paddingTop: "1em", paddingBottom: "1em", paddingLeft: "3em", paddingRight: "3em" }}>
        <ul>
          <li><a href="/"><strong>Prompts</strong></a></li>
        </ul>
        <ul>
          <li><a href="/submissions">Submissions</a></li>
        </ul>
      </nav> */}
    
    <SubmissionPage />

      {/* <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submissions" element={<SubmissionPage />} />
      </Routes> */}
    </div>
  );
}

export default App;
