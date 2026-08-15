// ============================================================
// SMART MEDICINE SYSTEM
// CAREGIVER LOGIN → CAREGIVER → PATIENT
// REALTIME FIRESTORE VERSION
// ============================================================

import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// ============================================================
// GLOBAL DATA
// ============================================================

let currentUser = null;

let currentCaregiver = null;

let currentPatient = null;

let firebaseData = {

    medicines: [],

    reminders: [],

    doseHistory: [],

    sosEvents: []

};


// ============================================================
// AUTHENTICATION
// ============================================================

onAuthStateChanged(auth, async function(user) {

    if (!user) {

        console.log("No user logged in.");

        window.location.href = "login.html";

        return;

    }


    currentUser = user;


    console.log(
        "Logged-in Firebase UID:",
        user.uid
    );

    console.log(
        "Logged-in Email:",
        user.email
    );


    updateUserInformation(user);


    // Find the caregiver and patient
    await loadCaregiverAndPatient();

});


// ============================================================
// SHOW LOGGED-IN CAREGIVER
// ============================================================

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
            user.email || "Logged-in User";

    }

}


// ============================================================
// LOAD CAREGIVER
// ============================================================

async function loadCaregiverAndPatient() {

    try {

        console.log(
            "Looking for caregiver:",
            currentUser.uid
        );


        // ====================================================
        // CAREGIVER DOCUMENT ID = FIREBASE AUTH UID
        // ====================================================

        const caregiverRef =
            doc(
                db,
                "Caregivers",
                currentUser.uid
            );


        const caregiverSnapshot =
            await getDoc(caregiverRef);


        if (!caregiverSnapshot.exists()) {

            console.error(
                "Caregiver document not found."
            );


            alert(
                "Caregiver account is not connected to a patient."
            );


            return;

        }


        currentCaregiver = {

            id: caregiverSnapshot.id,

            ...caregiverSnapshot.data()

        };


        console.log(
            "Current caregiver:",
            currentCaregiver
        );


        // ====================================================
        // GET PATIENT ID FROM CAREGIVER
        // ====================================================

        const patientId =
            currentCaregiver.patientId;


        if (!patientId) {

            console.error(
                "patientId is missing from caregiver."
            );


            alert(
                "No patient is assigned to this caregiver."
            );


            return;

        }


        console.log(
            "Assigned patient ID:",
            patientId
        );


        // ====================================================
        // LOAD PATIENT
        // ====================================================

        loadPatient(patientId);


        // ====================================================
        // LOAD OTHER FIRESTORE DATA
        // ====================================================

        startRealtimeDataListeners();

    }

    catch (error) {

        console.error(
            "Caregiver loading error:",
            error
        );

    }

}


// ============================================================
// LOAD THE CORRECT PATIENT
// ============================================================

function loadPatient(patientId) {

    console.log(
        "Searching for patient:",
        patientId
    );


    const patientsQuery =
        query(
            collection(db, "Patients"),
            where(
                "patientId",
                "==",
                patientId
            )
        );


    onSnapshot(
        patientsQuery,

        function(snapshot) {

            if (snapshot.empty) {

                console.error(
                    "Patient not found:",
                    patientId
                );


                currentPatient = null;


                clearPatientInformation();


                return;

            }


            // =================================================
            // GET THE MATCHING PATIENT
            // =================================================

            const patientDocument =
                snapshot.docs[0];


            currentPatient = {

                firestoreId:
                    patientDocument.id,

                ...patientDocument.data()

            };


            console.log(
                "CURRENT PATIENT:",
                currentPatient
            );


            // =================================================
            // UPDATE DASHBOARD
            // =================================================

            updatePatientDashboard();


            // =================================================
            // UPDATE PATIENTS PAGE
            // =================================================

            updatePatientsPage();

        },

        function(error) {

            console.error(
                "Patient realtime error:",
                error
            );

        }
    );

}


// ============================================================
// CLEAR PATIENT INFORMATION
// ============================================================

function clearPatientInformation() {

    const name =
        document.getElementById(
            "dashboard-patient-name"
        );

    const id =
        document.getElementById(
            "dashboard-patient-id"
        );

    const age =
        document.getElementById(
            "dashboard-patient-age"
        );

    const caregiver =
        document.getElementById(
            "dashboard-caregiver-id"
        );


    if (name) {

        name.textContent =
            "Patient not found";

    }


    if (id) {

        id.textContent =
            "-";

    }


    if (age) {

        age.textContent =
            "-";

    }


    if (caregiver) {

        caregiver.textContent =
            "-";

    }

}


// ============================================================
// UPDATE PATIENT DASHBOARD
// ============================================================

function updatePatientDashboard() {

    if (!currentPatient) {

        return;

    }


    const name =
        document.getElementById(
            "dashboard-patient-name"
        );

    const id =
        document.getElementById(
            "dashboard-patient-id"
        );

    const age =
        document.getElementById(
            "dashboard-patient-age"
        );

    const caregiver =
        document.getElementById(
            "dashboard-caregiver-id"
        );


    // EXACT FIRESTORE FIELD: name

    if (name) {

        name.textContent =
            currentPatient.name || "-";

    }


    // EXACT FIRESTORE FIELD: patientId

    if (id) {

        id.textContent =
            currentPatient.patientId || "-";

    }


    // EXACT FIRESTORE FIELD: age

    if (age) {

        age.textContent =
            currentPatient.age ?? "-";

    }


    // EXACT FIRESTORE FIELD: caregiverID

    if (caregiver) {

        caregiver.textContent =
            currentPatient.caregiverID || "-";

    }

}


// ============================================================
// PATIENTS PAGE
// ============================================================

function updatePatientsPage() {

    const tbody =
        document.getElementById(
            "patients-table-body"
        );


    if (!tbody) {

        return;

    }


    // Remove old data

    tbody.innerHTML = "";


    // No patient

    if (!currentPatient) {

        tbody.innerHTML = `

            <tr>

                <td colspan="4">

                    Patient not found.

                </td>

            </tr>

        `;

        return;

    }


    // ========================================================
    // ONLY SHOW THE PATIENT BELONGING TO LOGGED-IN CAREGIVER
    // ========================================================

    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td>

            ${escapeHTML(
                currentPatient.patientId || "-"
            )}

        </td>

        <td>

            ${escapeHTML(
                currentPatient.name || "-"
            )}

        </td>

        <td>

            ${escapeHTML(
                currentPatient.age ?? "-"
            )}

        </td>

        <td>

            ${escapeHTML(
                currentPatient.caregiverID || "-"
            )}

        </td>

    `;


    tbody.appendChild(row);


    console.log(
        "Patients page updated with current logged-in patient's data."
    );

}


// ============================================================
// REALTIME OTHER DATA
// ============================================================

function startRealtimeDataListeners() {


    // ========================================================
    // MEDICINES
    // ========================================================

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


            updateMedicineDashboard();

            updateMedicinesPage();

        },

        function(error) {

            console.error(
                "Medicines error:",
                error
            );

        }

    );


    // ========================================================
    // REMINDERS
    // ========================================================

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


            updateReminderDashboard();

            updateRemindersPage();

        },

        function(error) {

            console.error(
                "Reminders error:",
                error
            );

        }

    );


    // ========================================================
    // DOSE HISTORY
    // ========================================================

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


            updateDoseDashboard();

            updateDoseHistoryPage();

        },

        function(error) {

            console.error(
                "Dose History error:",
                error
            );

        }

    );


    // ========================================================
    // SOS EVENTS
    // ========================================================

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


            updateAlertsPage();

            updateSOSPage();

        },

        function(error) {

            console.error(
                "SOS error:",
                error

            );

        }

    );

}


// ============================================================
// DASHBOARD STATISTICS
// ============================================================

function updateStatistics() {

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
            currentPatient ? "1" : "0";

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

}


// ============================================================
// MEDICINE DASHBOARD
// ============================================================

function updateMedicineDashboard() {

    updateStatistics();


    const medicine =
        firebaseData.medicines[0];


    if (!medicine) {

        return;

    }


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
            medicine.name || "-";

    }


    if (stock) {

        stock.textContent =
            medicine.stock ?? "-";

    }


    if (compartment) {

        compartment.textContent =
            medicine.compartment || "-";

    }


    if (expiry) {

        expiry.textContent =
            medicine.expiry || "-";

    }

}


// ============================================================
// MEDICINES PAGE
// ============================================================

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

                    ${escapeHTML(
                        medicine.medicineId ??
                        medicine.medicineID ??
                        medicine.id ??
                        medicine.firestoreId ??
                        "-"
                    )}

                </td>

                <td>

                    ${escapeHTML(
                        medicine.name || "-"
                    )}

                </td>

                <td>

                    ${escapeHTML(
                        medicine.stock ?? "-"
                    )}

                </td>

                <td>

                    ${escapeHTML(
                        medicine.expiry || "-"
                    )}

                </td>

                <td>

                    ${escapeHTML(
                        medicine.compartment || "-"
                    )}

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


// ============================================================
// REMINDER DASHBOARD
// ============================================================

function updateReminderDashboard() {

    updateStatistics();


    const reminder =
        firebaseData.reminders[0];


    if (!reminder) {

        return;

    }


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


// ============================================================
// REMINDERS PAGE
// ============================================================

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


// ============================================================
// DOSE DASHBOARD
// ============================================================

function updateDoseDashboard() {

    const dose =
        firebaseData.doseHistory[0];


    if (!dose) {

        return;

    }


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
            dose.medicineName ??
            dose.medicine ??
            "-";

    }


    if (scheduled) {

        scheduled.textContent =
            "Scheduled: " +
            (
                dose.scheduled ??
                dose.scheduledTime ??
                "-"
            );

    }


    if (actual) {

        actual.textContent =
            "Actual: " +
            (
                dose.actual ??
                dose.actualTime ??
                "-"
            );

    }


    if (status) {

        status.textContent =
            String(
                dose.status ??
                "TAKEN"
            ).toUpperCase();

    }

}


// ============================================================
// DOSE HISTORY PAGE
// ============================================================

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


// ============================================================
// ALERTS
// ============================================================

function updateAlertsPage() {

    const container =
        document.getElementById(
            "alerts-content"
        );


    if (!container) {

        return;

    }


    updateStatistics();


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


// ============================================================
// SOS
// ============================================================

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


// ============================================================
// PAGE NAVIGATION
// ============================================================

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(function(page) {

            page.classList.remove(
                "active-page"
            );

        });


    const page =
        document.getElementById(
            pageId
        );


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
            titles[pageId] ||
            "Dashboard";

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(function(item) {

            item.classList.remove(
                "active"
            );

        });

}


window.showPage = showPage;


// ============================================================
// LOGOUT
// ============================================================

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


// ============================================================
// HTML SAFETY
// ============================================================

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


// ============================================================
// INITIAL PAGE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showPage("dashboard");

    }
);
