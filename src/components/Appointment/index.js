import React from 'react'
import "./styles.scss"
import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"
import Form from "./Form"
import Status from "./Status"
import useVisualMode from '../hooks/useVisualMode'

const EMPTY = "EMPTY"
const SHOW = "SHOW"
const CREATE = "CREATE"
const SAVING = "SAVING"

export default function Appointment({ id, time, interview, interviewers, bookInterview }) {
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
      .then(result => {
        transition(SHOW)
      })
  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer.name}
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
    </article>
  );
}

