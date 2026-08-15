// =========================================================
// SMART MEDICINE SYSTEM
// FIREBASE AUTH + REALTIME FIRESTORE
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
// GLOBAL DATA
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

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    console.log("Logged in:", user.email);

    updateUserInformation(user);

    startRealtimeListeners();

});


// =========================================================
// SHOW LOGGED-IN USER
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
// REALTIME FIRESTORE
// =========================================================

function startRealtimeListeners() {

    console.log("Starting realtime listeners...");


    // =====================================================
    // PATIENTS
    // =====================================================

    onSnapshot(
        collection(db, "Patients"),

        (snapshot) => {

            firebaseData.patients =
                snapshot.docs.map((doc) => {

                    return {
                        firestoreId: doc.id,
                        ...doc.data()
                    };

                });


            console.log(
                "CURRENT PATIENT DATA:",
                firebaseData.patients
            );


            // Update BOTH dashboard and patients page
            updateDashboard();

            updatePatientsPage();

        },

        (error) => {

            console.error(
                "Patients Firestore error:",
                error
            );

        }
    );


    // =====================================================
    // MEDICINES
    // =====================================================

    onSnapshot(
        collection(db, "Medicines"),

        (snapshot) => {

            firebaseData.medicines =
                snapshot.docs.map((doc) => {

                    return {
                        firestoreId: doc.id,
                        ...doc.data()
                    };

                });


            console.log(
                "CURRENT MEDICINE DATA:",
                firebaseData.medicines
            );


            updateDashboard();

            updateMedicinesPage();

        },

        (error) => {

            console.error(
                "Medicines Firestore error:",
                error
            );

        }
    );


    // =====================================================
    // REMINDERS
    // =====================================================

    onSnapshot(
        collection(db, "Reminders"),

        (snapshot) => {

            firebaseData.reminders =
                snapshot.docs.map((doc) => {

                    return {
                        firestoreId: doc.id,
                        ...doc.data()
                    };

                });


            console.log(
                "CURRENT REMINDER DATA:",
                firebaseData.reminders
            );


            updateDashboard();

            updateRemindersPage();

        },

        (error) => {

            console.error(
                "Reminders Firestore error:",
                error
            );

        }
    );


    // =====================================================
    // DOSE HISTORY
    // =====================================================

    onSnapshot(
        collection(db, "Dose History"),

        (snapshot) => {

            firebaseData.doseHistory =
                snapshot.docs.map((doc) => {

                    return {
                        firestoreId: doc.id,
                        ...doc.data()
                    };

                });


            console.log(
                "CURRENT DOSE HISTORY:",
                firebaseData.doseHistory
            );


            updateDashboard();

            updateDoseHistoryPage();

        },

        (error) => {

            console.error(
                "Dose History Firestore error:",
                error
            );

        }
    );


    // =====================================================
    // SOS EVENTS
    // =====================================================

    onSnapshot(
        collection(db, "SOS Events"),

        (snapshot) => {

            firebaseData.sosEvents =
                snapshot.docs.map((doc) => {

                    return {
                        firestoreId: doc.id,
                        ...doc.data()
                    };

                });


            console.log(
                "CURRENT SOS DATA:",
                firebaseData.sosEvents
            );


            updateDashboard();

            updateAlertsPage();

            updateSOSPage();

        },

        (error) => {

            console.error(
                "SOS Firestore error:",
                error
            );

        }
    );


    // =====================================================
    // CAREGIVERS
    // =====================================================

    onSnapshot(
        collection(db, "Caregivers"),

        (snapshot) => {

            firebaseData.caregivers =
                snapshot.docs.map((doc) => {

                    return {
                        firestoreId: doc.id,
                        ...doc.data()
                    };

                });


            console.log(
                "CURRENT CAREGIVER DATA:",
                firebaseData.caregivers
            );

        },

        (error) => {

            console.error(
                "Caregivers Firestore error:",
                error
            );

        }
    );

}


// =========================================================
// PAGE NAVIGATION
// =========================================================

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach((page) => {

            page.classList.remove(
                "active-page"
            );

        });


    const page =
        document.getElementById(pageId);


    if (page) {

        page.classList.add(
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


    const title =
        document.getElementById(
            "page-title"
        );


    if (title) {

        title.textContent =
            titles[pageId] || "Dashboard";

    }


    document
        .querySelectorAll(".nav-item")
        .forEach((item) => {

            item.classList.remove("active");

        });


    document
        .querySelectorAll(".nav-item")
        .forEach((item) => {

            const value =
                item.getAttribute("onclick");


            if (
                value ===
                `showPage('${pageId}')`
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
    // COUNTS
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
    // CURRENT PATIENT
    // -----------------------------------------------------

    const patient =
        firebaseData.patients[0];


    if (!patient) {

        return;

    }


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
            patient.name ??
            patient.patientName ??
            "-";

    }


    if (patientId) {

        patientId.textContent =
            patient.patientID ??
            patient.patientId ??
            patient.id ??
            patient.firestoreId ??
            "-";

    }


    if (patientAge) {

        patientAge.textContent =
            patient.age ??
            "-";

    }


    if (caregiverId) {

        caregiverId.textContent =
            patient.caregiverID ??
            patient.caregiverId ??
            patient.caregiver ??
            "-";

    }


    // -----------------------------------------------------
    // MEDICINE
    // -----------------------------------------------------

    const medicine =
        firebaseData.medicines[0];


    if (medicine) {

        const name =
            document.getElementById(
                "dashboard-medicine-name"
            );

        const stock =
            document.getElementById(
                "dashboard-medicine-stock"
            );

        const compartment =
            document.getElementById(
                "dashboard-medicine-compartment"
            );

        const expiry =
            document.getElementById(
                "dashboard-medicine-expiry"
            );


        if (name) {

            name.textContent =
                medicine.name ??
                "-";

        }


        if (stock) {

            stock.textContent =
                medicine.stock ??
                "-";

        }


        if (compartment) {

            compartment.textContent =
                medicine.compartment ??
                "-";

        }


        if (expiry) {

            expiry.textContent =
                medicine.expiry ??
                "-";

        }

    }


    // -----------------------------------------------------
    // REMINDER
    // -----------------------------------------------------

    const reminder =
        firebaseData.reminders[0];


    if (reminder) {

        const time =
            document.getElementById(
                "dashboard-reminder-time"
            );

        const name =
            document.getElementById(
                "dashboard-reminder-name"
            );

        const dose =
            document.getElementById(
                "dashboard-reminder-dose"
            );

        const status =
            document.getElementById(
                "dashboard-reminder-status"
            );


        if (time) {

            time.textContent =
                reminder.time ??
                reminder.reminderTime ??
                "-";

        }


        if (name) {

            name.textContent =
                reminder.medicineName ??
                reminder.medicine ??
                "-";

        }


        if (dose) {

            dose.textContent =
                reminder.dose ??
                reminder.quantity ??
                "-";

        }


        if (status) {

            status.textContent =
                String(
                    reminder.status ??
                    "PENDING"
                ).toUpperCase();

        }

    }


    // -----------------------------------------------------
    // LAST DOSE
    // -----------------------------------------------------

    const lastDose =
        firebaseData.doseHistory[0];


    if (lastDose) {

        const name =
            document.getElementById(
                "dashboard-dose-name"
            );

        const scheduled =
            document.getElementById(
                "dashboard-dose-scheduled"
            );

        const actual =
            document.getElementById(
                "dashboard-dose-actual"
            );

        const status =
            document.getElementById(
                "dashboard-dose-status"
            );


        if (name) {

            name.textContent =
                lastDose.medicineName ??
                lastDose.medicine ??
                "-";

        }


        if (scheduled) {

            scheduled.textContent =
                "Scheduled: " +
                (
                    lastDose.scheduled ??
                    lastDose.scheduledTime ??
                    "-"
                );

        }


        if (actual) {

            actual.textContent =
                "Actual: " +
                (
                    lastDose.actual ??
                    lastDose.actualTime ??
                    "-"
                );

        }


        if (status) {

            status.textContent =
                String(
                    lastDose.status ??
                    "TAKEN"
                ).toUpperCase();

        }

    }

}


// =========================================================
// ⭐ FIXED PATIENTS PAGE
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


    // IMPORTANT:
    // Completely remove old table rows
    tbody.innerHTML = "";


    // If Firestore has no patients
    if (
        firebaseData.patients.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="4">

                    No patients found in
                    Firestore.

                </td>

            </tr>

        `;

        return;

    }


    // =====================================================
    // CREATE TABLE DIRECTLY FROM FIRESTORE DATA
    // =====================================================

    firebaseData.patients.forEach(
        (patient) => {


            const row =
                document.createElement("tr");


            // Patient ID
            const patientID =
                patient.patientID ??
                patient.patientId ??
                patient.id ??
                patient.firestoreId ??
                "-";


            // Patient Name
            const patientName =
                patient.name ??
                patient.patientName ??
                "-";


            // Patient Age
            const patientAge =
                patient.age ??
                "-";


            // Caregiver ID
            const caregiverID =
                patient.caregiverID ??
                patient.caregiverId ??
                patient.caregiver ??
                "-";


            row.innerHTML = `

                <td>
                    ${escapeHTML(patientID)}
                </td>

                <td>
                    ${escapeHTML(patientName)}
                </td>

                <td>
                    ${escapeHTML(patientAge)}
                </td>

                <td>
                    ${escapeHTML(caregiverID)}
                </td>

            `;


            tbody.appendChild(row);

        }
    );


    console.log(
        "Patients page updated with:",
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
        (medicine) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        medicine.medicineID ??
                        medicine.medicineId ??
                        medicine.id ??
                        medicine.firestoreId ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        medicine.name ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        medicine.stock ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        medicine.expiry ??
                        "-"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        medicine.compartment ??
                        "-"
                    )}
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
        (reminder) => {

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
        (dose) => {

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
        (event) => {

            const box =
                document.createElement("div");


            box.className =
                "sos-event";


            box.innerHTML = `

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


            container.appendChild(box);

        }
    );

}


// =========================================================
// HTML SAFETY
// =========================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

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
    () => {

        showPage("dashboard");

    }
);
