
import Item from './Item';
import React, { useState, useEffect } from 'react';

export function List({ resourceUrl, createdEventName, wsUrl, fillEventName, itemType, payloadType }) {
    const [items, setItems] = useState([]);
    
    const getItems = async () => {
        const response = await fetch(`${resourceUrl}?limit=10`); 
        let body = await response.json();
        setItems(body);
    };

    useEffect(() => {
        getItems();

        const handleNewItem = () => {
            getItems();
        };
        document.addEventListener(createdEventName, handleNewItem);
        return () => {
            document.removeEventListener(createdEventName, handleNewItem);
        }
    }, []);
    
    const dropItem = (itemId) => {
        const newItems = items.filter(item => item.id !== itemId);
        setItems(newItems);
    }

    const loadMoreItems = async () => {
        const lastId = items[items.length - 1].id;
        const response = await fetch(`${resourceUrl}?limit=40&last_id=${lastId}`);
        let body = await response.json();
        setItems(prevItems => [...prevItems, ...body]);
    }

    return (
        <div>
            {items.map((item) => (
                <Item 
                    key={item.id} 
                    item={item} 
                    drop={() => dropItem(item.id)}
                    wsUrl={wsUrl}
                    fillEventName={fillEventName}
                    resourceUrl={resourceUrl}
                    itemType={itemType}
                    payloadType={payloadType}
                />
            ))}
            {items.length && <button onClick={loadMoreItems}>Load More</button>}
        </div>
    )
}