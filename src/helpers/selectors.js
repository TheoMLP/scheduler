export function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return []
  }
  const filteredDay = state.days.filter(d => d.name === day)
  if (filteredDay.length === 0) {
    return []
  }
  return filteredDay[0].appointments.map(a => state.appointments[a])
} 

export function getInterview(state, interview) {
  if (interview && interview.interviewer) {
    const interviewer = state.interviewers[interview.interviewer]
    return {...interview, interviewer}
  }
  return null
}

export function getInterviewersForDay(state, day) {
  if (state.days.length === 0) {
    return []
  }
  const filteredDay = state.days.filter(d => d.name === day)
  if (filteredDay.length === 0) {
    return []
  }
  return filteredDay[0].interviewers.map(i => state.interviewers[i])
}

export default { getAppointmentsForDay, getInterview, getInterviewersForDay }