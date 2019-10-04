import React, { useState, useEffect, useReducer } from 'react'
import axios from "axios";

export default function useApplicationData() {

  const SETDAY = "SETDAY"
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA"
  const SET_INTERVIEW = "SET_INTERVIEW"

  const reducer = (state, action) => {
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
        return { ...state, appointments: action.appointments, days: action.days}
      }
      default: {
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        )
      }
    }
  }

  //organization of the state
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  })
  
  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // })
  
  const setDay = day => dispatch({ type: SETDAY, day });
  // const setDays = days => setState(prev => ({...prev, days}))

  //Retrieve data and set State
  useEffect(() => {
    const daysPromise = axios.get("/api/days")
    const appointmentsPromise = axios.get("/api/appointments")
    const interviewersPromise = axios.get("/api/interviewers")
    Promise.all([daysPromise, appointmentsPromise, interviewersPromise])
      .then(results => {
        dispatch({
          type: SET_APPLICATION_DATA,
          days: results[0].data,
          appointments: results[1].data,
          interviewers: results[2].data
        });
      })
      .catch(err => {
        console.log(err.stack)
      })
  }, [])

  //makes an HTTP request to update interview state and set new mode
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    }
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    const dayOfAppointment = state.days.find(d => d.appointments.includes(id))
    const day = { ...dayOfAppointment, spots: dayOfAppointment.spots - 1 }
    
    const index = state.days.indexOf(dayOfAppointment)
    const days = [...state.days]
    days[index] = day

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(response => {
        dispatch({ type: SET_INTERVIEW, appointments, days })
      })
  }
  
  //makes HTTP request to delete interview state and set new mode
  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    const dayOfAppointment = state.days.find(d => d.appointments.includes(id))
    const day = { ...dayOfAppointment, spots: dayOfAppointment.spots + 1 }

    const index = state.days.indexOf(dayOfAppointment)
    const days = [...state.days]
    days[index] = day
  
    return axios.delete(`/api/appointments/${id}`)
      .then(response => {
        dispatch({ type: SET_INTERVIEW, appointments, days})
      })
  }

  return { state, setDay, bookInterview, cancelInterview }
}
