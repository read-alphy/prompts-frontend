import React, { useState, useEffect } from 'react';
import { WS_URL_SUBMISSIONS, API_BASE, MODELS } from '../../constants';


export default function Completion({ completion, drop }) {
    const { id, payload, model } = completion;
    const promptTemplate = completion.prompt_template;
    const [result, setResult] = useState('');

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

    useEffect(() => {
        if (completion.result) {
            setResult(completion.result);
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
            alert('Error deleting completion');
        } else {
            drop()
        }
    }


    return (
        <div className='completion' id={`completion-${id}`}>
            <h3>Completion {id}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', flexGrow: '3 5', gap: '2em', padding: '2em' }}>
                <div style={{ width: '100%' }}>
                    <div className='completion__payload'>
                        <p>Transcript</p>
                        <textarea
                            value={payload}
                            readOnly
                        />
                    </div>
                    <div className='completion__prompt-template'>
                        <p>Prompt Template</p>
                        <textarea
                            value={promptTemplate}
                            readOnly
                        />
                    </div>
                </div>
                <div className='completion__result' style={{ width: '100%' }} >
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