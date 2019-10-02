import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment"
import getAppointmentsForDay from "../helpers/selectors"

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  })
  const setDay = day => setState({...state, day});
  // const setDays = days => setState(prev => ({...prev, days}))

  // Array of appointment for a specific day
  const appointmentsForDay = getAppointmentsForDay(state, state.day)

  const appointmentList = appointmentsForDay.map(appointment => {
    return <Appointment
      key={appointment.id}
      {...appointment}
    />
  })

  useEffect(() => {
    const daysPromise = axios.get("/api/days")
    const appointmentsPromise = axios.get("/api/appointments")
    Promise.all([daysPromise, appointmentsPromise])
      .then(results => {
        setState(prev => ({...prev, days: results[0].data, appointments: results[1].data}))
      })
      .catch(err => {
        console.log(err.stack)
      })
  }, [])

  return (
    <main className="layout">
      <section className="sidebar">
        <img
         className="sidebar--centered"
         src="images/logo.png"
         alt="Interview Scheduler"
         />
         <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentList}
      </section>
    </main>
  );
}
