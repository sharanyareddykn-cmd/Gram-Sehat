/* ================= PAGE NAVIGATION ================= */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
        window.scrollTo(0, 0);
    }
}


/* ================= ASHA LOGIN ================= */

function loginWorker() {

    const name = document.getElementById("workerName").value.trim();

    if (name === "") {
        alert("Please enter the ASHA worker name.");
        return;
    }

    document.getElementById("dashboardName").textContent = name;

    showPage("dashboard");
}


/* ================= VOICE INPUT ================= */

let recognition = null;

function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert(
            "Voice input is not supported by this browser. " +
            "Please use a supported browser or enter symptoms using text."
        );

        return;
    }

    const language =
        document.getElementById("language").value;

    const voiceButton =
        document.getElementById("voiceButton");

    const voiceStatus =
        document.getElementById("voiceStatus");

    recognition = new SpeechRecognition();

    recognition.lang = language;

    recognition.interimResults = false;

    recognition.continuous = false;

    voiceButton.textContent = "🎙 Listening...";

    voiceStatus.textContent =
        "Please speak clearly about the child's symptoms.";

    recognition.start();


    recognition.onresult = function(event) {

        const transcript =
            event.results[0][0].transcript;

        document.getElementById("symptoms").value =
            transcript;

        voiceButton.textContent =
            "🎙 Record Again";

        voiceStatus.textContent =
            "Transcription added. Please review it before continuing.";
    };


    recognition.onerror = function() {

        voiceButton.textContent =
            "🎙 Start Voice Input";

        voiceStatus.textContent =
            "Voice input could not be recorded. Please try again.";
    };


    recognition.onend = function() {

        voiceButton.textContent =
            "🎙 Start Voice Input";
    };
}


/* ================= CHILD ASSESSMENT ================= */

let currentSeverity = "Yellow";

function assessChild() {

    const childName =
        document.getElementById("childName").value.trim();

    const symptoms =
        document.getElementById("symptoms").value.trim();

    if (childName === "") {
        alert("Please enter the child's name.");
        return;
    }

    if (symptoms === "") {
        alert("Please enter or record the child's symptoms.");
        return;
    }


    /*
       DEMONSTRATION ONLY

       This is NOT the clinical F-IMNCI rule engine.
       Final medical rules must be entered from the
       validated F-IMNCI protocol.
    */

    const text = symptoms.toLowerCase();

    if (
        text.includes("unconscious") ||
        text.includes("difficulty breathing") ||
        text.includes("seizure")
    ) {

        currentSeverity = "Red";

    } else if (
        text.includes("fever") ||
        text.includes("vomiting") ||
        text.includes("diarrhea")
    ) {

        currentSeverity = "Yellow";

    } else {

        currentSeverity = "Green";
    }


    document.getElementById("resultChild").textContent =
        childName;

    document.getElementById("resultSymptoms").textContent =
        symptoms;


    const box =
        document.getElementById("severityBox");

    const title =
        document.getElementById("severityTitle");

    const textBox =
        document.getElementById("severityText");


    box.className = "severity";


    if (currentSeverity === "Red") {

        box.classList.add("red");

        title.textContent =
            "Urgent Attention";

        textBox.textContent =
            "The demonstration identified information requiring urgent referral review.";

    } else if (currentSeverity === "Yellow") {

        box.classList.add("yellow");

        title.textContent =
            "Priority Attention";

        textBox.textContent =
            "The demonstration identified information requiring priority assessment.";

    } else {

        box.classList.add("green");

        title.textContent =
            "Local Management / Follow-up";

        textBox.textContent =
            "No demonstration referral trigger was detected. Follow the validated clinical protocol.";

    }


    showPage("result");
}


/* ================= REFERRAL ================= */

function referCase(facility) {

    const caseId =
        "GS-" +
        Math.floor(1000 + Math.random() * 9000);

    document.getElementById("caseId").textContent =
        caseId;

    document.getElementById("referredFacility").textContent =
        facility;

    addCaseToTable(
        caseId,
        facility
    );

    showPage("confirmation");
}


/* ================= CASE TABLE ================= */

function addCaseToTable(caseId, facility) {

    const childName =
        document.getElementById("childName").value ||
        "Child";

    const table =
        document.getElementById("caseTable");

    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>${caseId}</td>
        <td>${childName}</td>
        <td><span class="yellow">${currentSeverity}</span></td>
        <td>${facility}</td>
        <td>Referred</td>
    `;

    table.prepend(row);
}