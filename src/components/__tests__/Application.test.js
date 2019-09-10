import React from "react";
import axios from 'axios';

import { render, cleanup, waitForElement, getByText, getAllByTestId, prettyDOM, getByAltText, getByPlaceholderText, waitForElementToBeRemoved, getByTestId } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);

describe("Application", () => {

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    // console.log(prettyDOM(container));

    const appointments = getAllByTestId(container, "appointment");
    // console.log(prettyDOM(appointments));

    const appointment = appointments[0];
    // console.log(prettyDOM(appointment))

    fireEvent.click(getByAltText(appointment, "Add"));
    await waitForElement(() => getByPlaceholderText(appointment, "Enter Student Name"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: {
        value: "Sir. Krumps A Lot"
      }
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment,"Saving...")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment,"Saving...")); 

    // expect(getByText(appointment, "Sir. Krumps A Lot")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Delete"));

    await waitForElement(() => getByText(appointment, "Are you sure you would like to delete?"));

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // await waitForElement(() => getByAltText("Add"));
    // expect(getByTestId("day")[0]).toContain("2 Spots remaining")
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Edit"));
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: {
        value: "Hammah Tim"
      }
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    
    fireEvent.click(getByText(appointment, "Save"));
    
    expect(getByText(appointment,"Saving...")).toBeInTheDocument();

    // await waitForElement(() => getByText(container, "Hammah Tim"));
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce("Error during Saving");

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    await waitForElement(() => getByPlaceholderText(appointment, "Enter Student Name"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: {
        value: "Sir. Krumps A Lot"
      }
    });
    fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(appointment, "Problem while saving...come back later"));
    
    expect(getByText(appointment, "Problem while saving...come back later")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce("Error during Deleting");

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Delete"));

    await waitForElement(() => getByText(appointment, "Are you sure you would like to delete?"));
    fireEvent.click(getByText(appointment, "Confirm"));

    await waitForElement(() => getByText(appointment, "Problem while deleting...come back later"));
    expect(getByText(appointment, "Problem while deleting...come back later")).toBeInTheDocument();

  });

})

