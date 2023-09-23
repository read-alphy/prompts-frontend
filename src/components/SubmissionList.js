
import Submission from './Submission';
import React, { useState, useEffect } from 'react';
import {WS_URL, API_BASE} from '../constants';

export function SubmissionList() {
    const [submissions, setSubmissions] = useState([]);
    

    const getSubmissions = async () => {
        const response = await fetch(`${API_BASE}/submissions`); //?limit=2&last_id=64`);
        let body = await response.json();
        setSubmissions(body);
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
    
    const dropSubmission = (submissionId) => {
        const newSubmissions = submissions.filter(submission => submission.id !== submissionId);
        setSubmissions(newSubmissions);
    }

    return (
        <div>
            <h1>Submissions</h1>
            {submissions.map((submission) => (
                <Submission key={submission.id} submission={submission} drop={() => dropSubmission(submission.id)}/>
            ))}
        </div>
    )
}