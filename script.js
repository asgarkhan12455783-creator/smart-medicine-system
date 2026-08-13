import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ======================================================
// SIDEBAR PAGE NAVIGATION
// ======================================================

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

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
        pageTitle.textContent = titles[pageId] || "Dashboard";
    }

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function(item) {
        item.classList.remove("active");
    });

    navItems.forEach(function(item) {

        const onclickValue = item.getAttribute("onclick");

        if (onclickValue === "showPage('" + pageId + "')") {
            item.classList.add("active");
        }

    });
}

window.showPage = showPage;


// ======================================================
// FIREBASE DATA
// ======================================================

let firebaseData = {
    caregivers: [],
    patients: [],
    medicines: [],
    reminders: [],
    doseHistory: [],
    sosEvents: []
};


// ======================================================
// LOAD FIREBASE DATA
// ======================================================

async function loadFirebaseData() {

    try {

        console.log("Connecting to Firestore database: aban");

        const collectionNames = [
            "Caregivers",
            "Dose History",
            "Medicines",
            "Patients",
            "Reminders",
            "SOS Events"
        ];

        const snapshots = await Promise.all(
            collectionNames.map(function(collectionName) {
                return getDocs(collection(db, collectionName));
            })
        );


        firebaseData.caregivers = snapshots[0].docs.map(function(doc) {
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        firebaseData.doseHistory = snapshots[1].docs.map(function(doc) {
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        firebaseData.medicines = snapshots[2].docs.map(function(doc) {
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        firebaseData.patients = snapshots[3].docs.map(function(doc) {
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        firebaseData.reminders = snapshots[4].docs.map(function(doc) {
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        firebaseData.sosEvents = snapshots[5].docs.map(function(doc) {
            return {
                id: doc.id,
                ...doc.data()
            };
        });


        console.log("Firebase data loaded successfully!");
        console.log(firebaseData);


        updateDashboard();

        updatePatientsPage();

        updateMedicinesPage();

        updateRemindersPage();

        updateDoseHistoryPage();

        updateAlertsPage();

        updateSOSPage();


    } catch (error) {

        console.error("Firestore connection error:", error);

        alert(
            "Firebase connection failed. Please check the browser console."
        );

    }
}


// ======================================================
// DASHBOARD
// ======================================================

function updateDashboard() {

    // ---------- STATISTICS ----------

    const patientsCount =
        document.getElementById("patients-count");

    const medicinesCount =
        document.getElementById("medicines-count");

    const remindersCount =
        document.getElementById("reminders-count");

    const alertsCount =
        document.getElementById("alerts-count");


    if (patientsCount) {
        patientsCount.textContent =
            firebaseData.patients.length;
    }

    if (medicinesCount) {
        medicinesCount.textContent =
            firebaseData.medicines.length;
    }

    if (remindersCount) {
        remindersCount.textContent =
            firebaseData.reminders.length;
    }

    if (alertsCount) {
        alertsCount.textContent =
            firebaseData.sosEvents.length;
    }


    // ---------- PATIENT ----------

    const patient = firebaseData.patients[0];

    if (patient) {

        document.getElementById(
            "dashboard-patient-name"
        ).textContent =
            patient.name || "Unknown Patient";


        document.getElementById(
            "dashboard-patient-id"
        ).textContent =
            patient.id;


        document.getElementById(
            "dashboard-patient-age"
        ).textContent =
            patient.age ?? "-";


        document.getElementById(
            "dashboard-caregiver-id"
        ).textContent =
            patient.caregiverID || "-";
    }


    // ---------- MEDICINE ----------

    const medicine = firebaseData.medicines[0];

    if (medicine) {

        document.getElementById(
            "dashboard-medicine-name"
        ).textContent =
            medicine.name || "Medicine";


        document.getElementById(
            "dashboard-medicine-stock"
        ).textContent =
            medicine.stock ?? "-";


        document.getElementById(
            "dashboard-medicine-compartment"
        ).textContent =
            medicine.compartment || "-";


        document.getElementById(
            "dashboard-medicine-expiry"
        ).textContent =
            medicine.expiry || "-";
    }


    // ---------- REMINDER ----------

    const reminder = firebaseData.reminders[0];

    if (reminder) {

        document.getElementById(
            "dashboard-reminder-time"
        ).textContent =
            reminder.time || "-";


        document.getElementById(
            "dashboard-reminder-name"
        ).textContent =
            reminder.medicineName ||
            reminder.medicine ||
            "Medicine";


        document.getElementById(
            "dashboard-reminder-dose"
        ).textContent =
            reminder.dose ||
            reminder.quantity ||
            "-";


        document.getElementById(
            "dashboard-reminder-status"
        ).textContent =
            String(reminder.status || "PENDING").toUpperCase();
    }


    // ---------- LAST DOSE ----------

    const dose = firebaseData.doseHistory[0];

    if (dose) {

        document.getElementById(
            "dashboard-dose-name"
        ).textContent =
            dose.medicineName ||
            dose.medicine ||
            "Medicine";


        document.getElementById(
            "dashboard-dose-scheduled"
        ).textContent =
            "Scheduled: " +
            (dose.scheduled || dose.scheduledTime || "-");


        document.getElementById(
            "dashboard-dose-actual"
        ).textContent =
            "Actual: " +
            (dose.actual || dose.actualTime || "-");


        document.getElementById(
            "dashboard-dose-status"
        ).textContent =
            String(dose.status || "TAKEN").toUpperCase();
    }
}


// ======================================================
// PATIENTS PAGE
// ======================================================

function updatePatientsPage() {

    const tbody =
        document.getElementById("patients-table-body");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (firebaseData.patients.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4">No patients found.</td>
            </tr>
        `;

        return;
    }


    firebaseData.patients.forEach(function(patient) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name || "-"}</td>
            <td>${patient.age ?? "-"}</td>
            <td>${patient.caregiverID || "-"}</td>
        `;

        tbody.appendChild(row);

    });
}


// ======================================================
// MEDICINES PAGE
// ======================================================

function updateMedicinesPage() {

    const tbody =
        document.getElementById("medicines-table-body");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (firebaseData.medicines.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">No medicines found.</td>
            </tr>
        `;

        return;
    }

console.log("MEDICINES DATA:", firebaseData.medicines);
    firebaseData.medicines.forEach(function(medicine) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${medicine.id}</td>
            <td>${medicine.name || "-"}</td>
            <td>${medicine.stock ?? "-"}</td>
            <td>${medicine.expiry || "-"}</td>
            <td>${medicine.compartment || "-"}</td>
        `;

        tbody.appendChild(row);

    });
}


// ======================================================
// REMINDERS PAGE
// ======================================================

function updateRemindersPage() {

    const container =
        document.getElementById("reminders-list");

    if (!container) return;

    container.innerHTML = "";

    if (firebaseData.reminders.length === 0) {

        container.innerHTML =
            "<p>No reminders found.</p>";

        return;
    }


    firebaseData.reminders.forEach(function(reminder) {

        const item = document.createElement("div");

        item.className = "reminder-item";

        item.innerHTML = `
            <div>
                <h3>
                    ${
                        reminder.medicineName ||
                        reminder.medicine ||
                        "Medicine"
                    }
                </h3>

                <p>
                    Patient:
                    ${reminder.patientId || "-"}
                </p>
            </div>

            <strong>
                ${reminder.time || "-"}
            </strong>

            <span>
                ${
                    reminder.dose ||
                    reminder.quantity ||
                    "-"
                }
            </span>
        `;

        container.appendChild(item);

    });
}


// ======================================================
// DOSE HISTORY PAGE
// ======================================================

function updateDoseHistoryPage() {

    const tbody =
        document.getElementById("history-table-body");

    if (!tbody) return;

    tbody.innerHTML = "";

    if (firebaseData.doseHistory.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No dose history found.
                </td>
            </tr>
        `;

        return;
    }


    firebaseData.doseHistory.forEach(function(dose) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                ${
                    dose.medicineName ||
                    dose.medicine ||
                    "-"
                }
            </td>

            <td>
                ${dose.date || "-"}
            </td>

            <td>
                ${
                    dose.scheduled ||
                    dose.scheduledTime ||
                    "-"
                }
            </td>

            <td>
                ${
                    dose.actual ||
                    dose.actualTime ||
                    "-"
                }
            </td>

            <td>
                <span class="status taken">
                    ${
                        String(
                            dose.status || "TAKEN"
                        ).toUpperCase()
                    }
                </span>
            </td>
        `;

        tbody.appendChild(row);

    });
}


// ======================================================
// ALERTS PAGE
// ======================================================

function updateAlertsPage() {

    const container =
        document.getElementById("alerts-content");

    if (!container) return;


    if (firebaseData.sosEvents.length === 0) {

        container.innerHTML = `
            <div>✅</div>
            <h3>No Active Alerts</h3>
            <p>
                There are currently no medicine alerts.
            </p>
        `;

    } else {

        container.innerHTML = `
            <div>⚠️</div>

            <h3>
                ${firebaseData.sosEvents.length}
                Event(s) Found
            </h3>

            <p>
                Please check the SOS Events section.
            </p>
        `;
    }
}


// ======================================================
// SOS PAGE
// ======================================================

function updateSOSPage() {

    const container =
        document.getElementById("sos-content");

    if (!container) return;


    if (firebaseData.sosEvents.length === 0) {

        container.innerHTML = `
            <div>🛡️</div>

            <h3>No SOS Events</h3>

            <p>
                No emergency event has been triggered.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    firebaseData.sosEvents.forEach(function(event) {

        const eventBox =
            document.createElement("div");

        eventBox.className = "sos-event";


        eventBox.innerHTML = `
            <div>🚨</div>

            <h3>
                SOS Event: ${event.id}
            </h3>

            <p>
                Patient:
                ${event.patientId || "-"}
            </p>

            <p>
                Status:
                ${event.status || "-"}
            </p>
        `;


        container.appendChild(eventBox);

    });
}


// ======================================================
// START APPLICATION
// ======================================================

loadFirebaseData();
