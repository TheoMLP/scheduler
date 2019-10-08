export default function reducer(state, action) {
  switch(action.type) {
    case SETDAY: {
      return { ...state, day: action.day }
    }
    case SET_APPLICATION_DATA: {
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      }
    }
    case SET_INTERVIEW: {
      const dayOfAppointment = state.days.find(d => d.appointments.includes(action.id))

      const countSpots = (day) => {
        let nbOfSpots = 0
        day.appointments.forEach(appointment => {
          if (!action.appointments[appointment].interview) {
            nbOfSpots += 1
          }
        })
        return nbOfSpots
      }

      const day = { ...dayOfAppointment, spots: countSpots(dayOfAppointment) }
      const index = state.days.indexOf(dayOfAppointment)
      
      const days = [...state.days]
      days[index] = day

      return { ...state, appointments: action.appointments, days }
    }
    default: {
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      )
    }
  }
}

export const SETDAY = "SETDAY"
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA"
export const SET_INTERVIEW = "SET_INTERVIEW"