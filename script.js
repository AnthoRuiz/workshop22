const newPartyForm = document.querySelector("#new-party-form");
const partyContainer = document.querySelector("#party-container");
const title = document.querySelector("#title");

const PARTIES_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/parties";
const GUESTS_API_URL =
  "http://fsa-async-await.herokuapp.com/api/workshop/guests";
const RSVPS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/rsvps";
const GIFTS_API_URL = "http://fsa-async-await.herokuapp.com/api/workshop/gifts";

// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};

// get single party by id
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};

// delete party
const deleteParty = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    // fetch party details from server
    const party = await getPartyById(id);

    // GET - /api/workshop/guests/party/:partyId - get guests by party id
    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();

    // GET - /api/workshop/rsvps/party/:partyId - get RSVPs by partyId
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();

    // GET - get all gifts by party id - /api/workshop/parties/gifts/:partyId -BUGGY?
    // const giftsResponse = await fetch(`${PARTIES_API_URL}/party/gifts/${id}`);
    // const gifts = await giftsResponse.json();

    // create new HTML element to display party details
    const partyElement = document.createElement("div");
    const partyColumn = document.createElement("div");

    partyElement.classList.add("card-party-details");
    partyColumn.classList.add("column-party-details");

    // const partyDetailsElement = document.createElement("div");

    partyElement.innerHTML = `
            <h2>${party.name}</h2>
            <p>${party.date}</p>
            <p>${party.location}</p>
            <h3>Guests:</h3>
            <ul>
            ${guests
              .map(
                (guest, index) => `
              <li>
                <div>${guest.name}</div>
                <div>${rsvps[index].status}</div>
              </li>
            `
              )
              .join("")}
          </ul>
            <button class="btn btn-primary btn-round-2 close-button">Close</button>
        `;
    partyColumn.appendChild(partyElement);
    newPartyForm.appendChild(partyColumn);

    // add event listener to close button
    const closeButton = partyElement.querySelector(".close-button");
    closeButton.addEventListener("click", async () => {
      newPartyForm.style.display = "none";
      partyContainer.style.display = "block";
      partyElement.remove();
    });
  } catch (error) {
    console.error(error);
  }
};

// render all parties
const renderParties = async (parties) => {
  try {
    partyContainer.innerHTML = "";
    parties.forEach((party) => {
      const partyElement = document.createElement("div");
      const partyColumn = document.createElement("div");

      partyElement.classList.add("card");
      partyColumn.classList.add("column");
      partyElement.innerHTML = `
                <h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.time}</p>
                <p>${party.location}</p>
                <button class="details-button btn btn-primary btn-round-2" data-id="${party.id}">Details</button>
                <button class="delete-button btn btn-danger btn-round-2" data-id="${party.id}">Delete</button>
            `;
      partyColumn.appendChild(partyElement);
      partyContainer.appendChild(partyColumn);

      // see details
      const detailsButton = partyElement.querySelector(".details-button");
      detailsButton.addEventListener("click", async (event) => {
        const id = event.target.dataset.id;
        partyContainer.style.display = "none";
        newPartyForm.style.display = "block";
        renderSinglePartyById(id);
        title.innerHTML = "Parties Detail";
      });

      // delete party
      const deleteButton = partyElement.querySelector(".delete-button");
      deleteButton.addEventListener("click", async (event) => {
        const id = event.target.dataset.id;
        await deleteParty(id);
        const parties = await getAllParties();
        renderParties(parties);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// init function
const init = async () => {
  const parties = await getAllParties();
  renderParties(parties);
};

init();
