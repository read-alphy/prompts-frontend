import React, { useState, useEffect } from 'react';
import { MODELS, SUBMISSION_TYPES, WS_PREFIX, subTypeLabel, subTypeSingular } from '../constants';

const completionsListenerDelta = (event, prevResult) => {
    return prevResult + event.data;
}

const chaptersDisplayChapters = (chaptersJson) => {
    if (!chaptersJson) {
        return '';
    }
    console.log("chaptersJson: ", chaptersJson)
    const chapters = JSON.parse(chaptersJson);
    return chapters.map((chapter) => `${chapter.index + 1}  -  ${chapter.timestamp}\n${chapter.title}`).join('\n\n');
}

const chaptersListenerDelta = (event, prevResult) => {
    // console.log("event.data: ", event.data)
    const formattedChunk = chaptersDisplayChapters(event.data)
    // console.log("lines: ", lines)
    return prevResult + formattedChunk + '\n\n';
}

export default function Item({ item, drop, fillEventName, resourceUrl, itemType, payloadType }) {
    const { id, payload, model } = item;
    const promptTemplate = item.prompt_template;
    const subType = item.sub_type + 's';
    const [result, setResult] = useState('');
    const [wsCloseReason, setWsCloseReason] = useState(null);
    const [pretty, setPretty] = useState(true); 

    const [ws, setWs] = useState(null);

    const itemTypeLower = itemType.toLowerCase();
    const itemTypeCamel = itemType.charAt(0).toUpperCase() + itemTypeLower.slice(1);

    const setupWebsocketListeners = () => {
        let wsUrl
        if (subType === 'completions') {
            wsUrl = `${WS_PREFIX}/submissions/ws/completions`;
        } else if (subType === 'chapters') {
            wsUrl = `${WS_PREFIX}/submissions/ws/chapters`;
        } else {
            alert(`Unknown submission type ${subType}, for item ${JSON.stringify(item)}`);
        }
        const socket = new WebSocket(wsUrl);
        socket.addEventListener("message", (event) => {
            if (subType === 'completions') {
                setResult(prevResult => completionsListenerDelta(event, prevResult));
            } else if (subType === 'chapters') {
                setResult(prevResult => chaptersListenerDelta(event, prevResult));
            } else {
            alert(`Unknown submission type ${subType}, for item ${JSON.stringify(item)}`);
            }
        });
        socket.addEventListener("open", (_) => {
            socket.send(id);
        });
        socket.addEventListener("close", (event) => {
            if (event.reason) {
                setWsCloseReason(event.reason);
            }
        })
        return socket;
    };

    useEffect(() => {
        if (item.result) {
            // console.log("item: ", item, "subType: ", subType)
            setResult(item.result);
            // console.log("result: ", item.result)
            // if (subType === 'chapters') {
            //     const res = chaptersDisplayChapters(item.result)
            //     setResult(res);
            // } else {
            //     setResult(item.result);
            // }
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
        const eventFill = new CustomEvent(fillEventName, {
            detail: {
                payload,
                promptTemplate,
                model,
                subType,
            }
        });
        document.dispatchEvent(eventFill);
    }

    const clickDelete = async () => {
        const resp = await fetch(`${resourceUrl}/${id}`, {
            method: 'DELETE',
        });
        if (resp.status !== 200) {
            alert('Error deleting item');
        } else {
            drop()
        }
    }

    const prettifyChange = (event) => {
        if (event.target.checked) {
            setPretty(true)
        } else {
            setPretty(false)
        }
    }

    return (
        <div className={itemTypeLower} id={`${itemTypeLower}-${id}`}>
            <h3>{itemTypeCamel} {id}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', flexGrow: '3 5', gap: '2em', padding: '2em' }}>
                <div style={{ width: '100%' }}>
                    <div className={`${itemTypeLower}__payload`}>
                        <p>{payloadType}</p>
                        <textarea
                            value={payload}
                            readOnly
                        />
                    </div>
                    <div className={`${itemTypeLower}__prompt-template`}>
                        <p>Prompt Template</p>
                        <textarea
                            value={promptTemplate}
                            readOnly
                        />
                    </div>
                </div>
                <div className={`${itemTypeLower}__result`} style={{ width: '100%' }} >
                    <p>{itemTypeCamel}</p>
                    <textarea
                        value={subType==='chapters' && pretty ? chaptersDisplayChapters(result) : result}
                        readOnly
                        style={
                            // fill parent vertically but do not overflow
                            { height: '30em' }
                        }
                    />

                    {subType === 'chapters' && 
                        <fieldset>
                            <input type="checkbox" id={`chapter_prettify-${id}`} name="chapter_prettify" checked={pretty} onChange={prettifyChange} />
                            Prettify?
                        </fieldset>}
                    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                        <button className='contrast' style={{ width: "4em", height: "auto", align: "center" }} onClick={clickFill}>Fill</button>
                        <input type="text" value={SUBMISSION_TYPES[subType].label} readOnly style={{ width: 'min-content' }} />
                        <input type="text" value={MODELS[model]} readOnly style={{ width: 'min-content' }} />
                        <button className='secondary' style={{ width: "auto", height: "auto", align: "center" }} onClick={clickDelete}>Delete</button>
                    </div>
                    {wsCloseReason && <p>{wsCloseReason}</p>}
                </div>
            </div>
        </div>
    )
}