// ============================================================
// SMART MEDICINE SYSTEM
// LOGIN → CAREGIVER → PATIENT
// ============================================================


import {
    auth,
    db
} from "./firebase-config.js";


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
// GLOBAL VARIABLES
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

onAuthStateChanged(
    auth,
    async function(user) {


        // No logged-in user

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        currentUser = user;


        console.log(
            "Logged-in UID:",
            user.uid
        );


        console.log(
            "Logged-in Email:",
            user.email
        );


        // Load caregiver

        await loadCaregiver();


    }
);



// ============================================================
// LOAD CAREGIVER
// ============================================================

async function loadCaregiver() {


    try {


        console.log(
            "Searching Caregivers document:",
            currentUser.uid
        );


        /*
         IMPORTANT:

         Firestore structure:

         Caregivers
            └── Firebase UID
                 ├── name
                 └── patientId
        */


        const caregiverRef = doc(
            db,
            "Caregivers",
            currentUser.uid
        );


        const caregiverSnapshot =
            await getDoc(caregiverRef);



        // Caregiver document doesn't exist

        if (!caregiverSnapshot.exists()) {


            console.error(
                "Caregiver document NOT FOUND."
            );


            alert(
                "Caregiver account is not connected to a patient."
            );


            return;

        }



        // Save caregiver

        currentCaregiver = {

            id:
                caregiverSnapshot.id,

            ...caregiverSnapshot.data()

        };



        console.log(
            "Caregiver data:",
            currentCaregiver
        );



        // Update caregiver information

        updateCaregiver();



        // Get patient ID

        const patientId =
            currentCaregiver.patientId;



        if (!patientId) {


            alert(
                "This caregiver does not have a patientId."
            );


            return;

        }



        console.log(
            "Assigned patient:",
            patientId
        );



        // Load patient

        loadPatient(patientId);



        // Load other collections

        loadMedicines();

        loadReminders();

        loadDoseHistory();

        loadSOS();


    }

    catch (error) {


        console.error(
            "Caregiver error:",
            error
        );


        alert(
            "Error loading caregiver information."
        );

    }

}



// ============================================================
// CAREGIVER INFORMATION
// ============================================================

function updateCaregiver() {


    if (!currentCaregiver) {

        return;

    }



    const name =
        document.getElementById(
            "caregiver-name"
        );


    const id =
        document.getElementById(
            "caregiver-id"
        );


    const email =
        document.getElementById(
            "caregiver-email"
        );


    const patientId =
        document.getElementById(
            "caregiver-patient-id"
        );



    if (name) {

        name.textContent =
            currentCaregiver.name ||
            "Caregiver";

    }



    if (id) {

        id.textContent =
            currentCaregiver.id ||
            "-";

    }



    if (email) {

        email.textContent =
            currentUser.email ||
            "-";

    }



    if (patientId) {

        patientId.textContent =
            currentCaregiver.patientId ||
            "-";

    }



    // Top-right caregiver

    const topName =
        document.getElementById(
            "top-caregiver-name"
        );


    const topEmail =
        document.getElementById(
            "top-caregiver-email"
        );


    if (topName) {

        topName.textContent =
            currentCaregiver.name ||
            "Caregiver";

    }


    if (topEmail) {

        topEmail.textContent =
            currentUser.email ||
            "";

    }

}



// ============================================================
// LOAD PATIENT
// ============================================================

function loadPatient(patientId) {


    console.log(
        "Searching patient:",
        patientId
    );


    const patientsQuery =
        query(

            collection(
                db,
                "Patients"
            ),

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


                showPatientNotFound();


                return;

            }



            /*
             We only use the patient
             belonging to this caregiver.
            */

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



            updatePatientDashboard();

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
// PATIENT NOT FOUND
// ============================================================

function showPatientNotFound() {


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



    const tbody =
        document.getElementById(
            "patients-table-body"
        );


    if (tbody) {

        tbody.innerHTML = `

            <tr>

                <td colspan="4">

                    Patient not found.

                </td>

            </tr>

        `;

    }

}



// ============================================================
// UPDATE DASHBOARD PATIENT
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



    if (name) {

        name.textContent =
            currentPatient.name ||
            "-";

    }


    if (id) {

        id.textContent =
            currentPatient.patientId ||
            "-";

    }


    if (age) {

        age.textContent =
            currentPatient.age ??
            "-";

    }


    if (caregiver) {

        caregiver.textContent =
            currentPatient.caregiverID ||
            currentCaregiver.id ||
            "-";

    }


    // Patient count

    const count =
        document.getElementById(
            "patients-count"
        );


    if (count) {

        count.textContent = "1";

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



    tbody.innerHTML = "";



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



    const row =
        document.createElement("tr");



    row.innerHTML = `

        <td>

            ${escapeHTML(
                currentPatient.patientId ||
                "-"
            )}

        </td>


        <td>

            ${escapeHTML(
                currentPatient.name ||
                "-"
            )}

        </td>


        <td>

            ${escapeHTML(
                currentPatient.age ??
                "-"
            )}

        </td>


        <td>

            ${escapeHTML(
                currentPatient.caregiverID ||
                currentCaregiver.id ||
                "-"
            )}

        </td>

    `;



    tbody.appendChild(row);

}



// ============================================================
// MEDICINES
// ============================================================

function loadMedicines() {


    onSnapshot(

        collection(
            db,
            "Medicines"
        ),

        function(snapshot) {


            firebaseData.medicines =
                snapshot.docs.map(
                    function(item) {

                        return {

                            firestoreId:
                                item.id,

                            ...item.data()

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

}



// ============================================================
// MEDICINE DASHBOARD
// ============================================================

function updateMedicineDashboard() {


    const count =
        document.getElementById(
            "medicines-count"
        );


    if (count) {

        count.textContent =
            firebaseData.medicines.length;

    }



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
            medicine.name ||
            "-";

    }


    if (stock) {

        stock.textContent =
            medicine.stock ??
            "-";

    }


    if (compartment) {

        compartment.textContent =
            medicine.compartment ||
            "-";

    }


    if (expiry) {

        expiry.textContent =
            medicine.expiry ||
            "-";

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
                        medicine.medicineId ||
                        medicine.medicineID ||
                        medicine.firestoreId ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        medicine.name ||
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
                        medicine.expiry ||
                        "-"
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        medicine.compartment ||
                        "-"
                    )}

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}



// ============================================================
// REMINDERS
// ============================================================

function loadReminders() {


    onSnapshot(

        collection(
            db,
            "Reminders"
        ),

        function(snapshot) {


            firebaseData.reminders =
                snapshot.docs.map(
                    function(item) {

                        return {

                            firestoreId:
                                item.id,

                            ...item.data()

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

}



// ============================================================
// REMINDER DASHBOARD
// ============================================================

function updateReminderDashboard() {


    const count =
        document.getElementById(
            "reminders-count"
        );


    if (count) {

        count.textContent =
            firebaseData.reminders.length;

    }



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
            reminder.time ||
            reminder.reminderTime ||
            "-";

    }


    if (name) {

        name.textContent =
            reminder.medicineName ||
            reminder.medicine ||
            "-";

    }


    if (dose) {

        dose.textContent =
            reminder.dose ||
            reminder.quantity ||
            "-";

    }


    if (status) {

        status.textContent =
            String(
                reminder.status ||
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

                <div>
                    ⏰
                </div>

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

                <div>

                    <strong>

                        ${
                            reminder.time ||
                            reminder.reminderTime ||
                            "-"
                        }

                    </strong>

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



// ============================================================
// DOSE HISTORY
// ============================================================

function loadDoseHistory() {


    onSnapshot(

        collection(
            db,
            "Dose History"
        ),

        function(snapshot) {


            firebaseData.doseHistory =
                snapshot.docs.map(
                    function(item) {

                        return {

                            firestoreId:
                                item.id,

                            ...item.data()

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
            dose.medicineName ||
            dose.medicine ||
            "-";

    }


    if (scheduled) {

        scheduled.textContent =
            "Scheduled: " +
            (
                dose.scheduled ||
                dose.scheduledTime ||
                "-"
            );

    }


    if (actual) {

        actual.textContent =
            "Actual: " +
            (
                dose.actual ||
                dose.actualTime ||
                "-"
            );

    }


    if (status) {

        status.textContent =
            String(
                dose.status ||
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
                        dose.medicineName ||
                        dose.medicine ||
                        "-"
                    }

                </td>


                <td>

                    ${
                        dose.date ||
                        "-"
                    }

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

                    ${
                        dose.status ||
                        "-"
                    }

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}



// ============================================================
// SOS
// ============================================================

function loadSOS() {


    onSnapshot(

        collection(
            db,
            "SOS Events"
        ),

        function(snapshot) {


            firebaseData.sosEvents =
                snapshot.docs.map(
                    function(item) {

                        return {

                            firestoreId:
                                item.id,

                            ...item.data()

                        };

                    }
                );



            updateSOS();

            updateAlerts();

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
// SOS PAGE
// ============================================================

function updateSOS() {


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

            <div>
                🛡️
            </div>

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


            const item =
                document.createElement("div");


            item.className =
                "sos-event";


            item.innerHTML = `

                <h3>
                    🚨 SOS Event
                </h3>


                <p>

                    Patient:

                    ${
                        event.patientId ||
                        "-"
                    }

                </p>


                <p>

                    Status:

                    ${
                        event.status ||
                        "-"
                    }

                </p>

            `;


            container.appendChild(item);

        }
    );

}



// ============================================================
// ALERTS
// ============================================================

function updateAlerts() {


    const container =
        document.getElementById(
            "alerts-content"
        );


    if (!container) {

        return;

    }



    const count =
        document.getElementById(
            "alerts-count"
        );


    if (count) {

        count.textContent =
            firebaseData.sosEvents.length;

    }



    if (
        firebaseData.sosEvents.length === 0
    ) {


        container.innerHTML = `

            <div>
                ✅
            </div>

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

            <div>
                ⚠️
            </div>

            <h3>

                ${
                    firebaseData.sosEvents.length
                }

                Alert(s)

            </h3>

            <p>
                Please check the SOS section.
            </p>

        `;

    }

}



// ============================================================
// PAGE NAVIGATION
// ============================================================

function showPage(pageId) {


    document
        .querySelectorAll(".page")
        .forEach(
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



    const titles = {

        dashboard:
            "Dashboard",

        patients:
            "Patients",

        caregiver:
            "Caregiver",

        medicines:
            "Medicines",

        reminders:
            "Reminders",

        history:
            "Dose History",

        alerts:
            "Alerts",

        sos:
            "SOS Events"

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
        .forEach(
            function(button) {

                button.classList.remove(
                    "active"
                );

            }
        );

}



// Make available to HTML onclick

window.showPage =
    showPage;



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



// Make available to HTML

window.logout =
    logout;



// ============================================================
// HTML ESCAPE
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

        showPage(
            "dashboard"
        );

    }
);
