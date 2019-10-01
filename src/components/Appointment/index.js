import React, { Fragment } from 'react'
import "./styles.scss"
import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"

export default function Appointment({ time, interview }) {
  return (
    <article className="appointment">
      <Header time={time} />
      {interview ? <Show student={interview.student} interviewer={interview.interviewer.name}/> : <Empty/>}
    </article>
  );
}

