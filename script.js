// =========================================================
// SMART MEDICINE SYSTEM
// COMPLETE REALTIME SCRIPT
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
// GLOBAL FIREBASE DATA
// =========================================================

let firebaseData = {

    patients: [],

    medicines: [],

    reminders: [],

    doseHistory: [],

    sosEvents: [],

    caregivers: []

};


// =========================================================
// AUTHENTICATION
// =========================================================

onAuthStateChanged(auth, function(user) {

    if (!user) {

        console.log("No user logged in.");

        window.location.href = "login.html";

        return;

    }


    console.log(
        "Logged in user:",
        user.email
    );


    updateUserInformation(user);

    startRealtimeListeners();

});


// =========================================================
// USER INFORMATION
// =========================================================

function updateUserInformation(user) {

    const userName =
        document.querySelector(
            ".user-area strong"
        );

    const userEmail =
        document.querySelector(
            ".user-area small"
        );


    if (userName) {

        userName.textContent =
            "Caregiver";

    }


    if (userEmail) {

        userEmail.textContent =
            user.email ||
            "Logged-in User";

    }

}


// =========================================================
// START REALTIME FIRESTORE LISTENERS
// =========================================================

function startRealtimeListeners() {

    console.log(
        "Starting realtime Firestore listeners..."
    );


    // =====================================================
    // PATIENTS
    // =====================================================

    onSnapshot(

        collection(db, "Patients"),

        function(snapshot) {

            firebaseData.patients =
                snapshot.docs.map(
                    function(doc) {

                        return {

                            firestoreId: doc.id,

                            ...doc.data()

                        };

                    }
                );


            console.log(
                "PATIENTS UPDATED:",
                firebaseData.patients
            );


            // Update dashboard
            updateDashboard();


            // Update patients page
            updatePatientsPage();

        },

        function(error) {

            console.error(
                "Patients error:",
                error
            );

        }

    );


    // =====================================================
    // MEDICINES
    // =====================================================

    onSnapshot(

        collection(db, "Medicines"),

        function(snapshot) {

            firebaseData.medicines =
                snapshot.docs.map(
                    function(doc) {

                        return {

                            firestoreId: doc.id,

                            ...doc.data()

                        };

                    }
                );


            console.log(
                "MEDICINES UPDATED:",
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


    // =====================================================
    // REMINDERS
    // =====================================================

    onSnapshot(

        collection(db, "Reminders"),

        function(snapshot) {

            firebaseData.reminders =
                snapshot.docs.map(
                    function(doc) {

                        return {

                            firestoreId: doc.id,

                            ...doc.data()

                        };

                    }
                );


            console.log(
                "REMINDERS UPDATED:",
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


    // =====================================================
    // DOSE HISTORY
    // =====================================================

    onSnapshot(

        collection(db, "Dose History"),

        function(snapshot) {

            firebaseData.doseHistory =
                snapshot.docs.map(
                    function(doc) {

                        return {

                            firestoreId: doc.id,

                            ...doc.data()

                        };

                    }
                );


            console.log(
                "DOSE HISTORY UPDATED:",
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


    // =====================================================
    // SOS EVENTS
    // =====================================================

    onSnapshot(

        collection(db, "SOS Events"),

        function(snapshot) {

            firebaseData.sosEvents =
                snapshot.docs.map(
                    function(doc) {

                        return {

                            firestoreId: doc.id,

                            ...doc.data()

                        };

                    }
                );


            console.log(
                "SOS EVENTS UPDATED:",
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


    // =====================================================
    // CAREGIVERS
    // =====================================================

    onSnapshot(

        collection(db, "Caregivers"),

        function(snapshot) {

            firebaseData.caregivers =
                snapshot.docs.map(
                    function(doc) {

                        return {

                            firestoreId: doc.id,

                            ...doc.data()

                        };

                    }
                );


            console.log(
                "CAREGIVERS UPDATED:",
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

}


// =========================================================
// PAGE NAVIGATION
// =========================================================

function showPage(pageId) {

    const pages =
        document.querySelectorAll(
            ".page"
        );


    pages.forEach(
        function(page) {

            page.classList.remove(
                "active-page"
            );

        }
    );


    const selectedPage =
        document.getElementById(
            pageId
        );


    if (selectedPage) {

        selectedPage.classList.add(
            "active-page"
        );

    }


    const pageTitles = {

        dashboard: "Dashboard",

        patients: "Patients",

        medicines: "Medicines",

        reminders: "Reminders",

        history: "Dose History",

        alerts: "Alerts",

        sos: "SOS Events"

    };


    const pageTitle =
        document.getElementById(
            "page-title"
        );


    if (pageTitle) {

        pageTitle.textContent =
            pageTitles[pageId] ||
            "Dashboard";

    }


    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        function(item) {

            item.classList.remove(
                "active"
            );

        }
    );


    navItems.forEach(
        function(item) {

            const onclick =
                item.getAttribute(
                    "onclick"
                );


            if (
                onclick ===
                "showPage('" +
                pageId +
                "')"
            ) {

                item.classList.add(
                    "active"
                );

            }

        }
    );

}


window.showPage = showPage;


// =========================================================
// DASHBOARD
// =========================================================

function updateDashboard() {


    // =====================================================
    // STATISTICS
    // =====================================================

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


    // =====================================================
    // PATIENT INFORMATION
    // =====================================================

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


        // EXACT FIRESTORE FIELD: name

        if (patientName) {

            patientName.textContent =
                patient.name ??
                "-";

        }


        // EXACT FIRESTORE FIELD: patientId

        if (patientId) {

            patientId.textContent =
                patient.patientId ??
                "-";

        }


        // EXACT FIRESTORE FIELD: age

        if (patientAge) {

            patientAge.textContent =
                patient.age ??
                "-";

        }


        // EXACT FIRESTORE FIELD: caregiverID

        if (caregiverId) {

            caregiverId.textContent =
                patient.caregiverID ??
                "-";

        }

    }


    // =====================================================
    // MEDICINE INFORMATION
    // =====================================================

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
                medicine.name ??
                "-";

        }


        if (medicineStock) {

            medicineStock.textContent =
                medicine.stock ??
                "-";

        }


        if (medicineCompartment) {

            medicineCompartment.textContent =
                medicine.compartment ??
                "-";

        }


        if (medicineExpiry) {

            medicineExpiry.textContent =
                medicine.expiry ??
                "-";

        }

    }


    // =====================================================
    // NEXT REMINDER
    // =====================================================

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
                reminder.time ??
                reminder.reminderTime ??
                "-";

        }


        if (reminderName) {

            reminderName.textContent =
                reminder.medicineName ??
                reminder.medicine ??
                "-";

        }


        if (reminderDose) {

            reminderDose.textContent =
                reminder.dose ??
                reminder.quantity ??
                "-";

        }


        if (reminderStatus) {

            reminderStatus.textContent =
                String(
                    reminder.status ??
                    "PENDING"
                ).toUpperCase();

        }

    }


    // =====================================================
    // LAST DOSE
    // =====================================================

    const lastDose =
        firebaseData.doseHistory[0];


    if (lastDose) {


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
                lastDose.medicineName ??
                lastDose.medicine ??
                "-";

        }


        if (doseScheduled) {

            doseScheduled.textContent =
                "Scheduled: " +
                (
                    lastDose.scheduled ??
                    lastDose.scheduledTime ??
                    "-"
                );

        }


        if (doseActual) {

            doseActual.textContent =
                "Actual: " +
                (
                    lastDose.actual ??
                    lastDose.actualTime ??
                    "-"
                );

        }


        if (doseStatus) {

            doseStatus.textContent =
                String(
                    lastDose.status ??
                    "TAKEN"
                ).toUpperCase();

        }

    }

}


// =========================================================
// PATIENTS PAGE
// =========================================================
// EXACT FIRESTORE FIELDS:
//
// patientId
// name
// age
// caregiverID
//
// NO OLD/HARDCODED DATA
// =========================================================

function updatePatientsPage() {

    const tbody =
        document.getElementById(
            "patients-table-body"
        );


    if (!tbody) {

        console.error(
            "patients-table-body not found!"
        );

        return;

    }


    // Completely clear the old table

    tbody.innerHTML = "";


    // =====================================================
    // NO PATIENTS
    // =====================================================

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


    // =====================================================
    // LOAD CURRENT FIRESTORE PATIENT DATA
    // =====================================================

    firebaseData.patients.forEach(
        function(patient) {


            const row =
                document.createElement("tr");


            // EXACT FIELD: patientId

            const patientId =
                patient.patientId ??
                "-";


            // EXACT FIELD: name

            const name =
                patient.name ??
                "-";


            // EXACT FIELD: age

            const age =
                patient.age ??
                "-";


            // EXACT FIELD: caregiverID

            const caregiverID =
                patient.caregiverID ??
                "-";


            row.innerHTML = `

                <td>
                    ${escapeHTML(patientId)}
                </td>

                <td>
                    ${escapeHTML(name)}
                </td>

                <td>
                    ${escapeHTML(age)}
                </td>

                <td>
                    ${escapeHTML(caregiverID)}
                </td>

            `;


            tbody.appendChild(row);

        }
    );


    console.log(
        "PATIENTS PAGE CURRENT DATA:",
        firebaseData.patients
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


    if (!tbody) {

        return;

    }


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


            row.innerHTML = `

                <td>

                    ${
                        medicine.medicineId ??
                        medicine.id ??
                        medicine.firestoreId ??
                        "-"
                    }

                </td>

                <td>

                    ${
                        medicine.name ??
                        "-"
                    }

                </td>

                <td>

                    ${
                        medicine.stock ??
                        "-"
                    }

                </td>

                <td>

                    ${
                        medicine.expiry ??
                        "-"
                    }

                </td>

                <td>

                    ${
                        medicine.compartment ??
                        "-"
                    }

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


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        firebaseData.reminders.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div>⏰</div>

                <h3>
                    No Reminders
                </h3>

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
                        reminder.time ??
                        reminder.reminderTime ??
                        "-"
                    }

                </div>

                <div>

                    <h3>

                        ${
                            reminder.medicineName ??
                            reminder.medicine ??
                            "Medicine"
                        }

                    </h3>

                    <p>

                        Dose:

                        ${
                            reminder.dose ??
                            reminder.quantity ??
                            "-"
                        }

                    </p>

                </div>

                <span class="status pending">

                    ${
                        String(
                            reminder.status ??
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
// DOSE HISTORY PAGE
// =========================================================

function updateDoseHistoryPage() {

    const tbody =
        document.getElementById(
            "history-table-body"
        );


    if (!tbody) {

        return;

    }


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


            row.innerHTML = `

                <td>

                    ${
                        dose.medicineName ??
                        dose.medicine ??
                        "-"
                    }

                </td>

                <td>

                    ${
                        dose.date ??
                        "-"
                    }

                </td>

                <td>

                    ${
                        dose.scheduled ??
                        dose.scheduledTime ??
                        "-"
                    }

                </td>

                <td>

                    ${
                        dose.actual ??
                        dose.actualTime ??
                        "-"
                    }

                </td>

                <td>

                    <span class="status taken">

                        ${
                            String(
                                dose.status ??
                                "TAKEN"
                            ).toUpperCase()
                        }

                    </span>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


// =========================================================
// ALERTS PAGE
// =========================================================

function updateAlertsPage() {

    const container =
        document.getElementById(
            "alerts-content"
        );


    if (!container) {

        return;

    }


    if (
        firebaseData.sosEvents.length === 0
    ) {

        container.innerHTML = `

            <div>✅</div>

            <h3>
                No Active Alerts
            </h3>

            <p>
                There are currently no alerts.
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
                Please check the SOS Events section.
            </p>

        `;

    }

}


// =========================================================
// SOS PAGE
// =========================================================

function updateSOSPage() {

    const container =
        document.getElementById(
            "sos-content"
        );


    if (!container) {

        return;

    }


    if (
        firebaseData.sosEvents.length === 0
    ) {

        container.innerHTML = `

            <div>🛡️</div>

            <h3>
                No SOS Events
            </h3>

            <p>
                No emergency event has been triggered.
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
                    SOS Event
                </h3>

                <p>

                    Event ID:

                    ${
                        event.id ??
                        event.firestoreId ??
                        "-"
                    }

                </p>

                <p>

                    Patient:

                    ${
                        event.patientId ??
                        event.patientID ??
                        "-"
                    }

                </p>

                <p>

                    Status:

                    ${
                        event.status ??
                        "-"
                    }

                </p>

            `;


            container.appendChild(
                eventBox
            );

        }
    );

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(value) {

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
// INITIAL PAGE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showPage("dashboard");

    }
);
