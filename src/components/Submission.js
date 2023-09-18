import React, { useState, useEffect } from 'react';
import {WS_URL, API_BASE} from '../constants';


export default function Submission({ id }) {
    const [payload, setPayload] = useState('');
    const [promptTemplate, setPromptTemplate] = useState('');
    const [parameters, setParameters] = useState('');
    const [result, setResult] = useState('');

    const [ws, setWs] = useState(null);
    

    const setupWebsocketListeners = () => {
        const socket = new WebSocket(WS_URL);
        socket.addEventListener("message", (event) => {
            setResult(prevResult => prevResult + event.data)
        });
        socket.addEventListener("open", (_) => {
            socket.send(id);
        });
        return socket;
    };

    const getSubmission = async (data) => {
        const response = await fetch(`${API_BASE}/submissions/${id}`);
        const body = await response.json();
        setPayload(body.payload);
        setPromptTemplate(body.prompt_template);
        setParameters(body.parameters);

        if (body.result) {
            setResult(body.result);
        } else {
            const socket = setupWebsocketListeners();
            setWs(socket);
        }
    };

    useEffect(() => {
        
        
        getSubmission();
        return () => {
            if (ws) {
                ws.close();
                setWs(null)
            }
        }
    }, [id]);

    return (
        <div className='submission' id={`submission-${id}`}>
            <h3>Submission {id}</h3>
            <div style={{display: 'flex', justifyContent: 'space-evenly', flexGrow: '3 5', gap: '2em', padding: '2em'}}>
                <div style={{width: '100%'}}>
                    <div className='submission__payload'>
                        <p>Transcript</p>
                        <textarea
                            value={payload}
                            readOnly
                        />
                    </div>
                    <div className='submission__prompt-template'>
                        <p>Prompt Template</p>
                        <textarea
                            value={promptTemplate}
                            readOnly
                        />
                    </div>
                    <div className='submission__parameters'>
                        <p>Parameters</p>
                        <textarea
                            value={parameters}
                            readOnly
                        />
                    </div>
                </div>
                <div className='submission__result' style={{width: '100%'}} >
                    <p>Result</p>
                    <textarea
                        value={result}
                        readOnly
                        style={
                            // fill parent vertically but do not overflow
                            {height: '30em'}
                        }
                    />
                </div>
            </div>
        </div>
    )
}