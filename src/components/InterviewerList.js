import React from 'react'
import InterviewerListItem from 'components/InterviewerListItem'
import "components/InterviewerList.scss"
import PropTypes from 'prop-types'

export default function InterviewerList({interviewers, value, onChange}) {
  const interviewersList = interviewers.map(interviewer => {
    return <InterviewerListItem
      key={interviewer.id}
      id={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={interviewer.id === value}
      setInterviewer={event => onChange(interviewer.id)}
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
