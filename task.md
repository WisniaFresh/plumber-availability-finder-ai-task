# Fullstack AI-Assisted Live Coding Task

## Scenario

You are joining a startup that is building a booking platform for plumbing services.

Treat the interviewer as your product manager. 

## What is already there

The starter project already includes:
Database imitation:
- `backend/src/data/companies.json` 
- `backend/src/data/employees.json` 
- `backend/src/data/bookings.json`
- `GET /api/companies` endpoint that returns companies with their employees nested
- a frontend main page that lists companies with their employees and a mock avatar
- a frontend results page that currently shows a hardcoded placeholder proposal
- baseline tests on both backend and frontend

## Constraints

- Do not add a database. The JSON files in `backend/src/data/` are the only data storage.
- Do not focus on CSS changes. All components are already styled.
- Keep the existing tests green and add new ones where it makes sense.

## Notes

While working on those tasks remember about good/best coding practices,
otherwise this startup will not become another Amazon or Google. 

If you do not finish everything, that is okay. We prefer quality over speed.
Please think out loud while you work/think.

## Your task

Implement an **availability engine** so the user can find the closest available 1-hour
timeslot that can be booked. When timeslot is found, make sure other users cannot book it anymore.

### Product journey

- The user enters the main page.
- The user clicks the big "Find closest booking" button at the top.
- The user sees a loading state on the button while the engine is working.
- When ready, the user is redirected to the results page.
- The results page displays the proposed booking using **real data from the backend**
  (company, employee, start time, end time) with a working Accept button. 
  Other users should not be able to book the same timeslot anymore.

## Important assumptions about the data

These choices were made to keep the scope of this task tight.

- **Bookings store only the hour, not the date.** We are deliberately omitting a date picker
  for now.
- **Every booking is a 1-hour timeslot.** A booking with `startHour: 14` occupies the slot
  `14:00 — 15:00`.
- **The availability engine should only care about the current hour.** Use
  `new Date().getHours()` as "now". There is no date logic in this task.

