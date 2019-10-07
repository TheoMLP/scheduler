import React from 'react'
import InterviewerListItem from 'components/InterviewerListItem'
import "components/InterviewerList.scss"
import PropTypes from 'prop-types'

export default function InterviewerList({interviewers, value, onChange}) {
  const interviewersList = interviewers.map(i => {
    return <InterviewerListItem
      id={i.id}
      name={i.name}
      avatar={i.avatar}
      selected={i.id === value}
      setInterviewer={event => onChange(i.id)}
    />
  })
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewersList}</ul>
    </section>
  );
}

InterviewerList.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
}
