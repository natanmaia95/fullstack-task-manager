# fullstack-task-manager

A study project monorepo to learn how backends and endpoints work.

## Technologies
- Backend: Node and Express, hosted in Render
- Frontend: React and Vite, hosted in Vercel
- No database (data stored in runtime memory)

## Building locally

#### _spin a new server_
- Navigate to /server
- Run ``npm start``
#### _open a client_
- Navigate to /client
- Run ``npm run dev``

NOTE: You may need to change the environment variables for the routes. These are files named ``.env.local`` (both periods included) 
inside both server and client folders, which are secret, so create them yourself.

## Next steps
- [ ] Schedule storing data in a .json file
- [ ] Add task colors and sorting
- [ ] Improve the UI styles
- [ ] Make ``/ping`` route to spin up the Render server
