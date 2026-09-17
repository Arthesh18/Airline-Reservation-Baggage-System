/*
    AirTrack Dashboard Router

    This file connects the new Airport Home page
    with the existing dashboard sections.

    It does NOT replace script.js.
    It only reads the URL hash and opens the
    corresponding existing dashboard section.
*/


(function () {

    function openSectionFromHash() {

        const hash =
            window.location.hash.substring(1);

        if (!hash) {
            return;
        }


        /*
            Wait until the existing dashboard
            script has loaded its showSection()
            function.
        */

        if (
            typeof window.showSection !== "function"
        ) {

            setTimeout(
                openSectionFromHash,
                100
            );

            return;
        }


        const validSections = [

            "dashboard",

            "passengers",

            "reservations",

            "flights",

            "tickets",

            "baggage",

            "payments",

            "airports",

            "airlines",

            "employees",

            "tracking",

            "passenger-phones",

            "ticket-baggage",

            "relationships",

            "eer-diagram",

            "sql"

        ];


        if (
            validSections.includes(hash)
        ) {

            window.showSection(hash);

        }

    }


    /*
        Run when dashboard.html first opens.
    */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            openSectionFromHash
        );

    } else {

        openSectionFromHash();

    }


    /*
        Also handle changing the hash
        while already inside dashboard.
    */

    window.addEventListener(
        "hashchange",
        openSectionFromHash
    );


})();