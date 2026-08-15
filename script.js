// =========================================================
// SMART MEDICINE SYSTEM
// NEW REALTIME FIREBASE SCRIPT
// =========================================================


// =========================================================
// FIREBASE
// =========================================================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// =========================================================
// APPLICATION DATA
// =========================================================

let firebaseData = {

    caregivers: [],

    patients: [],

    medicines: [],

    reminders: [],

    doseHistory: [],

    sosEvents: []

};


// =========================================================
// LOGIN PROTECTION
// =========================================================

onAuthStateChanged(auth, function(user) {

    if (!user) {

        console.log("No user logged in.");

        window.location.href = "login.html";

        return;

    }


    console.log("Logged in user:", user.email);


    // Update user information
    updateUserInformation(user);


    // Start realtime Firebase listeners
    startRealtimeListeners();

});


// =========================================================
// USER INFORMATION
// =========================================================

function updateUserInformation(user) {

    const userName =
        document.querySelector(".user-area strong");

    const userEmail =
        document.querySelector(".user-area small");


    if (userName) {

        userName.textContent = "Caregiver";

    }


    if (userEmail) {

        userEmail.textContent =
            user.email || "Logged-in User";

    }

}


// =========================================================
// REALTIME FIREBASE LISTENERS
// =========================================================

function startRealtimeListeners() {

    console.log(
        "Starting realtime Firebase listeners..."
    );


    // -----------------------------------------------------
    // CAREGIVERS
    // -----------------------------------------------------

    onSnapshot(
        collection(db, "Caregivers"),

        function(snapshot) {

            firebaseData.caregivers =
                snapshot.docs.map(function(doc) {

                    return {

                        id: doc.id,

                        ...doc.data()

                    };

                });


            console.log(
                "Caregivers updated:",
                firebaseData.caregivers
            );

        },

        function(error) {

            console.error(
                "Caregivers error:",
                error
            );

        }
    );


    // -----------------------------------------------------
    // PATIENTS
    // -----------------------------------------------------

    onSnapshot(
        collection(db, "Patients"),

        function(snapshot) {

            firebaseData.patients =
                snapshot.docs.map(function(doc) {

                    return {

                        id: doc.id,

                        ...doc.data()

                    };

                });


            console.log(
                "Patients updated:",
                firebaseData.patients
            );


            updateDashboard();

            updatePatientsPage();

        },

        function(error) {

            console.error(
                "Patients error:",
                error
            );

        }
    );


    // -----------------------------------------------------
    // MEDICINES
    // -----------------------------------------------------

    onSnapshot(
        collection(db, "Medicines"),

        function(snapshot) {

            firebaseData.medicines =
                snapshot.docs.map(function(doc) {

                    return {

                        id: doc.id,

                        ...doc.data()

                    };

                });


            console.log(
                "Medicines updated:",
                firebaseData.medicines
            );


            updateDashboard();

            updateMedicinesPage();

        },

        function(error) {

            console.error(
                "Medicines error:",
                error
            );

        }
    );


    // -----------------------------------------------------
    // REMINDERS
    // -----------------------------------------------------

    onSnapshot(
        collection(db, "Reminders"),

        function(snapshot) {

            firebaseData.reminders =
                snapshot.docs.map(function(doc) {

                    return {

                        id: doc.id,

                        ...doc.data()

                    };

                });


            console.log(
                "Reminders updated:",
                firebaseData.reminders
            );


            updateDashboard();

            updateRemindersPage();

        },

        function(error) {

            console.error(
                "Reminders error:",
                error
            );

        }
    );


    // -----------------------------------------------------
    // DOSE HISTORY
    // -----------------------------------------------------

    onSnapshot(
        collection(db, "Dose History"),

        function(snapshot) {

            firebaseData.doseHistory =
                snapshot.docs.map(function(doc) {

                    return {

                        id: doc.id,

                        ...doc.data()

                    };

                });


            console.log(
                "Dose History updated:",
                firebaseData.doseHistory
            );


            updateDashboard();

            updateDoseHistoryPage();

        },

        function(error) {

            console.error(
                "Dose History error:",
                error
            );

        }
    );


    // -----------------------------------------------------
    // SOS EVENTS
    // -----------------------------------------------------

    onSnapshot(
        collection(db, "SOS Events"),

        function(snapshot) {

            firebaseData.sosEvents =
                snapshot.docs.map(function(doc) {

                    return {

                        id: doc.id,

                        ...doc.data()

                    };

                });


            console.log(
                "SOS Events updated:",
                firebaseData.sosEvents
            );


            updateDashboard();

            updateAlertsPage();

            updateSOSPage();

        },

        function(error) {

            console.error(
                "SOS Events error:",
                error

            );

        }
    );

}


// =========================================================
// PAGE NAVIGATION
// =========================================================

function showPage(pageId) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(function(page) {

        page.classList.remove(
            "active-page"
        );

    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {

        selectedPage.classList.add(
            "active-page"
        );

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


    const pageTitle =
        document.getElementById("page-title");


    if (pageTitle) {

        pageTitle.textContent =
            titles[pageId] || "Dashboard";

    }


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(function(item) {

        item.classList.remove("active");

    });


    navItems.forEach(function(item) {

        const onclickValue =
            item.getAttribute("onclick");


        if (
            onclickValue ===
            "showPage('" + pageId + "')"
        ) {

            item.classList.add("active");

        }

    });

}


window.showPage = showPage;


// =========================================================
// DASHBOARD
// =========================================================

function updateDashboard() {


    // -----------------------------------------------------
    // STATISTICS
    // -----------------------------------------------------

    const patientsCount =
        document.getElementById(
            "patients-count"
        );


    const medicinesCount =
        document.getElementById(
            "medicines-count"
        );


    const remindersCount =
        document.getElementById(
            "reminders-count"
        );


    const alertsCount =
        document.getElementById(
            "alerts-count"
        );


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


    // -----------------------------------------------------
    // PATIENT
    // -----------------------------------------------------

    const patient =
        firebaseData.patients[0];


    if (patient) {


        const patientName =
            document.getElementById(
                "dashboard-patient-name"
            );


        const patientId =
            document.getElementById(
                "dashboard-patient-id"
            );


        const patientAge =
            document.getElementById(
                "dashboard-patient-age"
            );


        const caregiverId =
            document.getElementById(
                "dashboard-caregiver-id"
            );


        if (patientName) {

            patientName.textContent =
                patient.name ||
                patient.patientName ||
                "Unknown Patient";

        }


        if (patientId) {

            patientId.textContent =
                patient.id || "-";

        }


        if (patientAge) {

            patientAge.textContent =
                patient.age ?? "-";

        }


        if (caregiverId) {

            caregiverId.textContent =
                patient.caregiverID ||
                patient.caregiverId ||
                "-";

        }

    }


    // -----------------------------------------------------
    // MEDICINE
    // -----------------------------------------------------

    const medicine =
        firebaseData.medicines[0];


    if (medicine) {


        const medicineName =
            document.getElementById(
                "dashboard-medicine-name"
            );


        const medicineStock =
            document.getElementById(
                "dashboard-medicine-stock"
            );


        const medicineCompartment =
            document.getElementById(
                "dashboard-medicine-compartment"
            );


        const medicineExpiry =
            document.getElementById(
                "dashboard-medicine-expiry"
            );


        if (medicineName) {

            medicineName.textContent =
                medicine.name ||
                "Medicine";

        }


        if (medicineStock) {

            medicineStock.textContent =
                medicine.stock ??
                "-";

        }


        if (medicineCompartment) {

            medicineCompartment.textContent =
                medicine.compartment ||
                "-";

        }


        if (medicineExpiry) {

            medicineExpiry.textContent =
                medicine.expiry ||
                "-";

        }

    }


    // -----------------------------------------------------
    // NEXT REMINDER
    // -----------------------------------------------------

    const reminder =
        firebaseData.reminders[0];


    if (reminder) {


        const reminderTime =
            document.getElementById(
                "dashboard-reminder-time"
            );


        const reminderName =
            document.getElementById(
                "dashboard-reminder-name"
            );


        const reminderDose =
            document.getElementById(
                "dashboard-reminder-dose"
            );


        const reminderStatus =
            document.getElementById(
                "dashboard-reminder-status"
            );


        if (reminderTime) {

            reminderTime.textContent =
                reminder.time ||
                reminder.reminderTime ||
                "-";

        }


        if (reminderName) {

            reminderName.textContent =
                reminder.medicineName ||
                reminder.medicine ||
                "Medicine";

        }


        if (reminderDose) {

            reminderDose.textContent =
                reminder.dose ||
                reminder.quantity ||
                "-";

        }


        if (reminderStatus) {

            reminderStatus.textContent =
                String(
                    reminder.status ||
                    "PENDING"
                ).toUpperCase();

        }

    }


    // -----------------------------------------------------
    // LAST DOSE
    // -----------------------------------------------------

    const dose =
        firebaseData.doseHistory[0];


    if (dose) {


        const doseName =
            document.getElementById(
                "dashboard-dose-name"
            );


        const doseScheduled =
            document.getElementById(
                "dashboard-dose-scheduled"
            );


        const doseActual =
            document.getElementById(
                "dashboard-dose-actual"
            );


        const doseStatus =
            document.getElementById(
                "dashboard-dose-status"
            );


        if (doseName) {

            doseName.textContent =
                dose.medicineName ||
                dose.medicine ||
                "Medicine";

        }


        if (doseScheduled) {

            doseScheduled.textContent =
                "Scheduled: " +
                (
                    dose.scheduled ||
                    dose.scheduledTime ||
                    "-"
                );

        }


        if (doseActual) {

            doseActual.textContent =
                "Actual: " +
                (
                    dose.actual ||
                    dose.actualTime ||
                    "-"
                );

        }


        if (doseStatus) {

            doseStatus.textContent =
                String(
                    dose.status ||
                    "TAKEN"
                ).toUpperCase();

        }

    }

}


// =========================================================
// PATIENTS PAGE
// =========================================================

function updatePatientsPage() {

    const tbody =
        document.getElementById(
            "patients-table-body"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    if (
        firebaseData.patients.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    No patients found.
                </td>
            </tr>
        `;

        return;

    }


    firebaseData.patients.forEach(
        function(patient) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${patient.id || "-"}
                </td>

                <td>
                    ${
                        patient.name ||
                        patient.patientName ||
                        "-"
                    }
                </td>

                <td>
                    ${patient.age ?? "-"}
                </td>

                <td>
                    ${
                        patient.caregiverID ||
                        patient.caregiverId ||
                        "-"
                    }
                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


// =========================================================
// MEDICINES PAGE
// =========================================================

function updateMedicinesPage() {

    const tbody =
        document.getElementById(
            "medicines-table-body"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    if (
        firebaseData.medicines.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No medicines found.
                </td>
            </tr>
        `;

        return;

    }


    firebaseData.medicines.forEach(
        function(medicine) {

            const row =
                document.createElement("tr");


            const stock =
                medicine.stock !== undefined &&
                medicine.stock !== null
                    ? medicine.stock
                    : "-";


            row.innerHTML = `

                <td>
                    ${medicine.id || "-"}
                </td>

                <td>
                    ${medicine.name || "-"}
                </td>

                <td>
                    ${stock}
                </td>

                <td>
                    ${medicine.expiry || "-"}
                </td>

                <td>
                    ${medicine.compartment || "-"}
                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


// =========================================================
// REMINDERS PAGE
// =========================================================

function updateRemindersPage() {

    const container =
        document.getElementById(
            "reminders-list"
        );


    if (!container) return;


    container.innerHTML = "";


    if (
        firebaseData.reminders.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-state">
                <div>⏰</div>
                <h3>No Reminders</h3>
                <p>
                    No medicine reminders found.
                </p>
            </div>
        `;

        return;

    }


    firebaseData.reminders.forEach(
        function(reminder) {


            const item =
                document.createElement("div");


            item.className =
                "reminder-item";


            item.innerHTML = `

                <div class="reminder-time">
                    ${
                        reminder.time ||
                        reminder.reminderTime ||
                        "-"
                    }
                </div>

                <div>

                    <h3>
                        ${
                            reminder.medicineName ||
                            reminder.medicine ||
                            "Medicine"
                        }
                    </h3>

                    <p>
                        Dose:
                        ${
                            reminder.dose ||
                            reminder.quantity ||
                            "-"
                        }
                    </p>

                </div>

                <span class="status pending">

                    ${
                        String(
                            reminder.status ||
                            "PENDING"
                        ).toUpperCase()
                    }

                </span>

            `;


            container.appendChild(item);

        }
    );

}


// =========================================================
// DOSE HISTORY
// =========================================================

function updateDoseHistoryPage() {

    const tbody =
        document.getElementById(
            "history-table-body"
        );


    if (!tbody) return;


    tbody.innerHTML = "";


    if (
        firebaseData.doseHistory.length === 0
    ) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    No dose history found.
                </td>
            </tr>
        `;

        return;

    }


    firebaseData.doseHistory.forEach(
        function(dose) {

            const row =
                document.createElement("tr");


            const status =
                String(
                    dose.status ||
                    "TAKEN"
                ).toUpperCase();


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
                        ${status}
                    </span>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


// =========================================================
// ALERTS
// =========================================================

function updateAlertsPage() {

    const container =
        document.getElementById(
            "alerts-content"
        );


    if (!container) return;


    if (
        firebaseData.sosEvents.length === 0
    ) {

        container.innerHTML = `

            <div>✅</div>

            <h3>
                No Active Alerts
            </h3>

            <p>
                There are currently no
                medicine alerts.
            </p>

        `;

    }

    else {

        container.innerHTML = `

            <div>⚠️</div>

            <h3>
                ${
                    firebaseData.sosEvents.length
                }
                Event(s) Found
            </h3>

            <p>
                Please check the SOS Events
                section.
            </p>

        `;

    }

}


// =========================================================
// SOS
// =========================================================

function updateSOSPage() {

    const container =
        document.getElementById(
            "sos-content"
        );


    if (!container) return;


    if (
        firebaseData.sosEvents.length === 0
    ) {

        container.innerHTML = `

            <div>🛡️</div>

            <h3>
                No SOS Events
            </h3>

            <p>
                No emergency event has
                been triggered.
            </p>

        `;

        return;

    }


    container.innerHTML = "";


    firebaseData.sosEvents.forEach(
        function(event) {


            const eventBox =
                document.createElement("div");


            eventBox.className =
                "sos-event";


            eventBox.innerHTML = `

                <div>🚨</div>

                <h3>
                    SOS Event:
                    ${event.id || "-"}
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


            container.appendChild(
                eventBox
            );

        }
    );

}


// =========================================================
// LOGOUT
// =========================================================

async function logout() {

    try {

        await signOut(auth);

        window.location.href =
            "login.html";

    }

    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

}


window.logout = logout;


// =========================================================
// INITIAL UI
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showPage("dashboard");

    }
);
