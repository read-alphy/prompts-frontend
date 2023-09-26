
import Completion from './Completion';
import React, { useState, useEffect } from 'react';
import {API_BASE} from '../../constants';

export function CompletionList() {
    const [completions, setCompletions] = useState([]);
    

    const getCompletions = async () => {
        const response = await fetch(`${API_BASE}/completions?limit=10`); 
        let body = await response.json();
        setCompletions(body);
    };

    useEffect(() => {
        getCompletions();

        const handleNewCompletion = () => {
            getCompletions();
        };
        document.addEventListener('newCompletion', handleNewCompletion);
        return () => {
            document.removeEventListener('newCompletion', handleNewCompletion);
        }
    }, []);
    
    const dropCompletion = (completionId) => {
        const newCompletions = completions.filter(completion => completion.id !== completionId);
        setCompletions(newCompletions);
    }

    const loadMoreCompletions = async () => {
        const lastId = completions[completions.length - 1].id;
        const response = await fetch(`${API_BASE}/completions?limit=40&last_id=${lastId}`);
        let body = await response.json();
        setCompletions(prevCompletions => [...prevCompletions, ...body]);
    }

    return (
        <div>
            {completions.map((completion) => (
                <Completion key={completion.id} completion={completion} drop={() => dropCompletion(completion.id)}/>
            ))}
            {completions.length && <button onClick={loadMoreCompletions}>Load More</button>}
        </div>
    )
}