import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment"
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors"
import useApplicationData from  "components/hooks/useApplicationData"

export default function Application(props) {
  //data management obj and func
  const { state, setDay, bookInterview, cancelInterview } = useApplicationData();

  // Arrays of appointment and interviewers for a specific day
  const appointmentsForDay = getAppointmentsForDay(state, state.day)
  const interviewersForDay = getInterviewersForDay(state, state.day)

  //Appointment component rendering
  const schedule = appointmentsForDay.map(appointment => {
    const interview = getInterview(state, appointment.interview)

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewersForDay}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  })

  //Main app rendering
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
        {schedule}
      </section>
    </main>
  );
}
