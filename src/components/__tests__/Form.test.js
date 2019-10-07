import React from 'react'
import { render, cleanup, fireEvent } from "@testing-library/react"
import Form from 'components/Appointment/Form'

afterEach(cleanup)

describe('Form', () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ]

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(<Form interviewers={interviewers} />)
    expect(getByPlaceholderText("Please enter your name")).toHaveValue("")
  })

  it("renders with initial student name", () => {
    const { getByTestId } = render(<Form interviewers={interviewers} name="Lydia Miller-Jones" />)
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones")
  })

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn()
    const { getByText } = render(<Form interviewers={interviewers} onSave={onSave} />)

    fireEvent.click(getByText("Save"))

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it("can successfully save after trying to submit an empty student name", () => {
    const onSave = jest.fn()
    const { getByText, getByPlaceholderText, queryByText } = render(<Form interviewers={interviewers} onSave={onSave} />)

    fireEvent.click(getByText("Save"))

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()

    const input = getByPlaceholderText("Please enter your name")

    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } })
    fireEvent.click(getByText("Save"))

    expect(queryByText(/student name cannot be blank/i)).toBeNull()
    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", null)
  })

  it("calls onCancel and resets the input field", () => {
    const onCancel = jest.fn()
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Miller-Jones"
        onSave={jest.fn()}
        onCancel={onCancel}
      />)
    
    fireEvent.click(getByText("Save"))

    fireEvent.change(getByPlaceholderText("Please enter your name"), { target: { value: "Lydia Miller-Jones" } })
    fireEvent.click(getByText("Cancel"))

    expect(queryByText(/student name cannot be blank/i)).toBeNull()
    expect(getByPlaceholderText("Please enter your name")).toHaveValue("")
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})

//When we use getByText we should be confident that the element exists. 
//If it does not exist, then it throws an error instead. 
//We can test for the absence of something by using queryByText and checking that the value is null.

//We will use the fireEvent[eventName] functions to trigger events on specific nodes


//We have improved the test by making it resemble the way we use our software. 
//Instead of initializing the component with a default value, we simulate user interaction.

// If we declare a test with xit() instead of it(), it will skip the test.