
import Submission from './Submission';
import React, { useState, useEffect } from 'react';
import {WS_URL, API_BASE} from '../constants';

export function SubmissionList() {
    const [submissions, setSubmissions] = useState([]);
    

    const getSubmissions = async () => {
        const response = await fetch(`${API_BASE}/submissions`);
        let body = await response.json();
        setSubmissions(body.reverse());
    };


    // fires twice dont know why
    useEffect(() => {
        getSubmissions();

        const handleNewCompletion = () => {
            getSubmissions();
        };
        document.addEventListener('newCompletion', handleNewCompletion);
        return () => {
            document.removeEventListener('newCompletion', handleNewCompletion);
        }
    }, []);

    return (
        <div>
            <h1>Submissions</h1>
            {submissions.map((submission) => (
                <Submission id={submission.id} key={submission.id}/>
            ))}
        </div>
    )
}