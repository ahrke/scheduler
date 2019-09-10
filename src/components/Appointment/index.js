import React, { useEffect, useState } from 'react';
import Header from './Header';
import Empty from './Empty';
import Show from './Show';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import useVisualMode from '../../hooks/useVisualMode';

import './styles.scss';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETE = "DELETE";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);
  const [state, setState] = useState({
    student: props.interview && props.interview.student || "",
    interviewer: props.interview && props.interview.interviewer || null
  });

  useEffect(() => {
    if (mode === EMPTY && props.interview && props.interview.student !== undefined) {
      transition(SHOW);
    } else if (mode === SHOW && props.interview && props.interview.student === undefined) {
      transition(EMPTY);
    }
  }, [props.interview, mode, transition])

  
  function save(name, interviewer) {
    setState({
      student: name,
      interviewer
    })
    
    transition(SAVING)
  }
  
  useEffect(() => {
    if (mode === SAVING) {
      const interview = state
      props.bookInterview(props.id, interview)
        .then(res => {
          transition(SHOW)
        })
        .catch(err => {
          console.log("error while saving appointment. err:", err);
          transition(ERROR_SAVE, true)
        })

    } else if (mode === DELETE) {
      props.cancelInterview(props.id)
        .then(res => transition(EMPTY))
        .catch(err => {
          console.log("error while deleting appointment. err:", err);
          transition(ERROR_DELETE, true)
        })
    } else if (mode === EDIT) {

    }
  }, [mode])

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={e => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
          id={props.id}
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={e => transition(CONFIRM)}
          onEdit={e => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers} 
          onCancel={back} 
          onSave={save} 
        />
      )}
      {mode === EDIT && (
        <Form 
          interviewers={props.interviewers}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          onCancel={back} 
          onSave={save} 
        />
      )}
      {mode === SAVING && <Status message="Saving..." />} 
      {mode === CONFIRM && (
        <Confirm 
          message="Are you sure you would like to delete?" 
          onCancel={back} 
          onConfirm={e => transition(DELETE)} 
        />
      )} 
      {mode === DELETE && <Status message="Deleting..." />}
      {mode === ERROR_DELETE && <Error message="Problem while deleting...come back later" onCloseError={e => transition(SHOW)} />}
      {mode === ERROR_SAVE && <Error message="Problem while saving...come back later" onCloseError={e => transition(EMPTY)} />}
    </article>
  )
}