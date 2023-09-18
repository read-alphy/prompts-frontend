import React, { useState } from 'react';
import { API_BASE } from '../constants';

export function Input() {
    const [payload, setPayload] = useState('');
    const [promptTemplate, setPromptTemplate] = useState('');
    const [parameters, setParameters] = useState('');

    const eventNewCompletion = new CustomEvent('newCompletion');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_BASE}/submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payload, prompt_template: promptTemplate, parameters }),
        });
        const body = await response.text();
        

        // setPayload('');
        // setPromptTemplate('');
        // setParameters('');

        document.dispatchEvent(eventNewCompletion);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{display: 'flex', flexDirection: 'row', flexGrow: 1, gap: '2em', padding: '2em'}}>
            <textarea
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                placeholder="Put the transcript here"
            />
            <textarea
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                placeholder="Prompt template in Jinja2 format" />

            <textarea
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
                placeholder="Parameters in yaml format" />
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: "center"}}>
            <button type="submit" style={{width: 'auto', }}>Submit</button>
            </div>
        </form>
        
    )
}