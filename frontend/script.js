const API_BASE = "http://localhost:8080/api";
let passengers = [];
let reservations = [];
let airports = [];
let flights = [];
let airlines = [];
let tickets = [];
let baggage = [];
let payments = [];
let paymentTickets = [];
let employees = [];
let baggageTracking = [];
let baggageTrackingOptions = [];
let ticketBaggage = [];
let passengerPhones = [];
let editingPhonePassengerID = null;
let editingPhoneNumber = null;
let editingTBReservationID = null;
let editingTBTicketNo = null;
let editingTBBaggageID = null;
let editingTrackingBaggageID = null;
let editingTrackingID = null;
let editingEmployeeID = null;
let editingAirlineID = null;
let editingAirportID = null;
let editingPaymentID = null;
let editingBaggageID = null;
let editingPassengerID = null;
let editingReservationID = null;
let editingFlightID = null;
let editingTicketReservationID = null;
let editingTicketNo = null;
/* =========================
   SECTION TITLES
========================= */

const sectionTitles = {
    dashboard: "Dashboard",
    passengers: "Passengers",
    reservations: "Reservations",
    flights: "Flights",
    tickets: "Tickets",
    baggage: "Baggage",
    payments: "Payments",
    airports: "Airports",
    airlines: "Airlines",
    employees: "Employees",
    tracking: "Baggage Tracking",
    "passenger-phones": "Passenger Phones",
    relationships: "Database Schema",
    "eer-diagram": "EER Diagram",
    sql: "SQL Console"
};


/* =========================
   NAVIGATION
========================= */

function showSection(sectionId) {

    document.querySelectorAll(".content-section")
        .forEach(section =>
            section.classList.remove("active")
        );


    document.querySelectorAll(".nav-item")
        .forEach(button =>
            button.classList.remove("active")
        );


    const section =
        document.getElementById(sectionId);


    if (section) {
        section.classList.add("active");
    }


    document.querySelectorAll(".nav-item")
        .forEach(button => {

            if (
                button.getAttribute("onclick") ===
                `showSection('${sectionId}')`
            ) {
                button.classList.add("active");
            }

        });


    document.getElementById("page-title").textContent =
        sectionTitles[sectionId] || "Dashboard";


    if (sectionId === "dashboard") {
        loadDashboard();
    }


    if (sectionId === "passengers") {
        loadPassengers();
    }


    if (sectionId === "reservations") {
        loadReservations();
    }
    if (sectionId === "flights") {
    loadFlights();
    }
    if (sectionId === "tickets") {
    loadTickets();
    }
    if (sectionId === "ticket-baggage") {
    loadTicketBaggage();
    }
    if (sectionId === "baggage") {
    loadBaggage();
    }
    if (sectionId === "payments") {
    loadPayments();
    }
    if (sectionId === "airports") {
    loadAirports();
    }
    if (sectionId === "airlines") {
    loadAirlines();
    }
    if (sectionId === "employees") {
    loadEmployees();
    }
    if (sectionId === "tracking") {
    loadBaggageTracking();
    }
    if (sectionId === "passenger-phones") {
    loadPassengerPhones();
    }
    if (sectionId === "eer-diagram") {
    initializeInteractiveEER();
    }
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   GENERIC API
========================= */

async function fetchData(endpoint, options = {}) {

    const response = await fetch(
        `${API_BASE}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );


    let data = null;

    const contentType =
        response.headers.get("content-type");


    if (
        contentType &&
        contentType.includes("application/json")
    ) {
        data = await response.json();
    }


    if (!response.ok) {

        const message =
            data?.message ||
            `Request failed with status ${response.status}`;

        throw new Error(message);
    }


    return data;
}


/* =========================
   DASHBOARD
========================= */

async function loadDashboard() {

    try {

        const [
            passengerData,
            reservationData,
            ticketData,
            baggageData,
            airlineData,
            airportData,
            flightData,
            employeeData,
            paymentData
        ] = await Promise.all([

            fetchData("/passengers"),
            fetchData("/reservations"),
            fetchData("/tickets"),
            fetchData("/baggage"),
            fetchData("/airlines"),
            fetchData("/airports"),
            fetchData("/flights"),
            fetchData("/employees"),
            fetchData("/payments")

        ]);


        document.getElementById("passenger-count").textContent =
            passengerData.length;

        document.getElementById("reservation-count").textContent =
            reservationData.length;

        document.getElementById("ticket-count").textContent =
            ticketData.length;

        document.getElementById("baggage-count").textContent =
            baggageData.length;

        document.getElementById("airline-count").textContent =
            airlineData.length;

        document.getElementById("airport-count").textContent =
            airportData.length;

        document.getElementById("flight-count").textContent =
            flightData.length;

        document.getElementById("employee-count").textContent =
            employeeData.length;

        document.getElementById("payment-count").textContent =
            paymentData.length;


        document.querySelector(".system-status").textContent =
            "● API Online";

        document.querySelector(".system-status").style.color =
            "#16a34a";


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        document.querySelector(".system-status").textContent =
            "● API Offline";

        document.querySelector(".system-status").style.color =
            "#dc2626";
    }
}


/* =========================================================
   PASSENGERS
========================================================= */

async function loadPassengers() {

    const container =
        document.getElementById(
            "passenger-table-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading passengers...
        </div>
    `;


    try {

        passengers =
            await fetchData("/passengers");


        renderPassengerTable(passengers);


    } catch (error) {

        console.error(
            "Passenger loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load passengers
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadPassengers()">
                    Try Again
                </button>

            </div>
        `;
    }
}


function renderPassengerTable(data) {

    const container =
        document.getElementById(
            "passenger-table-container"
        );


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    👤
                </div>

                <h3>
                    No passengers found
                </h3>

                <p>
                    Add a passenger to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(passenger => {

        rows += `
            <tr>

                <td>
                    <span class="id-badge">
                        ${escapeHtml(
                            passenger.passengerID
                        )}
                    </span>
                </td>

                <td>
                    <strong>
                        ${escapeHtml(
                            passenger.name
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(
                        passenger.email
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        passenger.dob
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        passenger.city || "—"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        passenger.pin || "—"
                    )}
                </td>

                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditPassenger('${escapeAttribute(passenger.passengerID)}')">
                        ✎
                    </button>

                    <button
                        class="table-action delete-action"
                        onclick="deletePassenger('${escapeAttribute(passenger.passengerID)}')">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date of Birth</th>
                        <th>City</th>
                        <th>PIN</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>

        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            passenger${data.length === 1 ? "" : "s"}

        </div>
    `;
}


function filterPassengers() {

    const search =
        document.getElementById(
            "passenger-search"
        ).value
        .toLowerCase()
        .trim();


    if (!search) {

        renderPassengerTable(passengers);

        return;
    }


    const filtered =
        passengers.filter(passenger =>

            String(passenger.passengerID)
                .toLowerCase()
                .includes(search)

            ||

            String(passenger.name)
                .toLowerCase()
                .includes(search)

            ||

            String(passenger.email)
                .toLowerCase()
                .includes(search)

            ||

            String(passenger.city || "")
                .toLowerCase()
                .includes(search)

            ||

            String(passenger.pin || "")
                .toLowerCase()
                .includes(search)

        );


    renderPassengerTable(filtered);
}


/* =========================
   ADD PASSENGER
========================= */

function openPassengerModal() {

    editingPassengerID = null;


    document.getElementById(
        "passenger-modal-title"
    ).textContent = "Add Passenger";


    document.getElementById(
        "passenger-modal-subtitle"
    ).textContent =
        "Enter passenger details";


    document.getElementById(
        "passenger-save-btn"
    ).textContent =
        "Save Passenger";


    document.getElementById(
        "passenger-form"
    ).reset();


    document.getElementById(
        "passengerID"
    ).disabled = false;


    document.getElementById(
        "passenger-modal"
    ).classList.add("show");
}


/* =========================
   EDIT PASSENGER
========================= */

function openEditPassenger(passengerID) {

    const passenger =
        passengers.find(
            p => p.passengerID === passengerID
        );


    if (!passenger) {

        showToast(
            "Passenger record not found.",
            "error"
        );

        return;
    }


    editingPassengerID = passengerID;


    document.getElementById(
        "passenger-modal-title"
    ).textContent =
        "Edit Passenger";


    document.getElementById(
        "passenger-modal-subtitle"
    ).textContent =
        "Update passenger details";


    document.getElementById(
        "passenger-save-btn"
    ).textContent =
        "Update Passenger";


    document.getElementById("passengerID").value =
        passenger.passengerID;

    document.getElementById("passengerName").value =
        passenger.name;

    document.getElementById("passengerEmail").value =
        passenger.email;

    document.getElementById("passengerDOB").value =
        passenger.dob;

    document.getElementById("passengerStreet").value =
        passenger.street || "";

    document.getElementById("passengerCity").value =
        passenger.city || "";

    document.getElementById("passengerPIN").value =
        passenger.pin || "";


    document.getElementById(
        "passengerID"
    ).disabled = true;


    document.getElementById(
        "passenger-modal"
    ).classList.add("show");
}


function closePassengerModal() {

    document.getElementById(
        "passenger-modal"
    ).classList.remove("show");

    editingPassengerID = null;
}


/* =========================
   SAVE PASSENGER
========================= */

async function savePassenger(event) {

    event.preventDefault();


    const passenger = {

        passengerID:
            document.getElementById(
                "passengerID"
            ).value.trim(),

        name:
            document.getElementById(
                "passengerName"
            ).value.trim(),

        email:
            document.getElementById(
                "passengerEmail"
            ).value.trim(),

        dob:
            document.getElementById(
                "passengerDOB"
            ).value,

        street:
            document.getElementById(
                "passengerStreet"
            ).value.trim(),

        city:
            document.getElementById(
                "passengerCity"
            ).value.trim(),

        pin:
            document.getElementById(
                "passengerPIN"
            ).value.trim()
    };


    const button =
        document.getElementById(
            "passenger-save-btn"
        );


    button.disabled = true;
    button.textContent = "Saving...";


    try {

        if (editingPassengerID) {

            await fetchData(
                `/passengers/${encodeURIComponent(
                    editingPassengerID
                )}`,
                {
                    method: "PUT",
                    body: JSON.stringify(passenger)
                }
            );


            showToast(
                "Passenger updated successfully.",
                "success"
            );


        } else {

            await fetchData(
                "/passengers",
                {
                    method: "POST",
                    body: JSON.stringify(passenger)
                }
            );


            showToast(
                "Passenger added successfully.",
                "success"
            );
        }


        closePassengerModal();

        await loadPassengers();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Passenger save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            editingPassengerID
                ? "Update Passenger"
                : "Save Passenger";
    }
}


/* =========================
   DELETE PASSENGER
========================= */

async function deletePassenger(passengerID) {

    const passenger =
        passengers.find(
            p => p.passengerID === passengerID
        );


    const name =
        passenger
            ? passenger.name
            : passengerID;


    const confirmed =
        confirm(
            `Are you sure you want to delete passenger "${name}" (${passengerID})?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(
            `/passengers/${encodeURIComponent(
                passengerID
            )}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Passenger deleted successfully.",
            "success"
        );


        await loadPassengers();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Passenger delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}


/* =========================================================
   RESERVATIONS
========================================================= */

async function loadReservations() {

    const container =
        document.getElementById(
            "reservation-table-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading reservations...
        </div>
    `;


    try {

        reservations =
            await fetchData("/reservations");


        renderReservationTable(reservations);


    } catch (error) {

        console.error(
            "Reservation loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load reservations
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadReservations()">
                    Try Again
                </button>

            </div>
        `;
    }
}


/* =========================
   RESERVATION TABLE
========================= */

function renderReservationTable(data) {

    const container =
        document.getElementById(
            "reservation-table-container"
        );


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ▣
                </div>

                <h3>
                    No reservations found
                </h3>

                <p>
                    Add a reservation to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(reservation => {

        const status =
            reservation.bookingStatus || "";


        let statusClass =
            "status-default";


        if (status === "Confirmed") {
            statusClass = "status-confirmed";
        }

        else if (status === "Pending") {
            statusClass = "status-pending";
        }

        else if (status === "Cancelled") {
            statusClass = "status-cancelled";
        }


        rows += `
            <tr>

                <td>

                    <span class="id-badge">
                        ${escapeHtml(
                            reservation.reservationID
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHtml(
                        reservation.passengerID
                    )}
                </td>


                <td>

                    <span class="status-badge ${statusClass}">
                        ${escapeHtml(status)}
                    </span>

                </td>


                <td>
                    ${escapeHtml(
                        reservation.reservationClass || "—"
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        reservation.departureAirportID
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        reservation.arrivalAirportID
                    )}
                </td>


                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditReservation('${escapeAttribute(reservation.reservationID)}')">
                        ✎
                    </button>


                    <button
                        class="table-action delete-action"
                        onclick="deleteReservation('${escapeAttribute(reservation.reservationID)}')">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Reservation ID</th>
                        <th>Passenger</th>
                        <th>Status</th>
                        <th>Class</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            reservation${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* =========================
   RESERVATION SEARCH
========================= */

function filterReservations() {

    const search =
        document.getElementById(
            "reservation-search"
        ).value
        .toLowerCase()
        .trim();


    if (!search) {

        renderReservationTable(
            reservations
        );

        return;
    }


    const filtered =
        reservations.filter(
            reservation =>

                String(
                    reservation.reservationID
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    reservation.passengerID
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    reservation.bookingStatus
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    reservation.reservationClass
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    reservation.departureAirportID
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    reservation.arrivalAirportID
                )
                .toLowerCase()
                .includes(search)

        );


    renderReservationTable(filtered);
}


/* =========================
   LOAD DROPDOWNS
========================= */

async function loadReservationOptions() {

    try {

        const [
            passengerData,
            airportData
        ] = await Promise.all([

            fetchData("/passengers"),
            fetchData("/airports")

        ]);


        passengers = passengerData;
        airports = airportData;


        populatePassengerDropdown();
        populateAirportDropdowns();


    } catch (error) {

        console.error(
            "Unable to load reservation options:",
            error
        );


        showToast(
            "Unable to load passenger/airport data.",
            "error"
        );
    }
}


/* =========================
   PASSENGER DROPDOWN
========================= */

function populatePassengerDropdown() {

    const select =
        document.getElementById(
            "reservationPassenger"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select passenger
        </option>
    `;


    passengers.forEach(passenger => {

        const option =
            document.createElement("option");


        option.value =
            passenger.passengerID;


        option.textContent =
            `${passenger.passengerID} — ${passenger.name}`;


        select.appendChild(option);
    });
}


/* =========================
   AIRPORT DROPDOWNS
========================= */

function populateAirportDropdowns() {

    const departure =
        document.getElementById(
            "departureAirport"
        );


    const arrival =
        document.getElementById(
            "arrivalAirport"
        );


    if (!departure || !arrival) {
        return;
    }


    departure.innerHTML = `
        <option value="">
            Select departure airport
        </option>
    `;


    arrival.innerHTML = `
        <option value="">
            Select arrival airport
        </option>
    `;


    airports.forEach(airport => {

        const label =
            `${airport.airportID} — ${airport.airportName}, ${airport.city}`;


        const departureOption =
            document.createElement("option");


        departureOption.value =
            airport.airportID;


        departureOption.textContent =
            label;


        departure.appendChild(
            departureOption
        );


        const arrivalOption =
            document.createElement("option");


        arrivalOption.value =
            airport.airportID;


        arrivalOption.textContent =
            label;


        arrival.appendChild(
            arrivalOption
        );
    });
}


/* =========================
   ADD RESERVATION
========================= */

async function openReservationModal() {

    editingReservationID = null;


    document.getElementById(
        "reservation-modal-title"
    ).textContent =
        "Add Reservation";


    document.getElementById(
        "reservation-modal-subtitle"
    ).textContent =
        "Enter reservation details";


    document.getElementById(
        "reservation-save-btn"
    ).textContent =
        "Save Reservation";


    document.getElementById(
        "reservation-form"
    ).reset();


    document.getElementById(
        "reservationID"
    ).disabled = false;


    document.getElementById(
        "reservation-modal"
    ).classList.add("show");


    await loadReservationOptions();
}


/* =========================
   EDIT RESERVATION
========================= */

async function openEditReservation(
    reservationID
) {

    const reservation =
        reservations.find(
            r =>
                r.reservationID ===
                reservationID
        );


    if (!reservation) {

        showToast(
            "Reservation record not found.",
            "error"
        );

        return;
    }


    editingReservationID =
        reservationID;


    document.getElementById(
        "reservation-modal-title"
    ).textContent =
        "Edit Reservation";


    document.getElementById(
        "reservation-modal-subtitle"
    ).textContent =
        "Update reservation details";


    document.getElementById(
        "reservation-save-btn"
    ).textContent =
        "Update Reservation";


    document.getElementById(
        "reservationID"
    ).value =
        reservation.reservationID;


    document.getElementById(
        "reservationID"
    ).disabled = true;


    await loadReservationOptions();


    document.getElementById(
        "reservationPassenger"
    ).value =
        reservation.passengerID;


    document.getElementById(
        "reservationStatus"
    ).value =
        reservation.bookingStatus;


    document.getElementById(
        "reservationClass"
    ).value =
        reservation.reservationClass;


    document.getElementById(
        "departureAirport"
    ).value =
        reservation.departureAirportID;


    document.getElementById(
        "arrivalAirport"
    ).value =
        reservation.arrivalAirportID;


    document.getElementById(
        "reservation-modal"
    ).classList.add("show");
}


/* =========================
   CLOSE RESERVATION MODAL
========================= */

function closeReservationModal() {

    document.getElementById(
        "reservation-modal"
    ).classList.remove("show");


    editingReservationID = null;
}


/* =========================
   SAVE RESERVATION
========================= */

async function saveReservation(event) {

    event.preventDefault();


   const reservation = {

    reservationID:
        document.getElementById(
            "reservationID"
        ).value.trim(),

    passengerID:
        document.getElementById(
            "reservationPassenger"
        ).value,

    bookingStatus:
        document.getElementById(
            "reservationStatus"
        ).value,

    reservationClass:
        document.getElementById(
            "reservationClass"
        ).value,

    departureAirportID:
        document.getElementById(
            "departureAirport"
        ).value,

    arrivalAirportID:
        document.getElementById(
            "arrivalAirport"
        ).value
};


    const button =
        document.getElementById(
            "reservation-save-btn"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        if (editingReservationID) {

            await fetchData(
                `/reservations/${encodeURIComponent(
                    editingReservationID
                )}`,
                {
                    method: "PUT",
                    body: JSON.stringify(
                        reservation
                    )
                }
            );


            showToast(
                "Reservation updated successfully.",
                "success"
            );


        } else {

            await fetchData(
                "/reservations",
                {
                    method: "POST",
                    body: JSON.stringify(
                        reservation
                    )
                }
            );


            showToast(
                "Reservation added successfully.",
                "success"
            );
        }


        closeReservationModal();

        await loadReservations();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Reservation save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            editingReservationID
                ? "Update Reservation"
                : "Save Reservation";
    }
}


/* =========================
   DELETE RESERVATION
========================= */

async function deleteReservation(
    reservationID
) {

    const reservation =
        reservations.find(
            r =>
                r.reservationID ===
                reservationID
        );


    const confirmed =
        confirm(
            `Are you sure you want to delete reservation "${reservationID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(
            `/reservations/${encodeURIComponent(
                reservationID
            )}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Reservation deleted successfully.",
            "success"
        );


        await loadReservations();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Reservation delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}


/* =========================
   TOAST
========================= */

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById("toast");


    toast.textContent =
        message;


    toast.className =
        `toast ${type} show`;


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 3500);
}
/* =========================================================
   FLIGHTS
========================================================= */


/* =========================
   LOAD FLIGHTS
========================= */

async function loadFlights() {

    const container =
        document.getElementById(
            "flight-table-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading flights...
        </div>
    `;


    try {

        flights =
            await fetchData("/flights");


        renderFlightTable(flights);


    } catch (error) {

        console.error(
            "Flight loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load flights
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadFlights()">
                    Try Again
                </button>

            </div>
        `;
    }
}


/* =========================
   FLIGHT TABLE
========================= */

function renderFlightTable(data) {

    const container =
        document.getElementById(
            "flight-table-container"
        );


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ✈
                </div>

                <h3>
                    No flights found
                </h3>

                <p>
                    Add a flight to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(flight => {

        rows += `
            <tr>

                <td>

                    <span class="id-badge">
                        ${escapeHtml(
                            flight.flightID
                        )}
                    </span>

                </td>


                <td>
                    <strong>
                        ${escapeHtml(
                            flight.airlineID
                        )}
                    </strong>
                </td>


                <td>
                    ${escapeHtml(
                        flight.departureTime
                    )}
                </td>


                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditFlight('${escapeAttribute(flight.flightID)}')">
                        ✎
                    </button>


                    <button
                        class="table-action delete-action"
                        onclick="deleteFlight('${escapeAttribute(flight.flightID)}')">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Flight ID</th>
                        <th>Airline</th>
                        <th>Departure Time</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            flight${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* =========================
   FLIGHT SEARCH
========================= */

function filterFlights() {

    const search =
        document.getElementById(
            "flight-search"
        ).value
        .toLowerCase()
        .trim();


    if (!search) {

        renderFlightTable(flights);

        return;
    }


    const filtered =
        flights.filter(flight =>

            String(
                flight.flightID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                flight.airlineID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                flight.departureTime
            )
            .toLowerCase()
            .includes(search)

        );


    renderFlightTable(filtered);
}


/* =========================
   LOAD AIRLINE OPTIONS
========================= */

async function loadFlightOptions() {

    try {

        airlines =
            await fetchData("/airlines");


        populateAirlineDropdown();


    } catch (error) {

        console.error(
            "Unable to load airlines:",
            error
        );


        showToast(
            "Unable to load airline data.",
            "error"
        );
    }
}


/* =========================
   AIRLINE DROPDOWN
========================= */

function populateAirlineDropdown() {

    const select =
        document.getElementById(
            "flightAirline"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select airline
        </option>
    `;


    airlines.forEach(airline => {

        const option =
            document.createElement("option");


        option.value =
            airline.airlineID;


        option.textContent =
            `${airline.airlineID} — ${airline.airlineName}`;


        select.appendChild(option);
    });
}


/* =========================
   ADD FLIGHT
========================= */

async function openFlightModal() {

    editingFlightID = null;


    document.getElementById(
        "flight-modal-title"
    ).textContent =
        "Add Flight";


    document.getElementById(
        "flight-modal-subtitle"
    ).textContent =
        "Enter flight details";


    document.getElementById(
        "flight-save-btn"
    ).textContent =
        "Save Flight";


    document.getElementById(
        "flight-form"
    ).reset();


    document.getElementById(
        "flightID"
    ).disabled = false;


    document.getElementById(
        "flight-modal"
    ).classList.add("show");


    await loadFlightOptions();
}


/* =========================
   EDIT FLIGHT
========================= */

async function openEditFlight(flightID) {

    const flight =
        flights.find(
            f =>
                f.flightID ===
                flightID
        );


    if (!flight) {

        showToast(
            "Flight record not found.",
            "error"
        );

        return;
    }


    editingFlightID =
        flightID;


    document.getElementById(
        "flight-modal-title"
    ).textContent =
        "Edit Flight";


    document.getElementById(
        "flight-modal-subtitle"
    ).textContent =
        "Update flight details";


    document.getElementById(
        "flight-save-btn"
    ).textContent =
        "Update Flight";


    document.getElementById(
        "flightID"
    ).value =
        flight.flightID;


    document.getElementById(
        "flightID"
    ).disabled = true;


    await loadFlightOptions();


    document.getElementById(
        "flightAirline"
    ).value =
        flight.airlineID;


    document.getElementById(
        "flightDepartureTime"
    ).value =
        String(
            flight.departureTime
        ).substring(0, 5);


    document.getElementById(
        "flight-modal"
    ).classList.add("show");
}


/* =========================
   CLOSE FLIGHT MODAL
========================= */

function closeFlightModal() {

    document.getElementById(
        "flight-modal"
    ).classList.remove("show");


    editingFlightID = null;
}


/* =========================
   SAVE FLIGHT
========================= */

async function saveFlight(event) {

    event.preventDefault();


    const flight = {

        flightID:
            document.getElementById(
                "flightID"
            ).value.trim(),

        airlineID:
            document.getElementById(
                "flightAirline"
            ).value,

        departureTime:
            document.getElementById(
                "flightDepartureTime"
            ).value + ":00"
    };


    const button =
        document.getElementById(
            "flight-save-btn"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        if (editingFlightID) {

            await fetchData(
                `/flights/${encodeURIComponent(
                    editingFlightID
                )}`,
                {
                    method: "PUT",
                    body: JSON.stringify(
                        flight
                    )
                }
            );


            showToast(
                "Flight updated successfully.",
                "success"
            );


        } else {

            await fetchData(
                "/flights",
                {
                    method: "POST",
                    body: JSON.stringify(
                        flight
                    )
                }
            );


            showToast(
                "Flight added successfully.",
                "success"
            );
        }


        closeFlightModal();

        await loadFlights();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Flight save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            editingFlightID
                ? "Update Flight"
                : "Save Flight";
    }
}


/* =========================
   DELETE FLIGHT
========================= */

async function deleteFlight(flightID) {

    const confirmed =
        confirm(
            `Are you sure you want to delete flight "${flightID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(
            `/flights/${encodeURIComponent(
                flightID
            )}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Flight deleted successfully.",
            "success"
        );


        await loadFlights();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Flight delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}

/* =========================
   HTML SAFETY
========================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


function escapeAttribute(value) {

    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        );
}
/* =========================================================
   TICKETS
========================================================= */


/* =========================
   LOAD TICKETS
========================= */

async function loadTickets() {

    const container =
        document.getElementById(
            "ticket-table-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading tickets...
        </div>
    `;


    try {

        tickets =
            await fetchData("/tickets");


        renderTicketTable(tickets);


    } catch (error) {

        console.error(
            "Ticket loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load tickets
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadTickets()">
                    Try Again
                </button>

            </div>
        `;
    }
}


/* =========================
   TICKET TABLE
========================= */

function renderTicketTable(data) {

    const container =
        document.getElementById(
            "ticket-table-container"
        );


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🎫
                </div>

                <h3>
                    No tickets found
                </h3>

                <p>
                    Add a ticket to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(ticket => {

        rows += `
            <tr>

                <td>

                    <span class="id-badge">
                        ${escapeHtml(
                            ticket.reservationID
                        )}
                    </span>

                </td>


                <td>

                    <span class="id-badge">
                        ${escapeHtml(
                            ticket.ticketNo
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHtml(
                        ticket.seatNo || "—"
                    )}
                </td>


                <td>
                    ₹${Number(
                        ticket.fare
                    ).toFixed(2)}
                </td>


                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditTicket(
                            '${escapeAttribute(ticket.reservationID)}',
                            '${escapeAttribute(ticket.ticketNo)}'
                        )">
                        ✎
                    </button>


                    <button
                        class="table-action delete-action"
                        onclick="deleteTicket(
                            '${escapeAttribute(ticket.reservationID)}',
                            '${escapeAttribute(ticket.ticketNo)}'
                        )">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Reservation ID</th>
                        <th>Ticket No</th>
                        <th>Seat No</th>
                        <th>Fare</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            ticket${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* =========================
   SEARCH TICKETS
========================= */

function filterTickets() {

    const search =
        document.getElementById(
            "ticket-search"
        ).value
        .toLowerCase()
        .trim();


    if (!search) {

        renderTicketTable(tickets);

        return;
    }


    const filtered =
        tickets.filter(ticket =>

            String(
                ticket.reservationID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                ticket.ticketNo
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                ticket.seatNo || ""
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                ticket.fare
            )
            .toLowerCase()
            .includes(search)

        );


    renderTicketTable(filtered);
}


/* =========================
   LOAD RESERVATION OPTIONS
========================= */

async function loadTicketOptions() {

    try {

        reservations =
            await fetchData("/reservations");


        populateTicketReservationDropdown();


    } catch (error) {

        console.error(
            "Unable to load reservations:",
            error
        );


        showToast(
            "Unable to load reservation data.",
            "error"
        );
    }
}


/* =========================
   RESERVATION DROPDOWN
========================= */

function populateTicketReservationDropdown() {

    const select =
        document.getElementById(
            "ticketReservation"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select reservation
        </option>
    `;


    reservations.forEach(reservation => {

        const option =
            document.createElement("option");


        option.value =
            reservation.reservationID;


        option.textContent =
            `${reservation.reservationID} — ${reservation.passengerID} — ${reservation.bookingStatus}`;


        select.appendChild(option);
    });
}


/* =========================
   ADD TICKET
========================= */

async function openTicketModal() {

    editingTicketReservationID = null;
    editingTicketNo = null;


    document.getElementById(
        "ticket-modal-title"
    ).textContent =
        "Add Ticket";


    document.getElementById(
        "ticket-modal-subtitle"
    ).textContent =
        "Enter ticket details";


    document.getElementById(
        "ticket-save-btn"
    ).textContent =
        "Save Ticket";


    document.getElementById(
        "ticket-form"
    ).reset();


    document.getElementById(
        "ticketReservation"
    ).disabled = false;


    document.getElementById(
        "ticketNo"
    ).disabled = false;


    document.getElementById(
        "ticket-modal"
    ).classList.add("show");


    await loadTicketOptions();
}


/* =========================
   EDIT TICKET
========================= */

async function openEditTicket(
    reservationID,
    ticketNo
) {

    const ticket =
        tickets.find(
            t =>
                t.reservationID ===
                    reservationID
                &&
                t.ticketNo ===
                    ticketNo
        );


    if (!ticket) {

        showToast(
            "Ticket record not found.",
            "error"
        );

        return;
    }


    editingTicketReservationID =
        reservationID;

    editingTicketNo =
        ticketNo;


    document.getElementById(
        "ticket-modal-title"
    ).textContent =
        "Edit Ticket";


    document.getElementById(
        "ticket-modal-subtitle"
    ).textContent =
        "Update ticket details";


    document.getElementById(
        "ticket-save-btn"
    ).textContent =
        "Update Ticket";


    await loadTicketOptions();


    document.getElementById(
        "ticketReservation"
    ).value =
        ticket.reservationID;


    document.getElementById(
        "ticketNo"
    ).value =
        ticket.ticketNo;


    document.getElementById(
        "ticketSeatNo"
    ).value =
        ticket.seatNo || "";


    document.getElementById(
        "ticketFare"
    ).value =
        ticket.fare;


    /*
     * Composite primary key values
     * cannot be changed during edit.
     */

    document.getElementById(
        "ticketReservation"
    ).disabled = true;


    document.getElementById(
        "ticketNo"
    ).disabled = true;


    document.getElementById(
        "ticket-modal"
    ).classList.add("show");
}


/* =========================
   CLOSE TICKET MODAL
========================= */

function closeTicketModal() {

    document.getElementById(
        "ticket-modal"
    ).classList.remove("show");


    editingTicketReservationID = null;

    editingTicketNo = null;
}


/* =========================
   SAVE TICKET
========================= */

async function saveTicket(event) {

    event.preventDefault();


    const ticket = {

        reservationID:
            document.getElementById(
                "ticketReservation"
            ).value,

        ticketNo:
            document.getElementById(
                "ticketNo"
            ).value.trim(),

        seatNo:
            document.getElementById(
                "ticketSeatNo"
            ).value.trim(),

        fare:
            Number(
                document.getElementById(
                    "ticketFare"
                ).value
            )
    };


    const button =
        document.getElementById(
            "ticket-save-btn"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        if (
            editingTicketReservationID &&
            editingTicketNo
        ) {

            await fetchData(
                `/tickets/${encodeURIComponent(
                    editingTicketReservationID
                )}/${encodeURIComponent(
                    editingTicketNo
                )}`,
                {
                    method: "PUT",
                    body: JSON.stringify(ticket)
                }
            );


            showToast(
                "Ticket updated successfully.",
                "success"
            );


        } else {

            await fetchData(
                "/tickets",
                {
                    method: "POST",
                    body: JSON.stringify(ticket)
                }
            );


            showToast(
                "Ticket added successfully.",
                "success"
            );
        }


        closeTicketModal();

        await loadTickets();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Ticket save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            editingTicketReservationID
                ? "Update Ticket"
                : "Save Ticket";
    }
}


/* =========================
   DELETE TICKET
========================= */

async function deleteTicket(
    reservationID,
    ticketNo
) {

    const confirmed =
        confirm(
            `Are you sure you want to delete ticket "${ticketNo}" from reservation "${reservationID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(
            `/tickets/${encodeURIComponent(
                reservationID
            )}/${encodeURIComponent(
                ticketNo
            )}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Ticket deleted successfully.",
            "success"
        );


        await loadTickets();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Ticket delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}
/* =========================================================
   BAGGAGE
========================================================= */


/* =========================
   LOAD BAGGAGE
========================= */

async function loadBaggage() {

    const container =
        document.getElementById(
            "baggage-table-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading baggage...
        </div>
    `;


    try {

        baggage =
            await fetchData("/baggage");


        renderBaggageTable(baggage);


    } catch (error) {

        console.error(
            "Baggage loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load baggage
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadBaggage()">
                    Try Again
                </button>

            </div>
        `;
    }
}


/* =========================
   BAGGAGE TABLE
========================= */

function renderBaggageTable(data) {

    const container =
        document.getElementById(
            "baggage-table-container"
        );


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🧳
                </div>

                <h3>
                    No baggage found
                </h3>

                <p>
                    Add a baggage record to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(item => {

        rows += `
            <tr>

                <td>

                    <span class="id-badge">
                        ${escapeHtml(
                            item.baggageID
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHtml(
                        item.noOfPieces
                    )}
                </td>


                <td>
                    ${Number(
                        item.weight
                    ).toFixed(2)} kg
                </td>


                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditBaggage('${escapeAttribute(item.baggageID)}')">
                        ✎
                    </button>


                    <button
                        class="table-action delete-action"
                        onclick="deleteBaggage('${escapeAttribute(item.baggageID)}')">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Baggage ID</th>
                        <th>No. of Pieces</th>
                        <th>Weight</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            baggage record${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* =========================
   SEARCH
========================= */

function filterBaggage() {

    const search =
        document.getElementById(
            "baggage-search"
        ).value
        .toLowerCase()
        .trim();


    if (!search) {

        renderBaggageTable(baggage);

        return;
    }


    const filtered =
        baggage.filter(item =>

            String(
                item.baggageID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                item.noOfPieces
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                item.weight
            )
            .toLowerCase()
            .includes(search)

        );


    renderBaggageTable(filtered);
}


/* =========================
   ADD BAGGAGE
========================= */

function openBaggageModal() {

    editingBaggageID = null;


    document.getElementById(
        "baggage-modal-title"
    ).textContent =
        "Add Baggage";


    document.getElementById(
        "baggage-modal-subtitle"
    ).textContent =
        "Enter baggage details";


    document.getElementById(
        "baggage-save-btn"
    ).textContent =
        "Save Baggage";


    document.getElementById(
        "baggage-form"
    ).reset();


    document.getElementById(
        "baggageID"
    ).disabled = false;


    document.getElementById(
        "baggage-modal"
    ).classList.add("show");
}


/* =========================
   EDIT BAGGAGE
========================= */

function openEditBaggage(baggageID) {

    const item =
        baggage.find(
            b =>
                b.baggageID ===
                baggageID
        );


    if (!item) {

        showToast(
            "Baggage record not found.",
            "error"
        );

        return;
    }


    editingBaggageID =
        baggageID;


    document.getElementById(
        "baggage-modal-title"
    ).textContent =
        "Edit Baggage";


    document.getElementById(
        "baggage-modal-subtitle"
    ).textContent =
        "Update baggage details";


    document.getElementById(
        "baggage-save-btn"
    ).textContent =
        "Update Baggage";


    document.getElementById(
        "baggageID"
    ).value =
        item.baggageID;


    document.getElementById(
        "baggagePieces"
    ).value =
        item.noOfPieces;


    document.getElementById(
        "baggageWeight"
    ).value =
        item.weight;


    document.getElementById(
        "baggageID"
    ).disabled = true;


    document.getElementById(
        "baggage-modal"
    ).classList.add("show");
}


/* =========================
   CLOSE MODAL
========================= */

function closeBaggageModal() {

    document.getElementById(
        "baggage-modal"
    ).classList.remove("show");


    editingBaggageID = null;
}


/* =========================
   SAVE BAGGAGE
========================= */

async function saveBaggage(event) {

    event.preventDefault();


    const item = {

        baggageID:
            document.getElementById(
                "baggageID"
            ).value.trim(),

        noOfPieces:
            Number(
                document.getElementById(
                    "baggagePieces"
                ).value
            ),

        weight:
            Number(
                document.getElementById(
                    "baggageWeight"
                ).value
            )
    };


    const button =
        document.getElementById(
            "baggage-save-btn"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        if (editingBaggageID) {

            await fetchData(
                `/baggage/${encodeURIComponent(
                    editingBaggageID
                )}`,
                {
                    method: "PUT",
                    body: JSON.stringify(item)
                }
            );


            showToast(
                "Baggage updated successfully.",
                "success"
            );


        } else {

            await fetchData(
                "/baggage",
                {
                    method: "POST",
                    body: JSON.stringify(item)
                }
            );


            showToast(
                "Baggage added successfully.",
                "success"
            );
        }


        closeBaggageModal();

        await loadBaggage();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Baggage save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            editingBaggageID
                ? "Update Baggage"
                : "Save Baggage";
    }
}


/* =========================
   DELETE BAGGAGE
========================= */

async function deleteBaggage(baggageID) {

    const confirmed =
        confirm(
            `Are you sure you want to delete baggage "${baggageID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(
            `/baggage/${encodeURIComponent(
                baggageID
            )}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Baggage deleted successfully.",
            "success"
        );


        await loadBaggage();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Baggage delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}
/* =========================================================
   PAYMENTS
========================================================= */


/* =========================
   LOAD PAYMENTS
========================= */

async function loadPayments() {

    const container =
        document.getElementById(
            "payment-table-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading payments...
        </div>
    `;


    try {

        payments =
            await fetchData("/payments");


        renderPaymentTable(payments);


    } catch (error) {

        console.error(
            "Payment loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load payments
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadPayments()">
                    Try Again
                </button>

            </div>
        `;
    }
}


/* =========================
   PAYMENT TABLE
========================= */

function renderPaymentTable(data) {

    const container =
        document.getElementById(
            "payment-table-container"
        );


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    💳
                </div>

                <h3>
                    No payments found
                </h3>

                <p>
                    Add a payment record to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(payment => {

        rows += `
            <tr>

                <td>
                    <span class="id-badge">
                        ${escapeHtml(
                            payment.paymentID
                        )}
                    </span>
                </td>


                <td>
                    ${escapeHtml(
                        payment.reservationID
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        payment.ticketNo
                    )}
                </td>


                <td>
                    ₹${Number(
                        payment.amount
                    ).toFixed(2)}
                </td>


                <td>
                    ${escapeHtml(
                        payment.paymentMethod
                    )}
                </td>


                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditPayment('${escapeAttribute(payment.paymentID)}')">
                        ✎
                    </button>


                    <button
                        class="table-action delete-action"
                        onclick="deletePayment('${escapeAttribute(payment.paymentID)}')">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Payment ID</th>
                        <th>Reservation</th>
                        <th>Ticket</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            payment${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* =========================
   SEARCH
========================= */

function filterPayments() {

    const search =
        document.getElementById(
            "payment-search"
        )
        .value
        .toLowerCase()
        .trim();


    if (!search) {

        renderPaymentTable(payments);

        return;
    }


    const filtered =
        payments.filter(payment =>

            String(
                payment.paymentID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                payment.reservationID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                payment.ticketNo
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                payment.amount
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                payment.paymentMethod
            )
            .toLowerCase()
            .includes(search)

        );


    renderPaymentTable(filtered);
}


/* =========================
   LOAD TICKET OPTIONS
========================= */

async function loadPaymentOptions() {

    try {

        paymentTickets =
            await fetchData("/tickets");


        populatePaymentReservationDropdown();


    } catch (error) {

        console.error(
            "Payment options error:",
            error
        );


        showToast(
            "Unable to load ticket options.",
            "error"
        );
    }
}


/* =========================
   RESERVATION DROPDOWN
========================= */

function populatePaymentReservationDropdown() {

    const select =
        document.getElementById(
            "paymentReservation"
        );


    if (!select) {
        return;
    }


    const reservationIDs =
        [
            ...new Set(
                paymentTickets.map(
                    ticket =>
                        ticket.reservationID
                )
            )
        ];


    select.innerHTML = `
        <option value="">
            Select reservation
        </option>
    `;


    reservationIDs.forEach(id => {

        select.innerHTML += `
            <option value="${escapeAttribute(id)}">
                ${escapeHtml(id)}
            </option>
        `;
    });
}


/* =========================
   TICKET DROPDOWN
========================= */

function updatePaymentTicketDropdown(
    selectedTicket = ""
) {

    const reservationID =
        document.getElementById(
            "paymentReservation"
        ).value;


    const ticketSelect =
        document.getElementById(
            "paymentTicket"
        );


    ticketSelect.innerHTML = `
        <option value="">
            Select ticket
        </option>
    `;


    if (!reservationID) {
        return;
    }


    const matchingTickets =
        paymentTickets.filter(
            ticket =>
                ticket.reservationID ===
                reservationID
        );


    matchingTickets.forEach(ticket => {

        const selected =
            ticket.ticketNo ===
            selectedTicket
                ? "selected"
                : "";


        ticketSelect.innerHTML += `
            <option
                value="${escapeAttribute(ticket.ticketNo)}"
                ${selected}>
                ${escapeHtml(ticket.ticketNo)}
            </option>
        `;
    });
}


/* =========================
   OPEN ADD MODAL
========================= */

async function openPaymentModal() {

    editingPaymentID = null;


    document.getElementById(
        "payment-modal-title"
    ).textContent =
        "Add Payment";


    document.getElementById(
        "payment-modal-subtitle"
    ).textContent =
        "Enter payment details";


    document.getElementById(
        "payment-save-btn"
    ).textContent =
        "Save Payment";


    document.getElementById(
        "payment-form"
    ).reset();


    document.getElementById(
        "paymentID"
    ).disabled = false;


    await loadPaymentOptions();


    document.getElementById(
        "payment-modal"
    ).classList.add("show");
}


/* =========================
   OPEN EDIT MODAL
========================= */

async function openEditPayment(paymentID) {

    const payment =
        payments.find(
            p =>
                p.paymentID ===
                paymentID
        );


    if (!payment) {

        showToast(
            "Payment record not found.",
            "error"
        );

        return;
    }


    editingPaymentID =
        paymentID;


    document.getElementById(
        "payment-modal-title"
    ).textContent =
        "Edit Payment";


    document.getElementById(
        "payment-modal-subtitle"
    ).textContent =
        "Update payment details";


    document.getElementById(
        "payment-save-btn"
    ).textContent =
        "Update Payment";


    document.getElementById(
        "paymentID"
    ).value =
        payment.paymentID;


    document.getElementById(
        "paymentID"
    ).disabled = true;


    await loadPaymentOptions();


    document.getElementById(
        "paymentReservation"
    ).value =
        payment.reservationID;


    updatePaymentTicketDropdown(
        payment.ticketNo
    );


    document.getElementById(
        "paymentAmount"
    ).value =
        payment.amount;


    document.getElementById(
        "paymentMethod"
    ).value =
        payment.paymentMethod;


    document.getElementById(
        "payment-modal"
    ).classList.add("show");
}


/* =========================
   CLOSE MODAL
========================= */

function closePaymentModal() {

    document.getElementById(
        "payment-modal"
    ).classList.remove("show");


    editingPaymentID = null;
}


/* =========================
   SAVE PAYMENT
========================= */

async function savePayment(event) {

    event.preventDefault();


    const payment = {

        paymentID:
            document.getElementById(
                "paymentID"
            ).value.trim(),

        reservationID:
            document.getElementById(
                "paymentReservation"
            ).value,

        ticketNo:
            document.getElementById(
                "paymentTicket"
            ).value,

        amount:
            Number(
                document.getElementById(
                    "paymentAmount"
                ).value
            ),

        paymentMethod:
            document.getElementById(
                "paymentMethod"
            ).value
    };


    const button =
        document.getElementById(
            "payment-save-btn"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        if (editingPaymentID) {

            await fetchData(
                `/payments/${encodeURIComponent(
                    editingPaymentID
                )}`,
                {
                    method: "PUT",
                    body: JSON.stringify(payment)
                }
            );


            showToast(
                "Payment updated successfully.",
                "success"
            );


        } else {

            await fetchData(
                "/payments",
                {
                    method: "POST",
                    body: JSON.stringify(payment)
                }
            );


            showToast(
                "Payment added successfully.",
                "success"
            );
        }


        closePaymentModal();

        await loadPayments();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Payment save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            editingPaymentID
                ? "Update Payment"
                : "Save Payment";
    }
}


/* =========================
   DELETE PAYMENT
========================= */

async function deletePayment(paymentID) {

    const confirmed =
        confirm(
            `Are you sure you want to delete payment "${paymentID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(
            `/payments/${encodeURIComponent(
                paymentID
            )}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Payment deleted successfully.",
            "success"
        );


        await loadPayments();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Payment delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}
/* =========================================================
   AIRPORTS
========================================================= */


/* =========================
   LOAD AIRPORTS
========================= */

async function loadAirports() {

    const container =
        document.getElementById(
            "airport-table-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading airports...
        </div>
    `;


    try {

        airports =
            await fetchData("/airports");


        renderAirportTable(airports);


    } catch (error) {

        console.error(
            "Airport loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load airports
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadAirports()">
                    Try Again
                </button>

            </div>
        `;
    }
}


/* =========================
   AIRPORT TABLE
========================= */

function renderAirportTable(data) {

    const container =
        document.getElementById(
            "airport-table-container"
        );


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ✈️
                </div>

                <h3>
                    No airports found
                </h3>

                <p>
                    Add an airport record to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(airport => {

        rows += `
            <tr>

                <td>

                    <span class="id-badge">
                        ${escapeHtml(
                            airport.airportID
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHtml(
                        airport.airportName
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        airport.city
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        airport.country
                    )}
                </td>


                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditAirport('${escapeAttribute(airport.airportID)}')">
                        ✎
                    </button>


                    <button
                        class="table-action delete-action"
                        onclick="deleteAirport('${escapeAttribute(airport.airportID)}')">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Airport ID</th>
                        <th>Airport Name</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            airport${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* =========================
   SEARCH
========================= */

function filterAirports() {

    const search =
        document.getElementById(
            "airport-search"
        )
        .value
        .toLowerCase()
        .trim();


    if (!search) {

        renderAirportTable(airports);

        return;
    }


    const filtered =
        airports.filter(airport =>

            String(
                airport.airportID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                airport.airportName
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                airport.city
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                airport.country
            )
            .toLowerCase()
            .includes(search)

        );


    renderAirportTable(filtered);
}


/* =========================
   OPEN ADD MODAL
========================= */

function openAirportModal() {

    editingAirportID = null;


    document.getElementById(
        "airport-modal-title"
    ).textContent =
        "Add Airport";


    document.getElementById(
        "airport-modal-subtitle"
    ).textContent =
        "Enter airport details";


    document.getElementById(
        "airport-save-btn"
    ).textContent =
        "Save Airport";


    document.getElementById(
        "airport-form"
    ).reset();


    document.getElementById(
        "airportID"
    ).disabled = false;


    document.getElementById(
        "airport-modal"
    ).classList.add("show");
}


/* =========================
   OPEN EDIT MODAL
========================= */

function openEditAirport(airportID) {

    const airport =
        airports.find(
            a =>
                a.airportID ===
                airportID
        );


    if (!airport) {

        showToast(
            "Airport record not found.",
            "error"
        );

        return;
    }


    editingAirportID =
        airportID;


    document.getElementById(
        "airport-modal-title"
    ).textContent =
        "Edit Airport";


    document.getElementById(
        "airport-modal-subtitle"
    ).textContent =
        "Update airport details";


    document.getElementById(
        "airport-save-btn"
    ).textContent =
        "Update Airport";


    document.getElementById(
        "airportID"
    ).value =
        airport.airportID;


    document.getElementById(
        "airportName"
    ).value =
        airport.airportName;


    document.getElementById(
        "airportCity"
    ).value =
        airport.city;


    document.getElementById(
        "airportCountry"
    ).value =
        airport.country;


    document.getElementById(
        "airportID"
    ).disabled = true;


    document.getElementById(
        "airport-modal"
    ).classList.add("show");
}


/* =========================
   CLOSE MODAL
========================= */

function closeAirportModal() {

    document.getElementById(
        "airport-modal"
    ).classList.remove("show");


    editingAirportID = null;
}


/* =========================
   SAVE AIRPORT
========================= */

async function saveAirport(event) {

    event.preventDefault();


    const airport = {

        airportID:
            document.getElementById(
                "airportID"
            ).value.trim(),

        airportName:
            document.getElementById(
                "airportName"
            ).value.trim(),

        city:
            document.getElementById(
                "airportCity"
            ).value.trim(),

        country:
            document.getElementById(
                "airportCountry"
            ).value.trim()
    };


    const button =
        document.getElementById(
            "airport-save-btn"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        if (editingAirportID) {

            await fetchData(
                `/airports/${encodeURIComponent(
                    editingAirportID
                )}`,
                {
                    method: "PUT",
                    body: JSON.stringify(airport)
                }
            );


            showToast(
                "Airport updated successfully.",
                "success"
            );


        } else {

            await fetchData(
                "/airports",
                {
                    method: "POST",
                    body: JSON.stringify(airport)
                }
            );


            showToast(
                "Airport added successfully.",
                "success"
            );
        }


        closeAirportModal();

        await loadAirports();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Airport save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            editingAirportID
                ? "Update Airport"
                : "Save Airport";
    }
}


/* =========================
   DELETE AIRPORT
========================= */

async function deleteAirport(airportID) {

    const confirmed =
        confirm(
            `Are you sure you want to delete airport "${airportID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(
            `/airports/${encodeURIComponent(
                airportID
            )}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Airport deleted successfully.",
            "success"
        );


        await loadAirports();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Airport delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}
/* =========================================================
   AIRLINES
========================================================= */


/* =========================
   LOAD AIRLINES
========================= */

async function loadAirlines() {

    const container =
        document.getElementById(
            "airline-table-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading airlines...
        </div>
    `;


    try {

        airlines =
            await fetchData("/airlines");


        renderAirlineTable(airlines);


    } catch (error) {

        console.error(
            "Airline loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load airlines
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadAirlines()">
                    Try Again
                </button>

            </div>
        `;
    }
}


/* =========================
   AIRLINE TABLE
========================= */

function renderAirlineTable(data) {

    const container =
        document.getElementById(
            "airline-table-container"
        );


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ✈️
                </div>

                <h3>
                    No airlines found
                </h3>

                <p>
                    Add an airline record to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(airline => {

        rows += `
            <tr>

                <td>

                    <span class="id-badge">
                        ${escapeHtml(
                            airline.airlineID
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHtml(
                        airline.airlineName
                    )}
                </td>


                <td>

                    <span class="code-badge">
                        ${escapeHtml(
                            airline.iataCode
                        )}
                    </span>

                </td>


                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditAirline('${escapeAttribute(airline.airlineID)}')">
                        ✎
                    </button>


                    <button
                        class="table-action delete-action"
                        onclick="deleteAirline('${escapeAttribute(airline.airlineID)}')">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Airline ID</th>
                        <th>Airline Name</th>
                        <th>IATA Code</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            airline${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* =========================
   SEARCH
========================= */

function filterAirlines() {

    const search =
        document.getElementById(
            "airline-search"
        )
        .value
        .toLowerCase()
        .trim();


    if (!search) {

        renderAirlineTable(airlines);

        return;
    }


    const filtered =
        airlines.filter(airline =>

            String(
                airline.airlineID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                airline.airlineName
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                airline.iataCode
            )
            .toLowerCase()
            .includes(search)

        );


    renderAirlineTable(filtered);
}


/* =========================
   OPEN ADD MODAL
========================= */

function openAirlineModal() {

    editingAirlineID = null;


    document.getElementById(
        "airline-modal-title"
    ).textContent =
        "Add Airline";


    document.getElementById(
        "airline-modal-subtitle"
    ).textContent =
        "Enter airline details";


    document.getElementById(
        "airline-save-btn"
    ).textContent =
        "Save Airline";


    document.getElementById(
        "airline-form"
    ).reset();


    document.getElementById(
        "airlineID"
    ).disabled = false;


    document.getElementById(
        "airline-modal"
    ).classList.add("show");
}


/* =========================
   OPEN EDIT MODAL
========================= */

function openEditAirline(airlineID) {

    const airline =
        airlines.find(
            a =>
                a.airlineID ===
                airlineID
        );


    if (!airline) {

        showToast(
            "Airline record not found.",
            "error"
        );

        return;
    }


    editingAirlineID =
        airlineID;


    document.getElementById(
        "airline-modal-title"
    ).textContent =
        "Edit Airline";


    document.getElementById(
        "airline-modal-subtitle"
    ).textContent =
        "Update airline details";


    document.getElementById(
        "airline-save-btn"
    ).textContent =
        "Update Airline";


    document.getElementById(
        "airlineID"
    ).value =
        airline.airlineID;


    document.getElementById(
        "airlineName"
    ).value =
        airline.airlineName;


    document.getElementById(
        "airlineIATA"
    ).value =
        airline.iataCode;


    document.getElementById(
        "airlineID"
    ).disabled = true;


    document.getElementById(
        "airline-modal"
    ).classList.add("show");
}


/* =========================
   CLOSE MODAL
========================= */

function closeAirlineModal() {

    document.getElementById(
        "airline-modal"
    ).classList.remove("show");


    editingAirlineID = null;
}


/* =========================
   SAVE AIRLINE
========================= */

async function saveAirline(event) {

    event.preventDefault();


    const airline = {

        airlineID:
            document.getElementById(
                "airlineID"
            ).value.trim(),

        airlineName:
            document.getElementById(
                "airlineName"
            ).value.trim(),

        iataCode:
            document.getElementById(
                "airlineIATA"
            ).value.trim()
    };


    const button =
        document.getElementById(
            "airline-save-btn"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        if (editingAirlineID) {

            await fetchData(
                `/airlines/${encodeURIComponent(
                    editingAirlineID
                )}`,
                {
                    method: "PUT",
                    body: JSON.stringify(airline)
                }
            );


            showToast(
                "Airline updated successfully.",
                "success"
            );


        } else {

            await fetchData(
                "/airlines",
                {
                    method: "POST",
                    body: JSON.stringify(airline)
                }
            );


            showToast(
                "Airline added successfully.",
                "success"
            );
        }


        closeAirlineModal();

        await loadAirlines();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Airline save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            editingAirlineID
                ? "Update Airline"
                : "Save Airline";
    }
}


/* =========================
   DELETE AIRLINE
========================= */

async function deleteAirline(airlineID) {

    const confirmed =
        confirm(
            `Are you sure you want to delete airline "${airlineID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(
            `/airlines/${encodeURIComponent(
                airlineID
            )}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Airline deleted successfully.",
            "success"
        );


        await loadAirlines();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Airline delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}
/* =========================================================
   EMPLOYEES
========================================================= */


/* =========================
   LOAD EMPLOYEES
========================= */

async function loadEmployees() {

    const container =
        document.getElementById(
            "employee-table-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading employees...
        </div>
    `;


    try {

        employees =
            await fetchData("/employees");


        renderEmployeeTable(employees);


    } catch (error) {

        console.error(
            "Employee loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load employees
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadEmployees()">
                    Try Again
                </button>

            </div>
        `;
    }
}


/* =========================
   EMPLOYEE TABLE
========================= */

function renderEmployeeTable(data) {

    const container =
        document.getElementById(
            "employee-table-container"
        );


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    👨‍✈️
                </div>

                <h3>
                    No employees found
                </h3>

                <p>
                    Add an employee record to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(employee => {

        rows += `
            <tr>

                <td>

                    <span class="id-badge">
                        ${escapeHtml(
                            employee.employeeID
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHtml(
                        employee.name
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        employee.designation
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        employee.phone
                    )}
                </td>


                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditEmployee('${escapeAttribute(employee.employeeID)}')">
                        ✎
                    </button>


                    <button
                        class="table-action delete-action"
                        onclick="deleteEmployee('${escapeAttribute(employee.employeeID)}')">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Phone</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            employee${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* =========================
   SEARCH
========================= */

function filterEmployees() {

    const search =
        document.getElementById(
            "employee-search"
        )
        .value
        .toLowerCase()
        .trim();


    if (!search) {

        renderEmployeeTable(employees);

        return;
    }


    const filtered =
        employees.filter(employee =>

            String(
                employee.employeeID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                employee.name
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                employee.designation
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                employee.phone
            )
            .toLowerCase()
            .includes(search)

        );


    renderEmployeeTable(filtered);
}


/* =========================
   OPEN ADD MODAL
========================= */

function openEmployeeModal() {

    editingEmployeeID = null;


    document.getElementById(
        "employee-modal-title"
    ).textContent =
        "Add Employee";


    document.getElementById(
        "employee-modal-subtitle"
    ).textContent =
        "Enter employee details";


    document.getElementById(
        "employee-save-btn"
    ).textContent =
        "Save Employee";


    document.getElementById(
        "employee-form"
    ).reset();


    document.getElementById(
        "employeeID"
    ).disabled = false;


    document.getElementById(
        "employee-modal"
    ).classList.add("show");
}


/* =========================
   OPEN EDIT MODAL
========================= */

function openEditEmployee(employeeID) {

    const employee =
        employees.find(
            e =>
                e.employeeID ===
                employeeID
        );


    if (!employee) {

        showToast(
            "Employee record not found.",
            "error"
        );

        return;
    }


    editingEmployeeID =
        employeeID;


    document.getElementById(
        "employee-modal-title"
    ).textContent =
        "Edit Employee";


    document.getElementById(
        "employee-modal-subtitle"
    ).textContent =
        "Update employee details";


    document.getElementById(
        "employee-save-btn"
    ).textContent =
        "Update Employee";


    document.getElementById(
        "employeeID"
    ).value =
        employee.employeeID;


    document.getElementById(
        "employeeName"
    ).value =
        employee.name;


    document.getElementById(
        "employeeDesignation"
    ).value =
        employee.designation;


    document.getElementById(
        "employeePhone"
    ).value =
        employee.phone;


    document.getElementById(
        "employeeID"
    ).disabled = true;


    document.getElementById(
        "employee-modal"
    ).classList.add("show");
}


/* =========================
   CLOSE MODAL
========================= */

function closeEmployeeModal() {

    document.getElementById(
        "employee-modal"
    ).classList.remove("show");


    editingEmployeeID = null;
}


/* =========================
   SAVE EMPLOYEE
========================= */

async function saveEmployee(event) {

    event.preventDefault();


    const employee = {

        employeeID:
            document.getElementById(
                "employeeID"
            ).value.trim(),

        name:
            document.getElementById(
                "employeeName"
            ).value.trim(),

        designation:
            document.getElementById(
                "employeeDesignation"
            ).value.trim(),

        phone:
            document.getElementById(
                "employeePhone"
            ).value.trim()
    };


    const button =
        document.getElementById(
            "employee-save-btn"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        if (editingEmployeeID) {

            await fetchData(
                `/employees/${encodeURIComponent(
                    editingEmployeeID
                )}`,
                {
                    method: "PUT",
                    body: JSON.stringify(employee)
                }
            );


            showToast(
                "Employee updated successfully.",
                "success"
            );


        } else {

            await fetchData(
                "/employees",
                {
                    method: "POST",
                    body: JSON.stringify(employee)
                }
            );


            showToast(
                "Employee added successfully.",
                "success"
            );
        }


        closeEmployeeModal();

        await loadEmployees();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Employee save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            editingEmployeeID
                ? "Update Employee"
                : "Save Employee";
    }
}


/* =========================
   DELETE EMPLOYEE
========================= */

async function deleteEmployee(employeeID) {

    const confirmed =
        confirm(
            `Are you sure you want to delete employee "${employeeID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(
            `/employees/${encodeURIComponent(
                employeeID
            )}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Employee deleted successfully.",
            "success"
        );


        await loadEmployees();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Employee delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}
/* =========================================================
   BAGGAGE TRACKING
========================================================= */


/* =========================
   LOAD TRACKING RECORDS
========================= */

async function loadBaggageTracking() {

    const container =
        document.getElementById(
            "baggage-tracking-table-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `
        <div class="loading-state">
            Loading baggage tracking...
        </div>
    `;


    try {

        baggageTracking =
            await fetchData(
                "/baggage-tracking"
            );


        renderBaggageTrackingTable(
            baggageTracking
        );


    } catch (error) {

        console.error(
            "Baggage tracking loading error:",
            error
        );


        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load baggage tracking
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadBaggageTracking()">

                    Try Again

                </button>

            </div>
        `;
    }
}


/* =========================
   RENDER TABLE
========================= */

function renderBaggageTrackingTable(data) {

    const container =
        document.getElementById(
            "baggage-tracking-table-container"
        );


    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    📍
                </div>

                <h3>
                    No tracking records found
                </h3>

                <p>
                    Add a baggage scan to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(record => {

        rows += `
            <tr>

                <td>

                    <span class="id-badge">
                        ${escapeHtml(
                            record.baggageID
                        )}
                    </span>

                </td>


                <td>

                    <span class="id-badge">
                        ${escapeHtml(
                            record.trackingID
                        )}
                    </span>

                </td>


                <td>
                    ${escapeHtml(
                        record.scanLocation
                    )}
                </td>


                <td>
                    ${escapeHtml(
                        formatTrackingTime(
                            record.scanTime
                        )
                    )}
                </td>


                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditBaggageTracking(
                            '${escapeAttribute(record.baggageID)}',
                            '${escapeAttribute(record.trackingID)}'
                        )">

                        ✎

                    </button>


                    <button
                        class="table-action delete-action"
                        onclick="deleteBaggageTracking(
                            '${escapeAttribute(record.baggageID)}',
                            '${escapeAttribute(record.trackingID)}'
                        )">

                        🗑

                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Baggage ID</th>
                        <th>Tracking ID</th>
                        <th>Scan Location</th>
                        <th>Scan Time</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            tracking record${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* =========================
   FORMAT TIME
========================= */

function formatTrackingTime(time) {

    if (!time) {
        return "";
    }


    return String(time).substring(0, 5);
}


/* =========================
   SEARCH
========================= */

function filterBaggageTracking() {

    const search =
        document.getElementById(
            "baggage-tracking-search"
        )
        .value
        .toLowerCase()
        .trim();


    if (!search) {

        renderBaggageTrackingTable(
            baggageTracking
        );

        return;
    }


    const filtered =
        baggageTracking.filter(record =>

            String(
                record.baggageID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                record.trackingID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                record.scanLocation
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                record.scanTime
            )
            .toLowerCase()
            .includes(search)

        );


    renderBaggageTrackingTable(
        filtered
    );
}


/* =========================
   LOAD BAGGAGE OPTIONS
========================= */

async function loadBaggageTrackingOptions() {

    try {

        baggageTrackingOptions =
            await fetchData(
                "/baggage"
            );


        populateTrackingBaggageDropdown();


    } catch (error) {

        console.error(
            "Baggage options error:",
            error
        );


        showToast(
            "Unable to load baggage options.",
            "error"
        );
    }
}


/* =========================
   BAGGAGE DROPDOWN
========================= */

function populateTrackingBaggageDropdown() {

    const select =
        document.getElementById(
            "trackingBaggageID"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select baggage
        </option>
    `;


    baggageTrackingOptions.forEach(
        item => {

            select.innerHTML += `
                <option
                    value="${escapeAttribute(
                        item.baggageID
                    )}">

                    ${escapeHtml(
                        item.baggageID
                    )}

                </option>
            `;
        }
    );
}


/* =========================
   OPEN ADD MODAL
========================= */

async function openBaggageTrackingModal() {

    editingTrackingBaggageID = null;
    editingTrackingID = null;


    document.getElementById(
        "baggage-tracking-modal-title"
    ).textContent =
        "Add Tracking Scan";


    document.getElementById(
        "baggage-tracking-modal-subtitle"
    ).textContent =
        "Record a baggage scan";


    document.getElementById(
        "baggage-tracking-save-btn"
    ).textContent =
        "Save Scan";


    document.getElementById(
        "baggage-tracking-form"
    ).reset();


    document.getElementById(
        "trackingBaggageID"
    ).disabled = false;


    document.getElementById(
        "trackingID"
    ).disabled = false;


    await loadBaggageTrackingOptions();


    document.getElementById(
        "baggage-tracking-modal"
    ).classList.add("show");
}


/* =========================
   OPEN EDIT MODAL
========================= */

async function openEditBaggageTracking(
    baggageID,
    trackingID
) {

    const record =
        baggageTracking.find(
            item =>
                item.baggageID ===
                    baggageID &&
                item.trackingID ===
                    trackingID
        );


    if (!record) {

        showToast(
            "Tracking record not found.",
            "error"
        );

        return;
    }


    editingTrackingBaggageID =
        baggageID;

    editingTrackingID =
        trackingID;


    document.getElementById(
        "baggage-tracking-modal-title"
    ).textContent =
        "Edit Tracking Scan";


    document.getElementById(
        "baggage-tracking-modal-subtitle"
    ).textContent =
        "Update baggage scan details";


    document.getElementById(
        "baggage-tracking-save-btn"
    ).textContent =
        "Update Scan";


    await loadBaggageTrackingOptions();


    document.getElementById(
        "trackingBaggageID"
    ).value =
        record.baggageID;


    document.getElementById(
        "trackingID"
    ).value =
        record.trackingID;


    document.getElementById(
        "scanLocation"
    ).value =
        record.scanLocation;


    document.getElementById(
        "scanTime"
    ).value =
        formatTrackingTime(
            record.scanTime
        );


    document.getElementById(
        "trackingBaggageID"
    ).disabled = true;


    document.getElementById(
        "trackingID"
    ).disabled = true;


    document.getElementById(
        "baggage-tracking-modal"
    ).classList.add("show");
}


/* =========================
   CLOSE MODAL
========================= */

function closeBaggageTrackingModal() {

    document.getElementById(
        "baggage-tracking-modal"
    ).classList.remove("show");


    editingTrackingBaggageID = null;
    editingTrackingID = null;
}


/* =========================
   SAVE TRACKING
========================= */

async function saveBaggageTracking(event) {

    event.preventDefault();


    const scanTime =
        document.getElementById(
            "scanTime"
        ).value;


    const tracking = {

        baggageID:
            document.getElementById(
                "trackingBaggageID"
            ).value,

        trackingID:
            document.getElementById(
                "trackingID"
            ).value.trim(),

        scanLocation:
            document.getElementById(
                "scanLocation"
            ).value.trim(),

        scanTime:
            scanTime + ":00"
    };


    const button =
        document.getElementById(
            "baggage-tracking-save-btn"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        if (
            editingTrackingBaggageID &&
            editingTrackingID
        ) {

            await fetchData(

                `/baggage-tracking/${encodeURIComponent(
                    editingTrackingBaggageID
                )}/${encodeURIComponent(
                    editingTrackingID
                )}`,

                {
                    method: "PUT",
                    body: JSON.stringify(tracking)
                }

            );


            showToast(
                "Tracking record updated successfully.",
                "success"
            );


        } else {

            await fetchData(

                "/baggage-tracking",

                {
                    method: "POST",
                    body: JSON.stringify(tracking)
                }

            );


            showToast(
                "Tracking scan added successfully.",
                "success"
            );
        }


        closeBaggageTrackingModal();

        await loadBaggageTracking();


    } catch (error) {

        console.error(
            "Tracking save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Save Scan";
    }
}


/* =========================
   DELETE TRACKING
========================= */

async function deleteBaggageTracking(
    baggageID,
    trackingID
) {

    const confirmed =
        confirm(
            `Are you sure you want to delete tracking record "${baggageID} / ${trackingID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(

            `/baggage-tracking/${encodeURIComponent(
                baggageID
            )}/${encodeURIComponent(
                trackingID
            )}`,

            {
                method: "DELETE"
            }

        );


        showToast(
            "Tracking record deleted successfully.",
            "success"
        );


        await loadBaggageTracking();


    } catch (error) {

        console.error(
            "Tracking delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}
/* =========================================================
   TICKET-BAGGAGE
========================================================= */


/* =========================
   LOAD TICKET-BAGGAGE
========================= */

async function loadTicketBaggage() {

    const container =
        document.getElementById(
            "ticket-baggage-table-container"
        );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="loading-state">
            Loading ticket-baggage assignments...
        </div>
    `;

    try {

        ticketBaggage =
            await fetchData("/ticket-baggage");

        renderTicketBaggageTable(ticketBaggage);

    } catch (error) {

        console.error(
            "Ticket-baggage loading error:",
            error
        );

        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load ticket-baggage assignments
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadTicketBaggage()">
                    Try Again
                </button>

            </div>
        `;
    }
}


/* =========================
   TICKET-BAGGAGE TABLE
========================= */

function renderTicketBaggageTable(data) {

    const container =
        document.getElementById(
            "ticket-baggage-table-container"
        );

    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🔗
                </div>

                <h3>
                    No baggage assignments found
                </h3>

                <p>
                    Assign baggage to a ticket to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(item => {

        rows += `
            <tr>

                <td>
                    <span class="id-badge">
                        ${escapeHtml(
                            item.reservationID
                        )}
                    </span>
                </td>

                <td>
                    <span class="id-badge">
                        ${escapeHtml(
                            item.ticketNo
                        )}
                    </span>
                </td>

                <td>
                    <span class="id-badge">
                        ${escapeHtml(
                            item.baggageID
                        )}
                    </span>
                </td>

                <td>
                    ${escapeHtml(
                        item.checkedInDate
                    )}
                </td>

                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditTicketBaggage(
                            '${escapeAttribute(item.reservationID)}',
                            '${escapeAttribute(item.ticketNo)}',
                            '${escapeAttribute(item.baggageID)}'
                        )">
                        ✎
                    </button>

                    <button
                        class="table-action delete-action"
                        onclick="deleteTicketBaggage(
                            '${escapeAttribute(item.reservationID)}',
                            '${escapeAttribute(item.ticketNo)}',
                            '${escapeAttribute(item.baggageID)}'
                        )">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>

                        <th>Reservation ID</th>
                        <th>Ticket No</th>
                        <th>Baggage ID</th>
                        <th>Checked-In Date</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>


        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            assignment${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* =========================
   SEARCH
========================= */

function filterTicketBaggage() {

    const search =
        document.getElementById(
            "ticket-baggage-search"
        ).value
        .toLowerCase()
        .trim();


    if (!search) {

        renderTicketBaggageTable(
            ticketBaggage
        );

        return;
    }


    const filtered =
        ticketBaggage.filter(item =>

            String(
                item.reservationID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                item.ticketNo
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                item.baggageID
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                item.checkedInDate
            )
            .toLowerCase()
            .includes(search)

        );


    renderTicketBaggageTable(filtered);
}


/* =========================
   LOAD FORM OPTIONS
========================= */

async function loadTicketBaggageOptions() {

    try {

        const [
            reservationData,
            baggageData
        ] = await Promise.all([

            fetchData("/reservations"),

            fetchData("/baggage")

        ]);


        reservations =
            reservationData;

        baggage =
            baggageData;


        populateTicketBaggageReservationDropdown();

        populateTicketBaggageBaggageDropdown();


    } catch (error) {

        console.error(
            "Ticket-baggage options error:",
            error
        );

        showToast(
            "Unable to load reservation or baggage data.",
            "error"
        );
    }
}


/* =========================
   RESERVATION DROPDOWN
========================= */

function populateTicketBaggageReservationDropdown() {

    const select =
        document.getElementById(
            "tbReservation"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select reservation
        </option>
    `;


    reservations.forEach(reservation => {

        const option =
            document.createElement("option");


        option.value =
            reservation.reservationID;


        option.textContent =
            `${reservation.reservationID} — ${reservation.passengerID} — ${reservation.bookingStatus}`;


        select.appendChild(option);

    });
}


/* =========================
   BAGGAGE DROPDOWN
========================= */

function populateTicketBaggageBaggageDropdown() {

    const select =
        document.getElementById(
            "tbBaggage"
        );


    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select baggage
        </option>
    `;


    baggage.forEach(item => {

        const option =
            document.createElement("option");


        option.value =
            item.baggageID;


        option.textContent =
            `${item.baggageID} — ${item.noOfPieces} piece(s) — ${item.weight} kg`;


        select.appendChild(option);

    });
}


/* =========================
   TICKET DROPDOWN
========================= */

async function updateTicketBaggageTicketDropdown(
    selectedTicket = ""
) {

    const reservationID =
        document.getElementById(
            "tbReservation"
        ).value;


    const ticketSelect =
        document.getElementById(
            "tbTicket"
        );


    ticketSelect.innerHTML = `
        <option value="">
            Select ticket
        </option>
    `;


    if (!reservationID) {
        return;
    }


    try {

        const ticketData =
            await fetchData("/tickets");


        const matchingTickets =
            ticketData.filter(ticket =>
                ticket.reservationID ===
                reservationID
            );


        matchingTickets.forEach(ticket => {

            const option =
                document.createElement("option");


            option.value =
                ticket.ticketNo;


            option.textContent =
                `${ticket.ticketNo} — Seat ${ticket.seatNo || "N/A"}`;


            if (
                ticket.ticketNo ===
                selectedTicket
            ) {
                option.selected = true;
            }


            ticketSelect.appendChild(option);

        });


        if (
            matchingTickets.length === 0
        ) {

            ticketSelect.innerHTML = `
                <option value="">
                    No tickets found
                </option>
            `;
        }


    } catch (error) {

        console.error(
            "Ticket dropdown error:",
            error
        );


        ticketSelect.innerHTML = `
            <option value="">
                Unable to load tickets
            </option>
        `;


        showToast(
            "Unable to load tickets.",
            "error"
        );
    }
}


/* =========================
   ADD TICKET-BAGGAGE
========================= */

async function openTicketBaggageModal() {

    editingTBReservationID = null;
    editingTBTicketNo = null;
    editingTBBaggageID = null;


    document.getElementById(
        "ticket-baggage-modal-title"
    ).textContent =
        "Assign Baggage";


    document.getElementById(
        "ticket-baggage-modal-subtitle"
    ).textContent =
        "Assign baggage to a ticket";


    document.getElementById(
        "ticket-baggage-save-btn"
    ).textContent =
        "Assign Baggage";


    document.getElementById(
        "ticket-baggage-form"
    ).reset();


    document.getElementById(
        "tbReservation"
    ).disabled = false;


    document.getElementById(
        "tbTicket"
    ).disabled = false;


    document.getElementById(
        "tbBaggage"
    ).disabled = false;


    document.getElementById(
        "tbTicket"
    ).innerHTML = `
        <option value="">
            Select ticket
        </option>
    `;


    document.getElementById(
        "ticket-baggage-modal"
    ).classList.add("show");


    await loadTicketBaggageOptions();
}


/* =========================
   EDIT TICKET-BAGGAGE
========================= */

async function openEditTicketBaggage(
    reservationID,
    ticketNo,
    baggageID
) {

    const item =
        ticketBaggage.find(record =>

            record.reservationID ===
            reservationID

            &&

            record.ticketNo ===
            ticketNo

            &&

            record.baggageID ===
            baggageID

        );


    if (!item) {

        showToast(
            "Ticket-baggage record not found.",
            "error"
        );

        return;
    }


    editingTBReservationID =
        reservationID;

    editingTBTicketNo =
        ticketNo;

    editingTBBaggageID =
        baggageID;


    document.getElementById(
        "ticket-baggage-modal-title"
    ).textContent =
        "Edit Assignment";


    document.getElementById(
        "ticket-baggage-modal-subtitle"
    ).textContent =
        "Update baggage assignment";


    document.getElementById(
        "ticket-baggage-save-btn"
    ).textContent =
        "Update Assignment";


    await loadTicketBaggageOptions();


    document.getElementById(
        "tbReservation"
    ).value =
        reservationID;


    await updateTicketBaggageTicketDropdown(
        ticketNo
    );


    document.getElementById(
        "tbBaggage"
    ).value =
        baggageID;


    document.getElementById(
        "tbCheckedInDate"
    ).value =
        item.checkedInDate;


    /*
     * Composite primary key:
     * ReservationID + TicketNo + BaggageID
     *
     * These values cannot be changed
     * during an edit.
     */

    document.getElementById(
        "tbReservation"
    ).disabled = true;


    document.getElementById(
        "tbTicket"
    ).disabled = true;


    document.getElementById(
        "tbBaggage"
    ).disabled = true;


    document.getElementById(
        "ticket-baggage-modal"
    ).classList.add("show");
}


/* =========================
   CLOSE MODAL
========================= */

function closeTicketBaggageModal() {

    document.getElementById(
        "ticket-baggage-modal"
    ).classList.remove("show");


    document.getElementById(
        "ticket-baggage-form"
    ).reset();


    document.getElementById(
        "tbReservation"
    ).disabled = false;


    document.getElementById(
        "tbTicket"
    ).disabled = false;


    document.getElementById(
        "tbBaggage"
    ).disabled = false;


    editingTBReservationID = null;
    editingTBTicketNo = null;
    editingTBBaggageID = null;
}


/* =========================
   SAVE TICKET-BAGGAGE
========================= */

async function saveTicketBaggage(event) {

    event.preventDefault();


    const item = {

        reservationID:
            document.getElementById(
                "tbReservation"
            ).value,

        ticketNo:
            document.getElementById(
                "tbTicket"
            ).value,

        baggageID:
            document.getElementById(
                "tbBaggage"
            ).value,

        checkedInDate:
            document.getElementById(
                "tbCheckedInDate"
            ).value

    };


    const button =
        document.getElementById(
            "ticket-baggage-save-btn"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        if (
            editingTBReservationID &&
            editingTBTicketNo &&
            editingTBBaggageID
        ) {

            await fetchData(

                `/ticket-baggage/` +

                `${encodeURIComponent(
                    editingTBReservationID
                )}/` +

                `${encodeURIComponent(
                    editingTBTicketNo
                )}/` +

                `${encodeURIComponent(
                    editingTBBaggageID
                )}`,

                {
                    method: "PUT",
                    body: JSON.stringify(item)
                }

            );


            showToast(
                "Baggage assignment updated successfully.",
                "success"
            );


        } else {

            await fetchData(
                "/ticket-baggage",
                {
                    method: "POST",
                    body: JSON.stringify(item)
                }
            );


            showToast(
                "Baggage assigned successfully.",
                "success"
            );
        }


        closeTicketBaggageModal();


        await loadTicketBaggage();


    } catch (error) {

        console.error(
            "Ticket-baggage save error:",
            error
        );


        showToast(
            error.message,
            "error"
        );


    } finally {

        button.disabled = false;


        button.textContent =
            editingTBReservationID
                ? "Update Assignment"
                : "Assign Baggage";
    }
}


/* =========================
   DELETE TICKET-BAGGAGE
========================= */

async function deleteTicketBaggage(
    reservationID,
    ticketNo,
    baggageID
) {

    const confirmed =
        confirm(
            `Are you sure you want to remove baggage "${baggageID}" from ticket "${ticketNo}" in reservation "${reservationID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(

            `/ticket-baggage/` +

            `${encodeURIComponent(
                reservationID
            )}/` +

            `${encodeURIComponent(
                ticketNo
            )}/` +

            `${encodeURIComponent(
                baggageID
            )}`,

            {
                method: "DELETE"
            }

        );


        showToast(
            "Baggage assignment deleted successfully.",
            "success"
        );


        await loadTicketBaggage();


    } catch (error) {

        console.error(
            "Ticket-baggage delete error:",
            error
        );


        showToast(
            error.message,
            "error"
        );
    }
}/* =========================================================
   PASSENGER PHONES
========================================================= */

async function loadPassengerPhones() {

    const container =
        document.getElementById(
            "passenger-phone-table-container"
        );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="loading-state">
            Loading passenger phones...
        </div>
    `;

    try {

        passengerPhones =
            await fetchData("/passenger-phones");

        renderPassengerPhoneTable(
            passengerPhones
        );

    } catch (error) {

        console.error(
            "Passenger phone loading error:",
            error
        );

        container.innerHTML = `
            <div class="error-state">

                <strong>
                    Unable to load passenger phones
                </strong>

                <p>
                    ${escapeHtml(error.message)}
                </p>

                <button
                    class="primary-btn"
                    onclick="loadPassengerPhones()">
                    Try Again
                </button>

            </div>
        `;
    }
}


/* ---------------------------------------------------------
   TABLE
--------------------------------------------------------- */

function renderPassengerPhoneTable(data) {

    const container =
        document.getElementById(
            "passenger-phone-table-container"
        );

    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ☎
                </div>

                <h3>
                    No passenger phones found
                </h3>

                <p>
                    Add a phone number to get started.
                </p>

            </div>
        `;

        return;
    }


    let rows = "";


    data.forEach(item => {

        rows += `
            <tr>

                <td>
                    <span class="id-badge">
                        ${escapeHtml(
                            item.passengerID
                        )}
                    </span>
                </td>

                <td>
                    <strong>
                        ${escapeHtml(
                            item.phone
                        )}
                    </strong>
                </td>

                <td class="actions-cell">

                    <button
                        class="table-action edit-action"
                        onclick="openEditPassengerPhone(
                            '${escapeAttribute(item.passengerID)}',
                            '${escapeAttribute(item.phone)}'
                        )">
                        ✎
                    </button>

                    <button
                        class="table-action delete-action"
                        onclick="deletePassengerPhone(
                            '${escapeAttribute(item.passengerID)}',
                            '${escapeAttribute(item.phone)}'
                        )">
                        🗑
                    </button>

                </td>

            </tr>
        `;
    });


    container.innerHTML = `

        <div class="table-wrapper">

            <table class="data-table">

                <thead>

                    <tr>
                        <th>Passenger ID</th>
                        <th>Phone Number</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>
                    ${rows}
                </tbody>

            </table>

        </div>

        <div class="table-footer">

            Showing
            <strong>${data.length}</strong>
            phone record${data.length === 1 ? "" : "s"}

        </div>
    `;
}


/* ---------------------------------------------------------
   SEARCH
--------------------------------------------------------- */

function filterPassengerPhones() {

    const search =
        document.getElementById(
            "passenger-phone-search"
        ).value
        .toLowerCase()
        .trim();


    if (!search) {

        renderPassengerPhoneTable(
            passengerPhones
        );

        return;
    }


    const filtered =
        passengerPhones.filter(item =>

            String(
                item.passengerID || ""
            )
            .toLowerCase()
            .includes(search)

            ||

            String(
                item.phone || ""
            )
            .toLowerCase()
            .includes(search)

        );


    renderPassengerPhoneTable(
        filtered
    );
}


/* ---------------------------------------------------------
   LOAD PASSENGER OPTIONS
--------------------------------------------------------- */

async function loadPassengerPhoneOptions() {

    /*
     * Use the passenger data already loaded by the application.
     * If it is empty, load it from the API.
     */

    try {

        if (
            !passengers ||
            passengers.length === 0
        ) {

            passengers =
                await fetchData("/passengers");
        }


        populatePassengerPhoneDropdown();

    } catch (error) {

        console.error(
            "Passenger phone options error:",
            error
        );

        showToast(
            "Unable to load passenger data.",
            "error"
        );
    }
}


/* ---------------------------------------------------------
   PASSENGER DROPDOWN
--------------------------------------------------------- */

function populatePassengerPhoneDropdown() {

    const select =
        document.getElementById(
            "phonePassenger"
        );

    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select passenger
        </option>
    `;


    passengers.forEach(passenger => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            passenger.passengerID;


        option.textContent =
            `${passenger.passengerID} — ${passenger.name}`;


        select.appendChild(option);

    });
}


/* ---------------------------------------------------------
   ADD PHONE
--------------------------------------------------------- */

async function openPassengerPhoneModal() {

    editingPhonePassengerID = null;
    editingPhoneNumber = null;


    document.getElementById(
        "passenger-phone-modal-title"
    ).textContent = "Add Phone";


    document.getElementById(
        "passenger-phone-modal-subtitle"
    ).textContent =
        "Add a phone number for a passenger";


    document.getElementById(
        "passenger-phone-save-btn"
    ).textContent =
        "Save Phone";


    document.getElementById(
        "passenger-phone-form"
    ).reset();


    document.getElementById(
        "phonePassenger"
    ).disabled = false;


    document.getElementById(
        "phoneNumber"
    ).disabled = false;


    await loadPassengerPhoneOptions();


    /*
     * IMPORTANT:
     * All existing modals in this project use "show".
     */
    document.getElementById(
        "passenger-phone-modal"
    ).classList.add("show");
}


/* ---------------------------------------------------------
   EDIT PHONE
--------------------------------------------------------- */

async function openEditPassengerPhone(
    passengerID,
    phone
) {

    editingPhonePassengerID =
        passengerID;

    editingPhoneNumber =
        phone;


    document.getElementById(
        "passenger-phone-modal-title"
    ).textContent =
        "Edit Phone";


    document.getElementById(
        "passenger-phone-modal-subtitle"
    ).textContent =
        "Update passenger phone details";


    document.getElementById(
        "passenger-phone-save-btn"
    ).textContent =
        "Update Phone";


    await loadPassengerPhoneOptions();


    document.getElementById(
        "phonePassenger"
    ).value =
        passengerID;


    document.getElementById(
        "phoneNumber"
    ).value =
        phone;


    /*
     * Both fields are part of the composite PK.
     * Keep them locked during a normal edit.
     */
    document.getElementById(
        "phonePassenger"
    ).disabled = true;


    document.getElementById(
        "phoneNumber"
    ).disabled = true;


    document.getElementById(
        "passenger-phone-modal"
    ).classList.add("show");
}


/* ---------------------------------------------------------
   CLOSE
--------------------------------------------------------- */

function closePassengerPhoneModal() {

    document.getElementById(
        "passenger-phone-modal"
    ).classList.remove("show");


    document.getElementById(
        "passenger-phone-form"
    ).reset();


    document.getElementById(
        "phonePassenger"
    ).disabled = false;


    document.getElementById(
        "phoneNumber"
    ).disabled = false;


    editingPhonePassengerID = null;
    editingPhoneNumber = null;
}


/* ---------------------------------------------------------
   SAVE / UPDATE
--------------------------------------------------------- */

async function savePassengerPhone(event) {

    event.preventDefault();


    const passengerID =
        document.getElementById(
            "phonePassenger"
        ).value;


    const phone =
        document.getElementById(
            "phoneNumber"
        ).value.trim();


    if (!passengerID || !phone) {

        showToast(
            "Passenger and phone number are required.",
            "error"
        );

        return;
    }


    const button =
        document.getElementById(
            "passenger-phone-save-btn"
        );


    button.disabled = true;
    button.textContent = "Saving...";


    try {

        if (
            editingPhonePassengerID !== null &&
            editingPhoneNumber !== null
        ) {

            await fetchData(
                `/passenger-phones/${encodeURIComponent(
                    editingPhonePassengerID
                )}/${encodeURIComponent(
                    editingPhoneNumber
                )}`,
                {
                    method: "PUT",

                    body: JSON.stringify({
                        passengerID:
                            editingPhonePassengerID,

                        phone:
                            editingPhoneNumber
                    })
                }
            );


            showToast(
                "Passenger phone updated successfully.",
                "success"
            );

        } else {

            await fetchData(
                "/passenger-phones",
                {
                    method: "POST",

                    body: JSON.stringify({
                        passengerID:
                            passengerID,

                        phone:
                            phone
                    })
                }
            );


            showToast(
                "Passenger phone added successfully.",
                "success"
            );
        }


        closePassengerPhoneModal();

        await loadPassengerPhones();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Passenger phone save error:",
            error
        );

        showToast(
            error.message ||
            "Failed to save passenger phone.",
            "error"
        );

    } finally {

        button.disabled = false;

        button.textContent =
            editingPhonePassengerID !== null
                ? "Update Phone"
                : "Save Phone";
    }
}


/* ---------------------------------------------------------
   DELETE
--------------------------------------------------------- */

async function deletePassengerPhone(
    passengerID,
    phone
) {

    const confirmed =
        confirm(
            `Are you sure you want to delete phone "${phone}" for passenger "${passengerID}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetchData(
            `/passenger-phones/${encodeURIComponent(
                passengerID
            )}/${encodeURIComponent(
                phone
            )}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Passenger phone deleted successfully.",
            "success"
        );


        await loadPassengerPhones();

        await loadDashboard();


    } catch (error) {

        console.error(
            "Passenger phone delete error:",
            error
        );

        showToast(
            error.message ||
            "Failed to delete passenger phone.",
            "error"
        );
    }
}
/* =========================================================
   EER / RELATIONSHIPS
========================================================= */

function selectEERTable(tableName) {

    const tables =
        document.querySelectorAll(".eer-table");

    tables.forEach(table => {
        table.classList.remove("eer-selected");
        table.classList.remove("eer-related");
    });


    const selected =
        document.querySelector(
            `.eer-table[data-table="${tableName}"]`
        );

    if (!selected) {
        return;
    }


    selected.classList.add("eer-selected");


    const relationships = {

        AIRLINES: ["FLIGHT"],

        FLIGHT: ["AIRLINES"],

        PASSENGER: [
            "RESERVATION",
            "PASSENGER_PHONE"
        ],

        RESERVATION: [
            "PASSENGER",
            "AIRPORT",
            "TICKET",
            "PAYMENT",
            "TICKET_BAGGAGE"
        ],

        AIRPORT: ["RESERVATION"],

        TICKET: [
            "RESERVATION",
            "PAYMENT",
            "TICKET_BAGGAGE"
        ],

        PAYMENT: [
            "RESERVATION",
            "TICKET"
        ],

        BAGGAGE: [
            "BAGGAGE_TRACKING",
            "TICKET_BAGGAGE"
        ],

        BAGGAGE_TRACKING: [
            "BAGGAGE"
        ],

        TICKET_BAGGAGE: [
            "TICKET",
            "BAGGAGE",
            "RESERVATION"
        ],

        PASSENGER_PHONE: [
            "PASSENGER"
        ],

        EMPLOYEE: []
    };


    const relatedTables =
        relationships[tableName] || [];


    relatedTables.forEach(relatedName => {

        const related =
            document.querySelector(
                `.eer-table[data-table="${relatedName}"]`
            );

        if (related) {
            related.classList.add("eer-related");
        }

    });
}


function resetEERDiagram() {

    document
        .querySelectorAll(".eer-table")
        .forEach(table => {

            table.classList.remove("eer-selected");
            table.classList.remove("eer-related");

        });

}
/* =========================================================
   INTERACTIVE EER DIAGRAM
========================================================= */

const eerEntities = {

    PASSENGER: {
        title: "PASSENGER",
        type: "entity",
        description: "Stores passenger personal and contact information.",
        table: "PASSENGER",
        pk: ["PassengerID"],
        fk: [],
        attributes: [
            "PassengerID",
            "Name",
            "Email",
            "DOB",
            "Street",
            "City",
            "PIN",
            "Phone (multivalued)"
        ],
        relationships: [
            "Makes RESERVATION",
            "Has PASSENGER_PHONE"
        ],
        crudSection: "passengers"
    },

    RESERVATION: {
        title: "RESERVATION",
        type: "entity",
        description: "Stores booking information for passengers.",
        table: "RESERVATION",
        pk: ["ReservationID"],
        fk: [
            "PassengerID",
            "DepartureAirportID",
            "ArrivalAirportID"
        ],
        attributes: [
            "ReservationID",
            "PassengerID",
            "BookingStatus",
            "Class",
            "DepartureAirportID",
            "ArrivalAirportID"
        ],
        relationships: [
            "Belongs to PASSENGER",
            "Uses AIRPORT",
            "Has TICKET"
        ],
        crudSection: "reservations"
    },

    AIRPORT: {
        title: "AIRPORT",
        type: "entity",
        description: "Stores airport information.",
        table: "AIRPORT",
        pk: ["AirportID"],
        fk: [],
        attributes: [
            "AirportID",
            "AirportName",
            "City",
            "Country"
        ],
        relationships: [
            "Departure / Arrival point for RESERVATION",
            "EMPLOYED AT for EMPLOYEE"
        ],
        crudSection: "airports"
    },

    AIRLINES: {
        title: "AIRLINES",
        type: "entity",
        description: "Stores airline information.",
        table: "AIRLINES",
        pk: ["AirlineID"],
        fk: [],
        attributes: [
            "AirlineID",
            "AirlineName",
            "IATA_Code"
        ],
        relationships: [
            "Operates FLIGHT"
        ],
        crudSection: "airlines"
    },

    FLIGHT: {
        title: "FLIGHT",
        type: "entity",
        description: "Stores flight schedule information.",
        table: "FLIGHT",
        pk: ["FlightID"],
        fk: ["AirlineID"],
        attributes: [
            "FlightID",
            "AirlineID",
            "DepartureTime"
        ],
        relationships: [
            "Operated by AIRLINES"
        ],
        crudSection: "flights"
    },

    EMPLOYEE: {
        title: "EMPLOYEE",
        type: "entity",
        description: "Stores employee information.",
        table: "EMPLOYEE",
        pk: ["EmployeeID"],
        fk: [],
        attributes: [
            "EmployeeID",
            "Name",
            "Designation",
            "Phone"
        ],
        relationships: [
            "EMPLOYED AT AIRPORT",
            "Generalized from FULL_TIME_EMPLOYEE / PART_TIME_EMPLOYEE"
        ],
        crudSection: "employees"
    },

    TICKET: {
        title: "TICKET",
        type: "weak-entity",
        description: "Weak entity representing a ticket belonging to a reservation.",
        table: "TICKET",
        pk: [
            "ReservationID",
            "TicketNo"
        ],
        fk: ["ReservationID"],
        attributes: [
            "ReservationID",
            "TicketNo",
            "SeatNo",
            "Fare"
        ],
        relationships: [
            "Belongs to RESERVATION",
            "Has PAYMENT",
            "Includes BAGGAGE"
        ],
        crudSection: "tickets"
    },

    PAYMENT: {
        title: "PAYMENT",
        type: "entity",
        description: "Stores payment information for tickets.",
        table: "PAYMENT",
        pk: ["PaymentID"],
        fk: [
            "ReservationID",
            "TicketNo"
        ],
        attributes: [
            "PaymentID",
            "ReservationID",
            "TicketNo",
            "Amount",
            "PaymentMethod"
        ],
        relationships: [
            "Pays for TICKET"
        ],
        crudSection: "payments"
    },

    BAGGAGE: {
        title: "BAGGAGE",
        type: "entity",
        description: "Stores baggage quantity and weight information.",
        table: "BAGGAGE",
        pk: ["BaggageID"],
        fk: [],
        attributes: [
            "BaggageID",
            "NoOfPieces",
            "Weight"
        ],
        relationships: [
            "Tracked by BAGGAGE_TRACKING",
            "Assigned to TICKET"
        ],
        crudSection: "baggage"
    },

    BAGGAGE_TRACKING: {
        title: "BAGGAGE_TRACKING",
        type: "weak-entity",
        description: "Stores baggage scan and tracking information.",
        table: "BAGGAGE_TRACKING",
        pk: [
            "BaggageID",
            "TrackingID"
        ],
        fk: ["BaggageID"],
        attributes: [
            "BaggageID",
            "TrackingID",
            "ScanLocation",
            "ScanTime"
        ],
        relationships: [
            "Tracks BAGGAGE"
        ],
        crudSection: "tracking"
    },

    DOMESTIC_PASSENGER: {
        title: "DOMESTIC_PASSENGER",
        type: "subtype",
        description: "Conceptual subtype of PASSENGER for domestic travel.",
        table: null,
        pk: [],
        fk: [],
        attributes: [],
        relationships: [
            "ISA → PASSENGER"
        ],
        crudSection: null
    },

    INTERNATIONAL_PASSENGER: {
        title: "INTERNATIONAL_PASSENGER",
        type: "subtype",
        description: "Conceptual subtype of PASSENGER for international travel.",
        table: null,
        pk: [],
        fk: [],
        attributes: [],
        relationships: [
            "ISA → PASSENGER"
        ],
        crudSection: null
    },

    INDIVIDUAL_RESERVATION: {
        title: "INDIVIDUAL_RESERVATION",
        type: "subtype",
        description: "Conceptual subtype representing an individual reservation.",
        table: null,
        pk: [],
        fk: [],
        attributes: [],
        relationships: [
            "ISA → RESERVATION"
        ],
        crudSection: null
    },

    GROUP_RESERVATION: {
        title: "GROUP_RESERVATION",
        type: "subtype",
        description: "Conceptual subtype representing a group reservation.",
        table: null,
        pk: [],
        fk: [],
        attributes: [],
        relationships: [
            "ISA → RESERVATION"
        ],
        crudSection: null
    },

    FULL_TIME_EMPLOYEE: {
        title: "FULL_TIME_EMPLOYEE",
        type: "subtype",
        description: "Conceptual employee category used in the EER union.",
        table: null,
        pk: [],
        fk: [],
        attributes: [],
        relationships: [
            "Participates in U category → EMPLOYEE"
        ],
        crudSection: null
    },

    PART_TIME_EMPLOYEE: {
        title: "PART_TIME_EMPLOYEE",
        type: "subtype",
        description: "Conceptual employee category used in the EER union.",
        table: null,
        pk: [],
        fk: [],
        attributes: [],
        relationships: [
            "Participates in U category → EMPLOYEE"
        ],
        crudSection: null
    }

};

/* =========================================================
   INTERACTIVE EER DIAGRAM
========================================================= */

/*
    IMPORTANT
    ----------
    The existing eerEntities object above this section is kept.

    This renderer creates:
    - Strong entities
    - Weak entities
    - Subtypes
    - Relationships
    - ISA triangles
    - Union U
    - Attribute ovals
    - Cardinality labels
    - Clickable elements
*/


/* =========================================================
   EER RELATIONSHIPS
========================================================= */

const interactiveEERRelationships = [

    {
        id: "passenger-reservation",
        from: "PASSENGER",
        to: "RESERVATION",
        label: "MAKES",
        cardinalityFrom: "1",
        cardinalityTo: "N"
    },
    {
    id: "airlines-airport",
    from: "AIRLINES",
    to: "AIRPORT",
    label: "BASED AT",
    cardinalityFrom: "M",
    cardinalityTo: "N"
    },
    {
        id: "reservation-airport",
        from: "RESERVATION",
        to: "AIRPORT",
        label: "DEPARTS / ARRIVES",
        cardinalityFrom: "N",
        cardinalityTo: "1"
    },

    {
        id: "airlines-flight",
        from: "AIRLINES",
        to: "FLIGHT",
        label: "OPERATES",
        cardinalityFrom: "1",
        cardinalityTo: "N"
    },

    {
        id: "reservation-ticket",
        from: "RESERVATION",
        to: "TICKET",
        label: "HAS",
        cardinalityFrom: "1",
        cardinalityTo: "N"
    },

    {
        id: "ticket-payment",
        from: "TICKET",
        to: "PAYMENT",
        label: "PAID BY",
        cardinalityFrom: "1",
        cardinalityTo: "N"
    },

    {
        id: "ticket-baggage",
        from: "TICKET",
        to: "BAGGAGE",
        label: "INCLUDES",
        cardinalityFrom: "M",
        cardinalityTo: "N"
    },

    {
        id: "baggage-tracking",
        from: "BAGGAGE",
        to: "BAGGAGE_TRACKING",
        label: "TRACKED BY",
        cardinalityFrom: "1",
        cardinalityTo: "N"
    },
    {
        id: "airlines-airport",
        from: "AIRLINES",
        to: "AIRPORT",
        label: "BASED AT",
        cardinalityFrom: "M",
        cardinalityTo: "N"
    },
    {
        id: "employee-airport",
        from: "EMPLOYEE",
        to: "AIRPORT",
        label: "EMPLOYED AT",
        cardinalityFrom: "N",
        cardinalityTo: "1"
    }
    

];


/* =========================================================
   EER SPECIALIZATION
========================================================= */

const interactiveEERSpecializations = [

    {
        parent: "PASSENGER",
        children: [
            "DOMESTIC_PASSENGER",
            "INTERNATIONAL_PASSENGER"
        ],
        label: "ISA"
    },

    {
        parent: "RESERVATION",
        children: [
            "INDIVIDUAL_RESERVATION",
            "GROUP_RESERVATION"
        ],
        label: "ISA"
    }

];


/* =========================================================
   EER UNION
========================================================= */

const interactiveEERUnion = {

    parent: "EMPLOYEE",

    children: [
        "FULL_TIME_EMPLOYEE",
        "PART_TIME_EMPLOYEE"
    ],

    label: "U"

};


/* =========================================================
   EER ATTRIBUTES
========================================================= */
const interactiveEERAttributes = {
    PASSENGER: [
        { id: "passenger-id", label: "PassengerID", type: "primary-key" },
        { id: "passenger-name", label: "Name", type: "simple" },
        { id: "passenger-email", label: "Email", type: "simple" },
        { id: "passenger-dob", label: "DOB", type: "simple" },
        { id: "passenger-address", label: "Address", type: "composite" },
        { id: "passenger-phone", label: "Phone", type: "multivalued" }
    ],

    RESERVATION: [
        { id: "reservation-id", label: "ReservationID", type: "primary-key" },
        { id: "reservation-status", label: "BookingStatus", type: "simple" },
        { id: "reservation-class", label: "Class", type: "simple" }
    ],

    AIRPORT: [
        { id: "airport-id", label: "AirportID", type: "primary-key" },
        { id: "airport-name", label: "AirportName", type: "simple" },
        { id: "airport-city", label: "City", type: "simple" },
        { id: "airport-country", label: "Country", type: "simple" }
    ],

    AIRLINES: [
        { id: "airlines-id", label: "AirlineID", type: "primary-key" },
        { id: "airline-name", label: "AirlineName", type: "simple" },
        { id: "airline-iata", label: "IATA_Code", type: "simple" }
    ],

    FLIGHT: [
        { id: "flight-id", label: "FlightID", type: "primary-key" },
        { id: "flight-time", label: "DepartureTime", type: "simple" }
    ],

    EMPLOYEE: [
        { id: "employee-id", label: "EmployeeID", type: "primary-key" },
        { id: "employee-name", label: "Name", type: "simple" },
        { id: "employee-designation", label: "Designation", type: "simple" },
        { id: "employee-phone", label: "Phone", type: "simple" }
    ],

    TICKET: [
        { id: "ticket-no", label: "TicketNo", type: "partial-key" },
        { id: "ticket-seat", label: "SeatNo", type: "simple" },
        { id: "ticket-fare", label: "Fare", type: "simple" }
    ],

    PAYMENT: [
        { id: "payment-id", label: "PaymentID", type: "primary-key" },
        { id: "payment-amount", label: "Amount", type: "simple" },
        { id: "payment-method", label: "PaymentMethod", type: "simple" }
    ],

    BAGGAGE: [
        { id: "baggage-id", label: "BaggageID", type: "primary-key" },
        { id: "baggage-pieces", label: "NoOfPieces", type: "simple" },
        { id: "baggage-weight", label: "Weight", type: "simple" }
    ],

    BAGGAGE_TRACKING: [
        { id: "tracking-id", label: "TrackingID", type: "partial-key" },
        { id: "tracking-location", label: "ScanLocation", type: "simple" },
        { id: "tracking-time", label: "ScanTime", type: "simple" }
    ]
};
/* =========================================================
   EER ATTRIBUTE POSITIONS
========================================================= */
const interactiveEERAttributePositions = {

    // PASSENGER
    "passenger-id": { x: 90, y: 70 },
    "passenger-name": { x: 170, y: 65 },
    "passenger-email": { x: 250, y: 70 },
    "passenger-dob": { x: 75, y: 225 },
    "passenger-address": { x: 50, y: 100 },
    "passenger-phone": { x: 245, y: 225 },

    // RESERVATION
    "reservation-id": { x: 360, y: 70 },
    "reservation-status": { x: 445, y: 70 },
    "reservation-class": { x: 525, y: 70 },

    // AIRPORT
    "airport-id": { x: 665, y: 65 },
    "airport-name": { x: 750, y: 65 },
    "airport-city": { x: 830, y: 65 },
    "airport-country": { x: 900, y: 105 },

    // EMPLOYEE
    "employee-id": { x: 1015, y: 65 },
    "employee-name": { x: 1100, y: 65 },
    "employee-designation": { x: 1190, y: 65 },
    "employee-phone": { x: 1270, y: 110 },

    // AIRLINES
    "airlines-id": { x: 555, y: 460 },
    "airline-name": { x: 650, y: 365 },
    "airline-iata": { x: 750, y: 365 },

    // FLIGHT
    "flight-id": { x: 855, y: 365 },
    "flight-time": { x: 950, y: 355 },

    // TICKET
    "ticket-no": { x: 350, y: 575 },
    "ticket-seat": { x: 430, y: 710 },
    "ticket-fare": { x: 510, y: 575 },

    // PAYMENT
    "payment-id": { x: 600, y: 575 },
    "payment-amount": { x: 685, y: 575 },
    "payment-method": { x: 650, y: 710 },

    // BAGGAGE
    "baggage-id": { x: 850, y: 575 },
    "baggage-pieces": { x: 940, y: 575 },
    "baggage-weight": { x: 930, y: 710 },

    // BAGGAGE TRACKING
    "tracking-id": { x: 1110, y: 575 },
    "tracking-location": { x: 1200, y: 575 },
    "tracking-time": { x: 1290, y: 575 }
};
/* =========================================================
   DIAGRAM POSITIONS
========================================================= */
const interactiveEERPositions = {

    /* =====================================================
       MAIN ENTITIES
    ===================================================== */

    PASSENGER: {
        x: 145,
        y: 180
    },

    RESERVATION: {
        x: 435,
        y: 180
    },

    AIRPORT: {
        x: 755,
        y: 180
    },

    EMPLOYEE: {
        x: 1110,
        y: 180
    },


    /* =====================================================
       PASSENGER SPECIALIZATION
    ===================================================== */

    DOMESTIC_PASSENGER: {
        x: 75,
        y: 390
    },

    INTERNATIONAL_PASSENGER: {
        x: 220,
        y: 390
    },


    /* =====================================================
       RESERVATION SPECIALIZATION
    ===================================================== */

    INDIVIDUAL_RESERVATION: {
        x: 365,
        y: 390
    },

    GROUP_RESERVATION: {
        x: 515,
        y: 390
    },


    /* =====================================================
       EMPLOYEE UNION MEMBERS
    ===================================================== */

    FULL_TIME_EMPLOYEE: {
        x: 1020,
        y: 390
    },

    PART_TIME_EMPLOYEE: {
        x: 1200,
        y: 390
    },


    /* =====================================================
       AIRLINE / FLIGHT
    ===================================================== */

    AIRLINES: {
        x: 700,
        y: 450
    },

    FLIGHT: {
        x: 950,
        y: 450
    },


    /* =====================================================
       LOWER SECTION
    ===================================================== */

    TICKET: {
        x: 450,
        y: 650
    },

    PAYMENT: {
        x: 650,
        y: 650
    },

    BAGGAGE: {
        x: 900,
        y: 650
    },

    BAGGAGE_TRACKING: {
        x: 1200,
        y: 650
    }

};
/* =========================================================
   EXPLICIT RELATIONSHIP POSITIONS
========================================================= */
const interactiveEERRelationshipPositions = {

    /* =====================================================
       PASSENGER → RESERVATION
    ===================================================== */

    "passenger-reservation": {
        x: 290,
        y: 180
    },


    /* =====================================================
       RESERVATION → AIRPORT
    ===================================================== */

    "reservation-airport": {
        x: 595,
        y: 180
    },


    /* =====================================================
       EMPLOYEE → AIRPORT
    ===================================================== */

    "employee-airport": {
        x: 930,
        y: 180
    },


    /* =====================================================
       AIRLINES → FLIGHT
    ===================================================== */

    "airlines-flight": {
        x: 825,
        y: 450
    },


    /* =====================================================
       RESERVATION → TICKET
    ===================================================== */

    "reservation-ticket": {
        x: 440,
        y: 520
    },


    /* =====================================================
       TICKET → PAYMENT
    ===================================================== */

    "ticket-payment": {
        x: 550,
        y: 650
    },


    /* =====================================================
       TICKET → BAGGAGE
    ===================================================== */

    "ticket-baggage": {
        x: 775,
        y: 650
    },


    /* =====================================================
       BAGGAGE → TRACKING
    ===================================================== */

    "baggage-tracking": {
        x: 1050,
        y: 650
    },
    "airlines-airport": { x: 730, y: 300 }
};
/* =========================================================
   INITIALIZE INTERACTIVE EER
========================================================= */

function initializeInteractiveEER() {

    const section =
        document.getElementById("eer-diagram");

    if (!section) {
        console.warn("EER section not found.");
        return;
    }

    const workspace =
        section.querySelector(".eer-workspace");

    if (!workspace) {
        console.warn("Interactive EER workspace not found.");
        return;
    }

    /*
        Clear only the interactive EER workspace.

        The existing Database Schema section is completely
        separate and is not modified.
    */
    workspace.innerHTML = "";

    const diagram =
        document.createElement("div");

    diagram.id = "eer-diagram-area";
    diagram.className = "eer-diagram-area";

    const details =
        document.createElement("aside");

    details.id = "eer-details";
    details.className = "eer-details-panel";

    workspace.appendChild(diagram);
    workspace.appendChild(details);

    createInteractiveEERDiagram(diagram);

    createInteractiveEERDetails(details);
}

/* =========================================================
   CREATE DIAGRAM
========================================================= */
function createInteractiveEERDiagram(container) {

    container.innerHTML = "";


    /* =====================================================
       CREATE FIXED EER CANVAS
    ===================================================== */

    const canvas =
        document.createElement(
            "div"
        );


    canvas.className =
        "eer-canvas";


    canvas.id =
        "eer-canvas";


    container.appendChild(
        canvas
    );


    /* =====================================================
       SVG CONNECTION LAYER
    ===================================================== */

    const svg =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );


    svg.id =
        "eer-connection-layer";


    svg.classList.add(
        "eer-connection-layer"
    );


    canvas.appendChild(
        svg
    );


    /* =====================================================
       HTML ELEMENT LAYER
    ===================================================== */

    const entityLayer =
        document.createElement(
            "div"
        );


    entityLayer.className =
        "eer-entity-layer";


    canvas.appendChild(
        entityLayer
    );


    /* =====================================================
       CREATE ENTITY RECTANGLES
    ===================================================== */

    Object.values(
        eerEntities
    ).forEach(
        entity => {

            const position =
                interactiveEERPositions[
                    entity.title
                ];


            if (!position) {
                return;
            }


            const node =
                document.createElement(
                    "button"
                );


            node.type =
                "button";


            node.className =
                "eer-node";


            /* ---------- ENTITY TYPE ---------- */

            if (
                entity.type ===
                "weak-entity"
            ) {

                node.classList.add(
                    "eer-weak-entity"
                );

            }
            else if (
                entity.type ===
                "subtype"
            ) {

                node.classList.add(
                    "eer-concept"
                );

            }
            else {

                node.classList.add(
                    "eer-entity"
                );

            }


            node.dataset.entity =
                entity.title;


            /* ---------- POSITION ---------- */

            node.style.left =
                `${position.x}px`;


            node.style.top =
                `${position.y}px`;


            /* ---------- TEXT ---------- */

            node.innerHTML = `
                <span class="eer-node-title">
                    ${escapeHtml(
                        entity.title
                    )}
                </span>
            `;


            /* ---------- CLICK ---------- */

            node.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    selectEEREntity(
                        entity.title
                    );

                }
            );


            entityLayer.appendChild(
                node
            );

        }
    );


    /* =====================================================
       RELATIONSHIP DIAMONDS
    ===================================================== */

    createRelationshipNodes(
        entityLayer
    );


    /* =====================================================
       ISA TRIANGLES
    ===================================================== */

    createISANodes(
        entityLayer
    );


    /* =====================================================
       UNION U
    ===================================================== */

    createUnionNode(
        entityLayer
    );


    /* =====================================================
       ATTRIBUTE OVALS
    ===================================================== */

    createAttributeNodes(
        entityLayer
    );


    /* =====================================================
       DRAW CONNECTIONS AFTER ELEMENTS EXIST
    ===================================================== */

    requestAnimationFrame(
        () => {

            drawInteractiveEERConnections();

        }
    );

}

/* =========================================================
   RELATIONSHIP NODES
========================================================= */
function createRelationshipNodes(container) {

    interactiveEERRelationships.forEach(
        relationship => {

            const position =
                interactiveEERRelationshipPositions[
                    relationship.id
                ];

            if (!position) {
                return;
            }


            const node =
                document.createElement(
                    "button"
                );

            node.type = "button";

            node.className =
                "eer-relationship-node";


            node.dataset.relationship =
                relationship.id;


            node.style.left =
                `${position.x}px`;

            node.style.top =
                `${position.y}px`;


            node.innerHTML = `
                <span>
                    ${escapeHtml(
                        relationship.label
                    )}
                </span>
            `;


            node.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    showEERRelationshipDetails(
                        relationship
                    );

                    openEERDetails();

                }
            );


            container.appendChild(node);

        }
    );
}
/* =========================================================
   ISA NODES
========================================================= */
function createISANodes(container) {

    interactiveEERSpecializations.forEach(
        specialization => {

            /*
             * Fixed position for the ISA triangle.
             *
             * PASSENGER ISA:
             *        PASSENGER
             *           |
             *          ISA
             *
             * RESERVATION ISA:
             *       RESERVATION
             *           |
             *          ISA
             */

            let x = 0;
            let y = 0;


            if (
                specialization.parent ===
                "PASSENGER"
            ) {

                x = 145;
                y = 285;

            }


            if (
                specialization.parent ===
                "RESERVATION"
            ) {

                x = 415;
                y = 285;

            }


            const node =
                document.createElement(
                    "button"
                );


            node.type =
                "button";


            node.className =
                "eer-isa-node";


            node.style.left =
                `${x}px`;


            node.style.top =
                `${y}px`;


            node.innerHTML = `
    <span class="eer-isa-label">ISA</span>
`;


            node.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    showEERConceptDetails(
                        specialization
                    );


                    openEERDetails();

                }
            );


            container.appendChild(
                node
            );

        }
    );

}
/* =========================================================
   UNION NODE
========================================================= */
function createUnionNode(container) {

    const node =
        document.createElement(
            "button"
        );


    node.type =
        "button";


    node.className =
        "eer-union-node";


    /*
     * U is placed between EMPLOYEE
     * and the two employee categories.
     */

    node.style.left =
        "1110px";


    node.style.top =
        "285px";


    node.innerHTML =
        "U";


    node.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            showEERUnionDetails();


            openEERDetails();

        }
    );


    container.appendChild(
        node
    );

}
/* =========================================================
   ATTRIBUTE NODES
========================================================= */
function createAttributeNodes(container) {

    Object.entries(
        interactiveEERAttributes
    ).forEach(
        ([entityName, attributes]) => {

            attributes.forEach(
                attribute => {

                    /*
                     * Find the exact position
                     * assigned to this attribute.
                     */

                    const position =
                        interactiveEERAttributePositions[
                            attribute.id
                        ];


                    if (!position) {
                        return;
                    }


                    const node =
                        document.createElement(
                            "button"
                        );


                    node.type =
                        "button";


                    node.className =
                        "eer-attribute-node";


                    /*
                     * Multivalued attribute.
                     *
                     * Example:
                     * PASSENGER.Phone
                     */

                    if (
                        attribute.type ===
                        "multivalued"
                    ) {

                        node.classList.add(
                            "multivalued"
                        );

                    }


                    node.dataset.attribute =
                        attribute.id;


                    node.dataset.entity =
                        entityName;


                    node.style.left =
                        `${position.x}px`;


                    node.style.top =
                        `${position.y}px`;


                    node.innerHTML =
                        escapeHtml(
                            attribute.label
                        );


                    node.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();


                            showEERAttributeDetails(
                                entityName,
                                attribute
                            );


                            openEERDetails();

                        }
                    );


                    container.appendChild(
                        node
                    );

                }
            );

        }
    );

}
/* =========================================================
   DRAW CONNECTIONS
========================================================= */

function drawInteractiveEERConnections() {

    const area =
    document.getElementById(
        "eer-canvas"
    );

    const svg =
        document.getElementById(
            "eer-connection-layer"
        );


    if (!area || !svg) {
        return;
    }


    svg.innerHTML = "";


    /*
        Relationship lines.
    */

    interactiveEERRelationships.forEach(
        relationship => {

            drawEERLine(
                area,
                svg,
                relationship.from,
                relationship.to,
                relationship
            );

        }
    );


        /*
        ISA connections.

        IMPORTANT:
        Parent connects to ISA.
        ISA connects to each subtype.

        The parent must NOT connect directly
        to the subtype entities.
    */

    drawEERSpecialConnection(
        area,
        svg,
        "PASSENGER",
        "ISA",
        "PASSENGER"
    );

    drawEERSpecialConnection(
        area,
        svg,
        "ISA",
        "DOMESTIC_PASSENGER",
        "PASSENGER"
    );

    drawEERSpecialConnection(
        area,
        svg,
        "ISA",
        "INTERNATIONAL_PASSENGER",
        "PASSENGER"
    );


    drawEERSpecialConnection(
        area,
        svg,
        "RESERVATION",
        "ISA",
        "RESERVATION"
    );

    drawEERSpecialConnection(
        area,
        svg,
        "ISA",
        "INDIVIDUAL_RESERVATION",
        "RESERVATION"
    );

    drawEERSpecialConnection(
        area,
        svg,
        "ISA",
        "GROUP_RESERVATION",
        "RESERVATION"
    );


    /*
        UNION connections.

        IMPORTANT:
        There is NO enclosing box.

        FULL_TIME_EMPLOYEE
                 \
                  U
                 /
        PART_TIME_EMPLOYEE

                  |
               EMPLOYEE
    */

    drawEERUnionConnection(
        area,
        svg,
        "EMPLOYEE",
        "U"
    );

    drawEERUnionConnection(
        area,
        svg,
        "FULL_TIME_EMPLOYEE",
        "U"
    );

    drawEERUnionConnection(
        area,
        svg,
        "PART_TIME_EMPLOYEE",
        "U"
    );

    // Draw each attribute to its own entity
    drawEERAttributeConnections(area, svg);


}
/* =========================================================
   SPECIALIZATION CONNECTIONS
   Entity ↔ ISA ↔ Subtypes
========================================================= */

function drawEERSpecialConnection(
    area,
    svg,
    fromName,
    toName,
    specializationParent
) {

    const fromEntity =
        document.querySelector(
            `.eer-node[data-entity="${fromName}"]`
        );

    const toEntity =
        document.querySelector(
            `.eer-node[data-entity="${toName}"]`
        );


    /*
     * If either side is the ISA triangle,
     * find the correct triangle using its
     * parent specialization.
     */
    let fromNode = fromEntity;
    let toNode = toEntity;


    if (fromName === "ISA") {

        const isaNodes =
            document.querySelectorAll(
                ".eer-isa-node"
            );

        const index =
            specializationParent === "PASSENGER"
                ? 0
                : 1;

        fromNode =
            isaNodes[index];
    }


    if (toName === "ISA") {

        const isaNodes =
            document.querySelectorAll(
                ".eer-isa-node"
            );

        const index =
            specializationParent === "PASSENGER"
                ? 0
                : 1;

        toNode =
            isaNodes[index];
    }


    if (!fromNode || !toNode) {
        return;
    }


    const areaRect =
        area.getBoundingClientRect();

    const fromRect =
        fromNode.getBoundingClientRect();

    const toRect =
        toNode.getBoundingClientRect();


    const fromCenterX =
        fromRect.left +
        fromRect.width / 2 -
        areaRect.left;

    const fromCenterY =
        fromRect.top +
        fromRect.height / 2 -
        areaRect.top;

    const toCenterX =
        toRect.left +
        toRect.width / 2 -
        areaRect.left;

    const toCenterY =
        toRect.top +
        toRect.height / 2 -
        areaRect.top;


    let x1 = fromCenterX;
    let y1 = fromCenterY;

    let x2 = toCenterX;
    let y2 = toCenterY;


    /*
     * Parent → ISA
     * Connect from the bottom of the parent
     * to the top of the ISA triangle.
     */
    if (toName === "ISA") {

        x1 = fromCenterX;
        y1 =
            fromRect.bottom -
            areaRect.top;

        x2 = toCenterX;
        y2 =
            toRect.top -
            areaRect.top;
    }


    /*
     * ISA → subtype
     * Connect from the bottom of the ISA
     * to the top of the subtype.
     */
    else if (fromName === "ISA") {

        x1 = fromCenterX;
        y1 =
            fromRect.bottom -
            areaRect.top;

        x2 = toCenterX;
        y2 =
            toRect.top -
            areaRect.top;
    }


    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

    line.classList.add(
        "eer-connection",
        "eer-specialization-connection"
    );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    svg.appendChild(line);
}


/* =========================================================
   UNION CONNECTIONS
   EMPLOYEE ↔ U ↔ FULL/PART TIME
========================================================= */

function drawEERUnionConnection(
    area,
    svg,
    entityName,
    unionName
) {

    const entity =
        document.querySelector(
            `.eer-node[data-entity="${entityName}"]`
        );

    const union =
        document.querySelector(
            ".eer-union-node"
        );


    if (!entity || !union) {
        return;
    }


    const areaRect =
        area.getBoundingClientRect();

    const entityRect =
        entity.getBoundingClientRect();

    const unionRect =
        union.getBoundingClientRect();


    const entityCenterX =
        entityRect.left +
        entityRect.width / 2 -
        areaRect.left;

    const entityCenterY =
        entityRect.top +
        entityRect.height / 2 -
        areaRect.top;

    const unionCenterX =
        unionRect.left +
        unionRect.width / 2 -
        areaRect.left;

    const unionCenterY =
        unionRect.top +
        unionRect.height / 2 -
        areaRect.top;


    let x1;
    let y1;
    let x2;
    let y2;


    /*
     * EMPLOYEE → U
     *
     * Straight vertical connection.
     */
    if (entityName === "EMPLOYEE") {

        x1 = entityCenterX;

        y1 =
            entityRect.bottom -
            areaRect.top;

        x2 = unionCenterX;

        y2 =
            unionRect.top -
            areaRect.top;
    }


    /*
     * FULL/PART TIME → U
     *
     * Connect the top of each subtype
     * to the bottom of U.
     */
    else {

        x1 = entityCenterX;

        y1 =
            entityRect.top -
            areaRect.top;

        x2 = unionCenterX;

        y2 =
            unionRect.bottom -
            areaRect.top;
    }


    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

    line.classList.add(
        "eer-connection",
        "eer-union-connection"
    );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    svg.appendChild(line);
}
/* =========================================================
   DRAW ATTRIBUTE → ENTITY CONNECTIONS
========================================================= */

function drawEERAttributeConnections(area, svg) {

    Object.entries(interactiveEERAttributes).forEach(
        ([entityName, attributes]) => {

            const entity =
                document.querySelector(
                    `.eer-node[data-entity="${entityName}"]`
                );

            if (!entity) {
                return;
            }

            attributes.forEach(attribute => {

                const attributeNode =
                    document.querySelector(
                        `.eer-attribute-node[data-attribute="${attribute.id}"][data-entity="${entityName}"]`
                    );

                if (!attributeNode) {
                    return;
                }

                const areaRect =
                    area.getBoundingClientRect();

                const entityRect =
                    entity.getBoundingClientRect();

                const attributeRect =
                    attributeNode.getBoundingClientRect();


                const entityCenterX =
                    entityRect.left +
                    entityRect.width / 2 -
                    areaRect.left;

                const entityCenterY =
                    entityRect.top +
                    entityRect.height / 2 -
                    areaRect.top;

                const attributeCenterX =
                    attributeRect.left +
                    attributeRect.width / 2 -
                    areaRect.left;

                const attributeCenterY =
                    attributeRect.top +
                    attributeRect.height / 2 -
                    areaRect.top;


                /*
                 * Find the direction from the entity
                 * towards the attribute.
                 */
                const dx =
                    attributeCenterX -
                    entityCenterX;

                const dy =
                    attributeCenterY -
                    entityCenterY;


                /*
                 * Start/end points are moved to the
                 * edges of the shapes instead of drawing
                 * through their centres.
                 */
                const entityHalfWidth =
                    entityRect.width / 2;

                const entityHalfHeight =
                    entityRect.height / 2;

                const attributeHalfWidth =
                    attributeRect.width / 2;

                const attributeHalfHeight =
                    attributeRect.height / 2;


                let entityX =
                    entityCenterX;

                let entityY =
                    entityCenterY;

                let attributeX =
                    attributeCenterX;

                let attributeY =
                    attributeCenterY;


                /*
                 * Entity edge
                 */
                if (Math.abs(dx) * entityHalfHeight >
                    Math.abs(dy) * entityHalfWidth) {

                    entityX +=
                        Math.sign(dx) *
                        entityHalfWidth;

                    entityY +=
                        dy / Math.abs(dx) *
                        entityHalfWidth;

                } else {

                    entityY +=
                        Math.sign(dy) *
                        entityHalfHeight;

                    entityX +=
                        dx / Math.abs(dy) *
                        entityHalfHeight;
                }


                /*
                 * Attribute oval edge
                 */
                if (Math.abs(dx) * attributeHalfHeight >
                    Math.abs(dy) * attributeHalfWidth) {

                    attributeX -=
                        Math.sign(dx) *
                        attributeHalfWidth;

                    attributeY -=
                        dy / Math.abs(dx) *
                        attributeHalfWidth;

                } else {

                    attributeY -=
                        Math.sign(dy) *
                        attributeHalfHeight;

                    attributeX -=
                        dx / Math.abs(dy) *
                        attributeHalfHeight;
                }


                const line =
                    document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "line"
                    );

                line.classList.add(
                    "eer-connection",
                    "eer-attribute-connection"
                );

                line.setAttribute(
                    "x1",
                    entityX
                );

                line.setAttribute(
                    "y1",
                    entityY
                );

                line.setAttribute(
                    "x2",
                    attributeX
                );

                line.setAttribute(
                    "y2",
                    attributeY
                );

                line.dataset.entity =
                    entityName;

                line.dataset.attribute =
                    attribute.id;

                svg.appendChild(line);
            });
        }
    );
}

/* =========================================================
   DRAW ONE LINE
========================================================= */

function drawEERLine(
    area,
    svg,
    fromName,
    toName,
    relationship = null
) {

    const from =
        document.querySelector(
            `.eer-node[data-entity="${fromName}"]`
        );

    const to =
        document.querySelector(
            `.eer-node[data-entity="${toName}"]`
        );


    if (!from || !to) {
        return;
    }


    const areaRect =
        area.getBoundingClientRect();

    const fromRect =
        from.getBoundingClientRect();

    const toRect =
        to.getBoundingClientRect();


    const x1 =
        fromRect.left +
        fromRect.width / 2 -
        areaRect.left;

    const y1 =
        fromRect.top +
        fromRect.height / 2 -
        areaRect.top;


    const x2 =
        toRect.left +
        toRect.width / 2 -
        areaRect.left;

    const y2 =
        toRect.top +
        toRect.height / 2 -
        areaRect.top;


    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    line.classList.add(
        "eer-connection"
    );


    line.setAttribute(
        "x1",
        x1
    );

    line.setAttribute(
        "y1",
        y1
    );

    line.setAttribute(
        "x2",
        x2
    );

    line.setAttribute(
        "y2",
        y2
    );


    if (relationship) {

        line.dataset.relationship =
            relationship.id;

    }


    svg.appendChild(
        line
    );

}


/* =========================================================
   SELECT ENTITY
========================================================= */
function selectEEREntity(entityName) {

    /* =====================================================
       OPEN DETAILS PANEL
    ===================================================== */

    openEERDetails();


    /* =====================================================
       CLEAR OLD SELECTION
    ===================================================== */

    document
        .querySelectorAll(
            ".eer-node"
        )
        .forEach(
            node => {

                node.classList.remove(
                    "eer-selected"
                );


                node.classList.remove(
                    "eer-related"
                );

            }
        );


    /* =====================================================
       FIND SELECTED ENTITY
    ===================================================== */

    const selected =
        document.querySelector(
            `.eer-node[data-entity="${entityName}"]`
        );


    if (!selected) {
        return;
    }


    /* =====================================================
       HIGHLIGHT SELECTED ENTITY
    ===================================================== */

    selected.classList.add(
        "eer-selected"
    );


    /* =====================================================
       HIGHLIGHT RELATED ENTITIES
    ===================================================== */

    interactiveEERRelationships.forEach(
        relationship => {

            if (
                relationship.from ===
                entityName
            ) {

                markRelated(
                    relationship.to
                );

            }


            if (
                relationship.to ===
                entityName
            ) {

                markRelated(
                    relationship.from
                );

            }

        }
    );


    /* =====================================================
       SHOW DETAILS
    ===================================================== */

    showEERDetails(
        entityName
    );

}

/* =========================================================
   MARK RELATED
========================================================= */

function markRelated(entityName) {

    const node =
        document.querySelector(
            `.eer-node[data-entity="${entityName}"]`
        );


    if (node) {

        node.classList.add(
            "eer-related"
        );

    }

}
/* =========================================================
   EER DETAILS PANEL
========================================================= */

function openEERDetails() {

    const panel =
        document.getElementById(
            "eer-details"
        );


    if (!panel) {
        return;
    }


    panel.classList.add(
        "eer-details-visible"
    );

}


function closeEERDetails() {

    const panel =
        document.getElementById(
            "eer-details"
        );


    if (!panel) {
        return;
    }


    panel.classList.remove(
        "eer-details-visible"
    );

}

/* =========================================================
   DETAILS
========================================================= */

function showEERDetails(entityName) {

    const entity =
        eerEntities[
            entityName
        ];

    const panel =
        document.getElementById(
            "eer-details"
        );


    if (!entity || !panel) {
        return;
    }


    const attributes =
        entity.attributes &&
        entity.attributes.length
            ? entity.attributes
                .map(
                    attribute =>
                        `<li>${escapeHtml(attribute)}</li>`
                )
                .join("")
            : "<li>No separate attributes</li>";


    const primaryKeys =
        entity.pk &&
        entity.pk.length
            ? entity.pk
                .map(
                    key =>
                        `<li>${escapeHtml(key)}</li>`
                )
                .join("")
            : "<li>None</li>";


    const foreignKeys =
        entity.fk &&
        entity.fk.length
            ? entity.fk
                .map(
                    key =>
                        `<li>${escapeHtml(key)}</li>`
                )
                .join("")
            : "<li>None</li>";


    const relationships =
        entity.relationships &&
        entity.relationships.length
            ? entity.relationships
                .map(
                    relationship =>
                        `<li>${escapeHtml(relationship)}</li>`
                )
                .join("")
            : "<li>None</li>";


    const manageButton =
        entity.crudSection
            ? `
                <button
                    type="button"
                    class="primary-btn"
                    onclick="manageEERTable('${entity.crudSection}')">

                    Manage Table

                </button>
            `
            : `
                <span class="eer-readonly">

                    Conceptual EER element —
                    no separate database table.

                </span>
            `;


    panel.innerHTML = `

    <button
        type="button"
        class="eer-details-close"
        onclick="closeEERDetails()">
        ×
    </button>

        <div class="eer-detail-header">

            <span class="eer-detail-type">

                ${escapeHtml(
                    entity.type
                )}

            </span>

            <h3>
                ${escapeHtml(
                    entity.title
                )}
            </h3>

            <p>
                ${escapeHtml(
                    entity.description
                )}
            </p>

        </div>


        <div class="eer-detail-section">

            <h4>
                Attributes
            </h4>

            <ul>
                ${attributes}
            </ul>

        </div>


        <div class="eer-detail-section">

            <h4>
                Primary Key
            </h4>

            <ul>
                ${primaryKeys}
            </ul>

        </div>


        <div class="eer-detail-section">

            <h4>
                Foreign Keys
            </h4>

            <ul>
                ${foreignKeys}
            </ul>

        </div>


        <div class="eer-detail-section">

            <h4>
                Relationships
            </h4>

            <ul>
                ${relationships}
            </ul>

        </div>


        <div class="eer-detail-actions">

            ${manageButton}

        </div>

    `;

}


/* =========================================================
   RELATIONSHIP DETAILS
========================================================= */

function showEERRelationshipDetails(
    relationship
) {

    const panel =
        document.getElementById(
            "eer-details"
        );


    if (!panel) {
        return;
    }


    panel.innerHTML = `

    <button
        type="button"
        class="eer-details-close"
        onclick="closeEERDetails()">
        ×
    </button>

        <div class="eer-detail-header">

            <span class="eer-detail-type">
                RELATIONSHIP
            </span>

            <h3>
                ${escapeHtml(
                    relationship.label
                )}
            </h3>

            <p>
                Relationship between
                ${escapeHtml(
                    relationship.from
                )}
                and
                ${escapeHtml(
                    relationship.to
                )}.
            </p>

        </div>


        <div class="eer-detail-section">

            <h4>
                Cardinality
            </h4>

            <ul>

                <li>
                    ${escapeHtml(
                        relationship.cardinalityFrom
                    )}
                    :
                    ${escapeHtml(
                        relationship.cardinalityTo
                    )}
                </li>

            </ul>

        </div>


        <div class="eer-detail-section">

            <h4>
                From
            </h4>

            <ul>
                <li>
                    ${escapeHtml(
                        relationship.from
                    )}
                </li>
            </ul>

        </div>


        <div class="eer-detail-section">

            <h4>
                To
            </h4>

            <ul>
                <li>
                    ${escapeHtml(
                        relationship.to
                    )}
                </li>
            </ul>

        </div>

    `;

}


/* =========================================================
   ATTRIBUTE DETAILS
========================================================= */

function showEERAttributeDetails(
    entityName,
    attribute
) {

    const panel =
        document.getElementById(
            "eer-details"
        );


    if (!panel) {
        return;
    }


    let type =
        "Simple Attribute";


    if (
        attribute.type ===
        "multivalued"
    ) {

        type =
            "Multivalued Attribute";

    }


    panel.innerHTML = `

    <button
        type="button"
        class="eer-details-close"
        onclick="closeEERDetails()">
        ×
    </button>

        <div class="eer-detail-header">

            <span class="eer-detail-type">
                ${type}
            </span>

            <h3>
                ${escapeHtml(
                    attribute.label
                )}
            </h3>

            <p>
                Attribute belonging to
                ${escapeHtml(
                    entityName
                )}.
            </p>

        </div>


        <div class="eer-detail-section">

            <h4>
                Attribute Type
            </h4>

            <ul>

                <li>
                    ${type}
                </li>

            </ul>

        </div>


        <div class="eer-detail-section">

            <h4>
                Entity
            </h4>

            <ul>

                <li>
                    ${escapeHtml(
                        entityName
                    )}
                </li>

            </ul>

        </div>

    `;

}


/* =========================================================
   ISA DETAILS
========================================================= */

function showEERConceptDetails(
    specialization
) {

    const panel =
        document.getElementById(
            "eer-details"
        );


    if (!panel) {
        return;
    }


    panel.innerHTML = `

    <button
        type="button"
        class="eer-details-close"
        onclick="closeEERDetails()">
        ×
    </button>

        <div class="eer-detail-header">

            <span class="eer-detail-type">
                SPECIALIZATION
            </span>

            <h3>
                ISA
            </h3>

            <p>
                Specialization of
                ${escapeHtml(
                    specialization.parent
                )}.
            </p>

        </div>


        <div class="eer-detail-section">

            <h4>
                Supertype
            </h4>

            <ul>

                <li>
                    ${escapeHtml(
                        specialization.parent
                    )}
                </li>

            </ul>

        </div>


        <div class="eer-detail-section">

            <h4>
                Subtypes
            </h4>

            <ul>

                ${specialization.children
                    .map(
                        child =>
                            `<li>${escapeHtml(child)}</li>`
                    )
                    .join("")}

            </ul>

        </div>

    `;

}


/* =========================================================
   UNION DETAILS
========================================================= */

function showEERUnionDetails() {

    const panel =
        document.getElementById(
            "eer-details"
        );


    if (!panel) {
        return;
    }


    panel.innerHTML = `

    <button
        type="button"
        class="eer-details-close"
        onclick="closeEERDetails()">
        ×
    </button>

        <div class="eer-detail-header">

            <span class="eer-detail-type">
                UNION CATEGORY
            </span>

            <h3>
                U
            </h3>

            <p>
                Union category connecting the employee
                subtypes to EMPLOYEE.
            </p>

        </div>


        <div class="eer-detail-section">

            <h4>
                Member Categories
            </h4>

            <ul>

                <li>
                    FULL_TIME_EMPLOYEE
                </li>

                <li>
                    PART_TIME_EMPLOYEE
                </li>

            </ul>

        </div>


        <div class="eer-detail-section">

            <h4>
                Union Result
            </h4>

            <ul>

                <li>
                    EMPLOYEE
                </li>

            </ul>

        </div>


        <div class="eer-detail-section">

            <h4>
                Important
            </h4>

            <ul>

                <li>
                    The union is represented by U.
                </li>

                <li>
                    No enclosing box is used.
                </li>

            </ul>

        </div>

    `;

}


/* =========================================================
   CREATE EMPTY DETAILS
========================================================= */

function createInteractiveEERDetails(
    panel
) {

    panel.innerHTML = `

    <button
        type="button"
        class="eer-details-close"
        onclick="closeEERDetails()">
        ×
    </button>

        <div class="eer-details-empty">

            <div class="eer-details-empty-icon">
                ◇
            </div>

            <h3>
                Select an entity
            </h3>

            <p>
                Click an entity, relationship,
                attribute, ISA triangle or U
                to explore the EER model.
            </p>

        </div>

    `;

}


/* =========================================================
   MANAGE DATABASE TABLE
========================================================= */

function manageEERTable(
    sectionId
) {

    if (!sectionId) {
        return;
    }


    showSection(
        sectionId
    );

}


/* =========================================================
   RESET
========================================================= */

function resetInteractiveEER() {

    initializeInteractiveEER();

}


/* =========================================================
   FIT DIAGRAM
========================================================= */

function fitInteractiveEER() {

    const diagram =
        document.getElementById(
            "eer-diagram-area"
        );


    if (!diagram) {
        return;
    }


    diagram.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        const diagram =
            document.getElementById(
                "eer-diagram-area"
            );


        if (!diagram) {
            return;
        }


        drawInteractiveEERConnections();

    }
);


/* =========================
   INITIAL LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDashboard();

    }
);