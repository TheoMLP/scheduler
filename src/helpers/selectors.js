export default function getAppointmentsForDay(state, day) {
  if (state.days.length === 0) {
    return []
  }
  const filteredDay = state.days.filter(d => d.name === day)
  if (filteredDay.length === 0) {
    return []
  }
  return filteredDay[0].appointments.map(a => state.appointments[a])
} 
