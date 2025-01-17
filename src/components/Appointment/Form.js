import React, { useState } from 'react';
import InterviewerList from '../InterviewerList';
import Button from '../Button';

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  function reset() {
    setName("")
    setInterviewer(null)
    props.onCancel()
  };

  function validate() {
    if (name === "" || interviewer === null) {
      setError("Student name and interviewer cannot be blank");
      return;
    } else {
      setError("")
    }
  
    props.onSave(name, interviewer);
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={e => e.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            onChange={e => setName(e.target.value)}
            value={name || ""}
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={e => setInterviewer(e)} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={reset}>Cancel</Button>
          <Button confirm onClick={e => {
            validate();
          }}>Save</Button>
        </section>
      </section>
    </main>
  )
};