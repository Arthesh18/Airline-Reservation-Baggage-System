const ROUTE_FINDER_API = "http://localhost:8080/api";

/* =========================================================
   NEO4J ROUTE FINDER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("route-form");
    const sourceSelect = document.getElementById("route-source");
    const destinationSelect = document.getElementById("route-destination");
    const status = document.getElementById("route-status");
    const results = document.getElementById("route-results");
    const button = document.getElementById("route-search-button");

    if (!form || !sourceSelect || !destinationSelect || !status || !results || !button) {
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const source = sourceSelect.value;
        const destination = destinationSelect.value;

        results.replaceChildren();

        if (source === destination) {
            status.textContent = "Please select two different airports.";
            return;
        }

        status.textContent = "Searching for routes...";
        button.disabled = true;

        try {
            const url = new URL(`${ROUTE_FINDER_API}/routes`);
            url.searchParams.set("source", source);
            url.searchParams.set("destination", destination);

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not find route.");
            }

            if (!Array.isArray(data) || data.length === 0) {
                status.textContent = "No route found between these airports.";
                return;
            }

            status.textContent = `Found ${data.length} route(s).`;

        const bestFlightCount = Math.min(
    ...data.map(item =>
        Array.isArray(item.route)
            ? item.route.filter(node => node.type === "Flight").length
            : Infinity
    )
);    
data.forEach((item, index) => {
    const card = document.createElement("div");
    const nodes = Array.isArray(item.route) ? item.route : [];

const flightCount = nodes.filter(
    node => node.type === "Flight"
).length;

const stopCount = Math.max(flightCount - 1, 0);

card.className = "route-result-card";
if (flightCount === bestFlightCount) {
    card.classList.add("best-route");
}
    const heading = document.createElement("h3");
    heading.textContent = `Route ${index + 1}`;
    card.appendChild(heading);
    const details = document.createElement("p");
details.className = "route-details";
details.textContent =
    `${flightCount} flight(s) Â· ${stopCount} intermediate stop(s)`;

card.appendChild(heading);
card.appendChild(details);

    const visualPath = document.createElement("div");
    visualPath.className = "route-visual-path";
    
    nodes.forEach((node, nodeIndex) => {
        const stop = document.createElement("div");

        if (node.type === "Airport") {
            stop.className = "route-stop route-stop-airport";

            const type = document.createElement("span");
            type.className = "route-stop-type";
            type.textContent = "Airport";

            const name = document.createElement("span");
            name.className = "route-stop-name";
            name.textContent = node.name || "Airport";

            const code = document.createElement("span");
            code.className = "route-stop-code";
            code.textContent = node.code || "";

            stop.append(type, name, code);
        } else if (node.type === "Flight") {
            stop.className = "route-stop route-stop-flight";

            const type = document.createElement("span");
            type.className = "route-stop-type";
            type.textContent = "Flight";

            const name = document.createElement("span");
            name.className = "route-stop-name";
            name.textContent = node.flightNo || "Flight";

            const details = document.createElement("span");
            details.className = "route-stop-code";
            details.textContent = "Connection";

            stop.append(type, name, details);
        } else {
            stop.className = "route-stop";

            const name = document.createElement("span");
            name.className = "route-stop-name";
            name.textContent = node.name || node.type || "Stop";

            stop.appendChild(name);
        }

        visualPath.appendChild(stop);

        if (nodeIndex < nodes.length - 1) {
            const connector = document.createElement("span");
            connector.className = "route-connector";
            connector.textContent = "â†’";
            connector.setAttribute("aria-hidden", "true");
            visualPath.appendChild(connector);
        }
    });

    card.appendChild(visualPath);
    results.appendChild(card);
});

        } catch (error) {
            status.textContent = `Route search failed: ${error.message}. Check that the backend is running on port 8084.`;
        } finally {
            button.disabled = false;
        }
    });
});



