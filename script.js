function showPage(pageId) {

    // Get all pages
    const pages = document.querySelectorAll(".page");

    // Hide every page
    pages.forEach(function(page) {
        page.classList.remove("active-page");
    });

    // Find the page we want to show
    const selectedPage = document.getElementById(pageId);

    // Show selected page
    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    // Page titles
    const titles = {
        dashboard: "Dashboard",
        patients: "Patients",
        medicines: "Medicines",
        reminders: "Reminders",
        history: "Dose History",
        alerts: "Alerts",
        sos: "SOS Events"
    };

    // Change title at top
    const pageTitle = document.getElementById("page-title");

    if (pageTitle) {
        pageTitle.textContent = titles[pageId] || "Dashboard";
    }

    // Remove active from all navigation buttons
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function(item) {
        item.classList.remove("active");
    });

    // Add active to clicked button
    navItems.forEach(function(item) {

        const onclickValue = item.getAttribute("onclick");

        if (onclickValue === "showPage('" + pageId + "')") {
            item.classList.add("active");
        }

    });
}
