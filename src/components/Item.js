import React, { useState, useEffect } from 'react';
import { MODELS } from '../constants';


export default function Item({ item, drop, wsUrl, fillEventName, resourceUrl, itemType, payloadType }) {
    const { id, payload, model } = item;
    const promptTemplate = item.prompt_template;
    const [result, setResult] = useState('');

    const [ws, setWs] = useState(null);

    const itemTypeLower = itemType.toLowerCase();
    const itemTypeCamel = itemType.charAt(0).toUpperCase() + itemTypeLower.slice(1);

    const setupWebsocketListeners = () => {
        const socket = new WebSocket(wsUrl);
        socket.addEventListener("message", (event) => {
            setResult(prevResult => prevResult + event.data)
        });
        socket.addEventListener("open", (_) => {
            socket.send(id);
        });
        return socket;
    };

    useEffect(() => {
        if (item.result) {
            setResult(item.result);
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
                model
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
                    <p>Item</p>
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
                        <input type="text" value={MODELS[model]} readOnly style={{ width: 'min-content' }} />
                        <button className='secondary' style={{ width: "auto", height: "auto", align: "center" }} onClick={clickDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}