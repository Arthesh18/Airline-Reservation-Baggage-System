const AIRTRACK_API =
    "http://localhost:8080/api";


/* =========================================================
   ENTER EXISTING DASHBOARD
========================================================= */

function enterDashboard() {

    window.location.href =
        "dashboard.html";

}


/* =========================================================
   OPEN EXISTING MODULE
========================================================= */

function openModule(section) {

    window.location.href =
        `dashboard.html#${section}`;

}


/* =========================================================
   LIVE COUNTS
========================================================= */

async function loadCounts() {

    const endpoints = {

        passengers:
            "/passengers",

        reservations:
            "/reservations",

        flights:
            "/flights",

        tickets:
            "/tickets",

        baggage:
            "/baggage",

        airports:
            "/airports"

    };


    const elementMap = {

        passengers:
            "count-passengers",

        reservations:
            "count-reservations",

        flights:
            "count-flights",

        tickets:
            "count-tickets",

        baggage:
            "count-baggage",

        airports:
            "count-airports"

    };


    for (
        const [key, endpoint]
        of Object.entries(endpoints)
    ) {

        try {

            const response =
                await fetch(
                    AIRTRACK_API + endpoint
                );


            if (!response.ok) {

                throw new Error(
                    response.status
                );

            }


            const data =
                await response.json();


            const element =
                document.getElementById(
                    elementMap[key]
                );


            if (element) {

                element.textContent =
                    Array.isArray(data)
                        ? data.length
                        : "—";

            }

        } catch (error) {

            console.error(
                `Failed to load ${key}`,
                error
            );

        }

    }

}


/* =========================================================
   FLIGHT BOARD
========================================================= */

async function loadFlights() {

    const board =
        document.getElementById(
            "flight-list"
        );


    if (!board) {

        return;

    }


    try {

        const response =
            await fetch(
                `${AIRTRACK_API}/flights`
            );


        if (!response.ok) {

            throw new Error(
                response.status
            );

        }


        const flights =
            await response.json();


        if (
            !Array.isArray(flights) ||
            flights.length === 0
        ) {

            board.innerHTML = `
                <div class="flight-loading">
                    No flights available.
                </div>
            `;

            return;

        }


        board.innerHTML =
            flights
                .slice(0, 5)
                .map(flight => {

                    return `

                        <div class="flight-row">

                            <strong>
                                ${safe(
                                    flight.flightID
                                )}
                            </strong>

                            <span>
                                ${formatTime(
                                    flight.departureTime
                                )}
                            </span>

                            <span>
                                ${safe(
                                    flight.airlineID
                                )}
                            </span>

                        </div>

                    `;

                })
                .join("");


    } catch (error) {

        console.error(
            "Flight loading failed",
            error
        );


        board.innerHTML = `

            <div class="flight-loading">

                Unable to load flight data.

            </div>

        `;

    }

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

const searchSources = [

    {
        endpoint: "/passengers",
        type: "Passenger",
        icon: "👥",
        section: "passengers"
    },

    {
        endpoint: "/reservations",
        type: "Reservation",
        icon: "▣",
        section: "reservations"
    },

    {
        endpoint: "/flights",
        type: "Flight",
        icon: "✈",
        section: "flights"
    },

    {
        endpoint: "/tickets",
        type: "Ticket",
        icon: "🎫",
        section: "tickets"
    },

    {
        endpoint: "/baggage",
        type: "Baggage",
        icon: "🧳",
        section: "baggage"
    },

    {
        endpoint: "/airports",
        type: "Airport",
        icon: "⌖",
        section: "airports"
    },

    {
        endpoint: "/airlines",
        type: "Airline",
        icon: "A",
        section: "airlines"
    },

    {
        endpoint: "/employees",
        type: "Employee",
        icon: "◉",
        section: "employees"
    }

];


let searchData = [];


/* =========================================================
   LOAD SEARCH DATA
========================================================= */

async function loadSearchData() {

    const results = [];


    for (
        const source
        of searchSources
    ) {

        try {

            const response =
                await fetch(
                    AIRTRACK_API +
                    source.endpoint
                );


            if (!response.ok) {

                continue;

            }


            const data =
                await response.json();


            if (
                !Array.isArray(data)
            ) {

                continue;

            }


            data.forEach(record => {

                results.push({

                    type:
                        source.type,

                    icon:
                        source.icon,

                    section:
                        source.section,

                    record

                });

            });


        } catch (error) {

            console.error(
                source.type,
                error
            );

        }

    }


    searchData =
        results;

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "airport-search"
        );


    const results =
        document.getElementById(
            "search-results"
        );


    if (!input || !results) {

        return;

    }


    input.addEventListener(
        "input",
        () => {

            const query =
                input.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                results.classList.remove(
                    "show"
                );

                results.innerHTML = "";

                return;

            }


            const matches =
                searchData
                    .filter(item => {

                        return Object.values(
                            item.record
                        )
                        .join(" ")
                        .toLowerCase()
                        .includes(query);

                    })
                    .slice(0, 10);


            renderSearchResults(
                matches
            );

        }
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                results.classList.remove(
                    "show"
                );

                input.value = "";

            }

        }
    );

}


/* =========================================================
   RENDER SEARCH
========================================================= */

function renderSearchResults(
    matches
) {

    const results =
        document.getElementById(
            "search-results"
        );


    if (!results) {

        return;

    }


    if (!matches.length) {

        results.innerHTML = `

            <div class="search-result">

                <div class="search-result-icon">
                    ?
                </div>

                <div class="search-result-text">

                    <strong>
                        No records found
                    </strong>

                    <small>
                        Try an ID, name, flight,
                        baggage or reservation.
                    </small>

                </div>

            </div>

        `;

        results.classList.add("show");

        return;

    }


    results.innerHTML =
        matches
            .map((item, index) => {

                const primary =
                    getPrimaryValue(
                        item.record
                    );


                const secondary =
                    getSecondaryValue(
                        item.record
                    );


                return `

                    <button
                        class="search-result"
                        onclick="selectSearchResult(${index})">

                        <div class="search-result-icon">
                            ${item.icon}
                        </div>

                        <div class="search-result-text">

                            <strong>
                                ${safe(primary)}
                            </strong>

                            <small>
                                ${safe(secondary)}
                            </small>

                        </div>

                        <span class="search-result-type">
                            ${item.type}
                        </span>

                    </button>

                `;

            })
            .join("");


    window.currentSearchMatches =
        matches;


    results.classList.add(
        "show"
    );

}


/* =========================================================
   SEARCH RESULT
========================================================= */

function selectSearchResult(
    index
) {

    const matches =
        window.currentSearchMatches ||
        [];


    const selected =
        matches[index];


    if (!selected) {

        return;

    }


    window.location.href =
        `dashboard.html#${selected.section}`;

}


/* =========================================================
   PRIMARY VALUE
========================================================= */

function getPrimaryValue(
    record
) {

    const priority = [

        "passengerID",
        "reservationID",
        "flightID",
        "ticketNo",
        "baggageID",
        "airportID",
        "airlineID",
        "employeeID"

    ];


    for (
        const key
        of priority
    ) {

        if (
            record[key] !== undefined &&
            record[key] !== null
        ) {

            return record[key];

        }

    }


    return Object.values(record)[0] ||
        "Record";

}


/* =========================================================
   SECONDARY VALUE
========================================================= */

function getSecondaryValue(
    record
) {

    const priority = [

        "name",
        "airportName",
        "airlineName",
        "city",
        "email",
        "airlineID",
        "passengerID",
        "reservationID"

    ];


    for (
        const key
        of priority
    ) {

        if (
            record[key] !== undefined &&
            record[key] !== null
        ) {

            return record[key];

        }

    }


    return "Database record";

}


/* =========================================================
   TIME
========================================================= */

function formatTime(value) {

    if (!value) {

        return "--:--";

    }


    return String(value)
        .substring(0, 5);

}


/* =========================================================
   SAFE HTML
========================================================= */

function safe(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   TEAM
========================================================= */

function showTeam() {

    document
        .getElementById("team-popup")
        ?.classList
        .add("show");

}


function closeTeam() {

    document
        .getElementById("team-popup")
        ?.classList
        .remove("show");

}


/* =========================================================
   CTRL + K
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            (event.ctrlKey ||
             event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();


            document
                .getElementById(
                    "airport-search"
                )
                ?.focus();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

async function initializeAirportHome() {

    setupSearch();

    await Promise.all([

        loadCounts(),

        loadFlights(),

        loadSearchData()

    ]);

}


document.addEventListener(
    "DOMContentLoaded",
    initializeAirportHome
);