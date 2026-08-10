function showPage(pageId) {

    // Hide all pages
    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active-page");
    });


    // Show selected page
    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }


    // Update page title
    const titles = {

        dashboard: "Dashboard",

        patients: "Patients",

        medicines: "Medicines",

        reminders: "Reminders",

        history: "Dose History",

        alerts: "Alerts",

        sos: "SOS Events"

    };


    const pageTitle = document.getElementById("page-title");

    if (pageTitle) {

        pageTitle.textContent =
            titles[pageId] || "Dashboard";

    }


    // Update active navigation button
    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(function(item) {

        item.classList.remove("active");

    });


    navItems.forEach(function(item) {

        if (
            item.getAttribute("onclick") ===
            `showPage('${pageId}')`
        ) {

            item.classList.add("active");

        }

    });

}
