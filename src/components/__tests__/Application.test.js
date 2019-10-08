import React from "react";
import { render, cleanup, waitForElement, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, getByTestId } from "@testing-library/react";
import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />)
  
    await waitForElement(() => getByText("Monday"))
    
    fireEvent.click(getByText("Tuesday"))
    
    expect(getByText("Leopold Silvers")).toBeInTheDocument()
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />)

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment")[0]
    fireEvent.click(getByAltText(appointment, "Add"))
    
    const input = getByPlaceholderText(appointment, /please enter your name/i)
    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } })

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(getByText(appointment, "Save"))

    expect(getByText(appointment, "Saving")).toBeInTheDocument()

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"))

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))
    expect(getByText(day, "no spots remaining")).toBeInTheDocument()
  })

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    // 2. Wait until the text "Archie Cohen" is displayed.
    // 3. Click the "Delete" button on the booked appointment.
    // 4. Check that the confirmation message is shown.
    // 5. Click the "Confirm" button on the confirmation.
    // 6. Check that the element with the text "Deleting" is displayed.
    // 7. Wait until the element with the "Add" button is displayed.
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".

    const { container } = render(<Application/>)

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    )
    fireEvent.click(getByAltText(appointment, "Delete"))

    expect(getByText(appointment, /Are you sure you would like to delete/i)).toBeInTheDocument()
    fireEvent.click(getByText(appointment, "Confirm"))

    expect(getByText(appointment, "Deleting")).toBeInTheDocument()

    await waitForElement(() => getByAltText(appointment, "Add"))

    const day = getAllByTestId(container, "day").find(
      day => queryByText(day, "Monday")
    )
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument()
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    // 2. Wait until the text "Archie Cohen" is displayed.
    // 3. Click the "Edit" button on the booked appointment.
    // 4. Check that the edit form is shown and that the input contains "Archie Cohen".
    // 5. Enter the new name of the student "Lydia Miller-Jones"
    // 6. Change the interviewer to "Sylvia Palmer"
    // 7. Click the "Save" button on the confirmation.
    // 8. Check that the element with the text "Saving" is displayed.
    // 9. Wait until the element with the student name is displayed.
    // 10. Check that the DayListItem with the text "Monday" also has the text "1 spots remaining".

    const { container } = render(<Application/>)

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    )

    fireEvent.click(getByAltText(appointment, "Edit"))

    const input = getByTestId(appointment, "student-name-input")
    expect(input).toHaveValue("Archie Cohen")

    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } })
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))

    fireEvent.click(getByText(appointment, "Save"))
    expect(getByText(appointment, "Saving")).toBeInTheDocument()

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"))

    const day = getAllByTestId(container, "day").find(
      day => queryByText(day, "Monday")
    )

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument()
  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application/>)

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment")[0]
    fireEvent.click(getByAltText(appointment, "Add"))

    const input = getByTestId(appointment, "student-name-input")
    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } })

    fireEvent.click(getByText(appointment, "Save"))

    await waitForElement(() => getByText(appointment, "Error"))
    expect(getByText(appointment, "Could not save appointment")).toBeInTheDocument()

    fireEvent.click(getByAltText(appointment, "Close"))
    expect(getByAltText(appointment, "Add")).toBeInTheDocument()
  })

  it("shows the delete error when failing to delete an existing appointment", async() => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application/>)

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, "Archie Cohen")
    )

    fireEvent.click(getByAltText(appointment, "Delete"))
    expect(getByText(appointment, /Are you sure you would like to delete/i)).toBeInTheDocument()

    fireEvent.click(getByText(appointment, "Confirm"))

    await waitForElement(() => getByText(appointment, "Error"))
    expect(getByText(appointment, "Could not cancel appointment")).toBeInTheDocument()

    fireEvent.click(getByAltText(appointment, "Close"))
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
  })
})