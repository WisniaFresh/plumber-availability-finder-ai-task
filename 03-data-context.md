## The starter project already includes:

Database imitation:
- `backend/src/data/companies.json` 
- `backend/src/data/employees.json` 
- `backend/src/data/bookings.json`

- `GET /api/companies` endpoint that returns companies with their employees nested

- a frontend main page that lists companies with their employees

- a frontend results page that currently shows a hardcoded placeholder proposal

- tests on both backend and frontend


## Data decisions:

- **Bookings store only the hour, not the date.** We are deliberately omitting a date picker. Find nearest booking based on current hour.
- **Every booking is a 1-hour timeslot.** A booking with `startHour: 14` occupies the slot
  `14:00 — 15:00`.


## Constraints

- Do not add a database. The JSON files in `backend/src/data/` are the only data storage. (you can add files there if you want)
- Do not focus on CSS changes. All components are already styled.
- Keep the existing tests green and add new ones where it makes sense.