import React, { useState, useEffect } from 'react';
import { WS_URL_SUBMISSIONS, API_BASE, MODELS } from '../constants';


export default function Submission({ submission, drop }) {
    const { id, payload, model } = submission;
    const promptTemplate = submission.prompt_template;
    const [result, setResult] = useState('');

    // const [payload, setPayload] = useState('');
    // const [promptTemplate, setPromptTemplate] = useState('');
    // const [parameters, setParameters] = useState('');
    // const [result, setResult] = useState('');
    // const [model, setModel] = useState('');

    const [ws, setWs] = useState(null);


    const setupWebsocketListeners = () => {
        const socket = new WebSocket(WS_URL_SUBMISSIONS);
        socket.addEventListener("message", (event) => {
            setResult(prevResult => prevResult + event.data)
        });
        socket.addEventListener("open", (_) => {
            socket.send(id);
        });
        return socket;
    };

    // const getSubmission = async (data) => {
    //     const response = await fetch(`${API_BASE}/submissions/${id}`);
    //     const body = await response.json();
    //     setPayload(body.payload);
    //     setPromptTemplate(body.prompt_template);
    //     setParameters(body.parameters);
    //     setModel(body.model);

    //     if (body.result) {
    //         setResult(body.result);
    //     } else {
    //         const socket = setupWebsocketListeners();
    //         setWs(socket);
    //     }
    // };

    useEffect(() => {
        // getSubmission();
        if (submission.result) {
            setResult(submission.result);
        } else {
            const socket = setupWebsocketListeners();
            setWs(socket);
        }
        
        return () => {
            if (ws) {
                ws.close();
                setWs(null)
            }
        }
    }, [id]);

    const clickFill = () => {
        const eventFill = new CustomEvent('fill', {
            detail: {
                payload,
                promptTemplate,
                model
            }
        });
        document.dispatchEvent(eventFill);
    }


    const clickDelete = async () => {
        const resp = await fetch(`${API_BASE}/completions/${id}`, {
            method: 'DELETE',
        });
        if (resp.status !== 200) {
            alert('Error deleting submission');
        } else {
            drop()
        }
    }


    return (
        <div className='submission' id={`submission-${id}`}>
            <h3>Submission {id}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', flexGrow: '3 5', gap: '2em', padding: '2em' }}>
                <div style={{ width: '100%' }}>
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
                </div>
                <div className='submission__result' style={{ width: '100%' }} >
                    <p>Result</p>
                    <textarea
                        value={result}
                        readOnly
                        style={
                            // fill parent vertically but do not overflow
                            { height: '30em' }
                        }
                    />
                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <button className='contrast' style={{ width: "4em", height: "auto", align: "center" }} onClick={clickFill}>Fill</button>
                        <input type="text" value={MODELS[model]} readonly style={{ width: 'min-content' }} />
                        <button className='secondary' style={{ width: "auto", height: "auto", align: "center" }} onClick={clickDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}