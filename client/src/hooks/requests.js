const URI = " http://localhost:8000/v1";

async function httpGetPlanets() {
 const response = await fetch(`${URI}/planets`);
 return await response.json();
}

async function httpGetLaunches() {
 const response = await fetch(`${URI}/launches`);
 return await response.json();
}

async function httpSubmitLaunch(launch) {
 const response = await fetch(`${URI}/launches`, {
  method: "POST",
  headers: {
   "Content-Type": "application/json",
  },
  body: JSON.stringify(launch),
 });
 return await response.json();
}

async function httpAbortLaunch(id) {
 return await fetch(`${URI}/launches/${id}`, {
  method: "DELETE",
 });
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
