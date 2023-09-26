import React, { useEffect, useState } from 'react';
import { MODELS } from '../constants';


export function Input({ payloadPlaceholder, promptTemplatePlaceholder, postUrl, fillEventName, createdEventName}) {
    const [payload, setPayload] = useState('');
    const [promptTemplate, setPromptTemplate] = useState('');
    const [model, setModel] = useState('gpt-3.5-turbo');

    const eventNewCompletion = new CustomEvent(createdEventName);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(postUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payload, template_str: promptTemplate, model }),
        });
        // const body = await response.text();

        // setPayload('');
        // setPromptTemplate('');
        // setParameters('');

        document.dispatchEvent(eventNewCompletion);
    }

    useEffect(() => {
        const handleFillEvent = (event) => {
            const { payload, promptTemplate, model } = event.detail;
            setPayload(payload);
            setPromptTemplate(promptTemplate);
            setModel(model);
        };
        document.addEventListener(fillEventName, handleFillEvent);
        return () => {
            document.removeEventListener(fillEventName, handleFillEvent);
        }
    }, []);

    const handleModelChange = (event) => {
        setModel(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='inputTextareaHolder' style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, gap: '2em', padding: '2em' }}>
                <textarea
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    placeholder={payloadPlaceholder}
                />
                <textarea
                    value={promptTemplate}
                    onChange={(e) => setPromptTemplate(e.target.value)}
                    placeholder={promptTemplatePlaceholder} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", gap: "4em", alignItems: "center" }}>
                <fieldset style={{ textAlign: "left" }}>
                    <legend><strong>Model</strong></legend>
                    {
                        Object.keys(MODELS).map((key) => {
                            return (
                                <label htmlFor={key} key={key}>
                                    <input type="radio" id={key} name="model" value={key} checked={model === key} onChange={handleModelChange} />
                                    {MODELS[key]}
                                </label>
                            )
                        })
                    }
                </fieldset>
                <button type="submit" style={{ width: 'auto', height: 'min-content' }}>Submit</button>
            </div>
        </form>

    )
}