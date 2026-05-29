# Your role (fullstack developer)

You are building a booking platform that connects users that had an
emergency (e.g., pipe leak) with plumbers. Users' goal is to find the nearest (from now) available timeslot for an available plumber to fix their problem.


## Your task

Implement an **availability engine** so the user can find the closest available 1-hour timeslot that can be booked between 4AM - 12PM. When timeslot is found, and user clicked `Accept` make sure other users cannot book it anymore.


## IMPORTANT:

- Treat the interviewer as your product manager.
- If you do not finish everything, that is okay. We prefer quality over speed.Remember about your best coding practices.
- Think out loud we want to know your thought process.


## Definition of done (user journey):

1. User enters the main page.
2. User clicks the `Find closest booking` button at the top.
3. User sees a **loading state** on the button while the engine is working.
4. When response is ready, the user is redirected to the results page.
5. The results page displays the proposed booking using **real data from the backend** (company, employee, start time, end time).
6. User clicks `Accept` button. From this moment other users can't book the same timeslot anymore.
7. User stays on the same page and sees confirmation message "Booking confirmed!"

### NOW READ ./02-more-context.md