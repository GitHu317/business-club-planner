# Business Club Planner

A simple React annual event planner for the Business Club. Create events in the sidebar, save them as small cards, switch between months with the arrow buttons, and drag saved events into one of the 30 day boxes.

## Requirements

Install **Node.js 18 or newer** from [https://nodejs.org/](https://nodejs.org/). After installation, close and reopen Command Prompt so the `node` and `npm` commands are available.

You can check the installation with:

```bat
node --version
npm --version
```

## Run on Windows

1. Extract the ZIP file.
2. Open **Command Prompt**.
3. Change directory into the project folder. For example:

```bat
cd C:\Users\USER\Downloads\business-club-planner\business-club-planner
```

4. Install the project packages:

```bat
npm install
```

5. Start the local website:

```bat
npm run dev
```

6. Open the local address shown in the terminal. It is normally:

```text
http://localhost:5173
```

Keep the Command Prompt window open while using the planner. Press `Ctrl + C` in that window to stop the server.

## If `npm install` shows an ERESOLVE error

Make sure you are using the latest ZIP from this project. The current package configuration has been cleaned so the normal command below should work:

```bat
npm install
```

If npm still reports an old dependency conflict after replacing the project folder, run these commands from the project folder and try again:

```bat
rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
npm cache verify
npm install
```

Do not run `npm run dev` until `npm install` finishes successfully. The message `'vite' is not recognized` means the packages were not installed yet.

## Build a production version

```bat
npm run build
npm run start
```

Then open:

```text
http://localhost:3000
```

## Main controls

- Fill out the event form in the left sidebar.
- Click **Save event**.
- Drag the new small event card from **Saved events** onto a day box.
- Use the left and right arrows to change months.
- Click an event on the calendar to see all of its details.
- Use **Edit** in the details panel to update an event.
- Use **Remove from calendar** to take an event off the calendar while keeping it in the sidebar.
- Use **Delete** only when you want to remove the event completely.
- Open the **Status** tab to toggle Planned, Completed, Failed, Prerequisite met, Near, and Far.
- Open the **Reports** tab to view summary charts and export a Word-compatible `.doc` report.

Events are stored in the browser session only. Refreshing the page resets the example data because this is a local static project without a database.
"# business-club-planner3" 
