import React, { useEffect, useState } from 'react';
import { API_BASE } from '../constants';

const transcriptPlaceholder = `Put the transcript here.

If a prompt template is given, this is inserted into the {{ payload }} variable.

If no prompt template is given, this is directly sent to the model.`;

const promptTemplatePlaceholder = `This is a Jinja2 template.

When you put a transcript, it is inserted into the payload variable:

{{ payload }}

You can also use variables:

Hello {{ name }}!`;

const parametersPlaceholder = `# This is a yaml file.

# Parameters are passed to the model AND are used for the processing by the system. They will be used to configure the merge strategy later, for example

name: Egemen
age: 21
`;

export function Input() {
    const [payload, setPayload] = useState('');
    const [promptTemplate, setPromptTemplate] = useState('');
    const [parameters, setParameters] = useState('');
    const [model, setModel] = useState('gpt-3.5-turbo');

    const eventNewCompletion = new CustomEvent('newCompletion');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_BASE}/submissions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payload, template_str: promptTemplate, parameters, model }),
        });
        // const body = await response.text();

        // setPayload('');
        // setPromptTemplate('');
        // setParameters('');

        document.dispatchEvent(eventNewCompletion);
    }

    useEffect(() => {
        const handleFillEvent = (event) => {
            const { payload, promptTemplate, parameters, model } = event.detail;
            setPayload(payload);
            setPromptTemplate(promptTemplate);
            setParameters(parameters);
            setModel(model);
        };
        document.addEventListener('fill', handleFillEvent);
        return () => {
            document.removeEventListener('fill', handleFillEvent);
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
                    placeholder={transcriptPlaceholder}
                />
                <textarea
                    value={promptTemplate}
                    onChange={(e) => setPromptTemplate(e.target.value)}
                    placeholder={promptTemplatePlaceholder} />

                <textarea
                    value={parameters}
                    onChange={(e) => setParameters(e.target.value)}
                    placeholder={parametersPlaceholder} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", gap: "4em", alignItems: "center" }}>
                <fieldset style={{textAlign: "left"}}>
                    <legend><strong>Model</strong></legend>
                    <label for="small">
                        <input type="radio" id="gpt-3.5-turbo" name="model" value="gpt-3.5-turbo" checked={model === "gpt-3.5-turbo"} onChange={handleModelChange} />
                        GPT-3.5 Turbo
                    </label>
                    <label for="medium">
                        <input type="radio" id="gpt-4" name="model" value="gpt-4" checked={model === "gpt-4"} onChange={handleModelChange} />
                        GPT-4
                    </label>
                </fieldset>
                <button type="submit" style={{ width: 'auto', height: 'min-content' }}>Submit</button>
            </div>
        </form>

    )
}