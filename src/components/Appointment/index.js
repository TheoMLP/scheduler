import React from 'react'
import "./styles.scss"
import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"
import Form from "./Form"
import Status from "./Status"
import Confirm from "./Confirm"
import Error from "./Error"
import useVisualMode from '../hooks/useVisualMode'

const EMPTY = "EMPTY"
const SHOW = "SHOW"
const CREATE = "CREATE"
const SAVING = "SAVING"
const DELETING = "DELETING"
const CONFIRM = "CONFIRM"
const EDIT = "EDIT"
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE"

export default function Appointment({ id, time, interview, interviewers, bookInterview, cancelInterview }) {
  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
  )
 
  const save = (name, interviewer) => {
    transition(SAVING)
    const interview = {
      student: name,
      interviewer
    }
    Promise.resolve(bookInterview(id, interview))
      .then(result => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true))
  }

  const confirmDelete = () => {
    transition(DELETING, true)

    Promise.resolve(cancelInterview(id))
      .then(result => transition(EMPTY))
      .catch(err => transition(ERROR_DELETE, true))
  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer.name}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && (
        <Status message="Saving" />
      )}
      {mode === DELETING && (
        <Status message="Deleting" />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onConfirm={confirmDelete}
          onCancel={() => back()}
        />
      )}
      {mode === EDIT && (
        <Form
          name={interview.student}
          interviewer={interview.interviewer.id}
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save appointment"
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not cancel appointment"
          onClose={() => back()} 
        />
      )}
    </article>
  );
}

