const SUPABASE_URL = "https://yggylbmqrgfgsmoraivw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_LQxD1w-2awtEhy5Cb5Xa0A_6-kcnhz-";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
console.log("Supabase connected:", supabaseClient);
// =====================================================
// CAMPUSCONNECT
// COMPLETE FRONTEND DEMO SYSTEM
// =====================================================


// ================= STORAGE =================

let problems =
    JSON.parse(localStorage.getItem("campusProblems")) || [];

let currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || null;


// ================= LOGIN ELEMENTS =================

const loginPage = document.getElementById("loginPage");
const app = document.getElementById("app");

const studentTab = document.getElementById("studentTab");
const adminTab = document.getElementById("adminTab");

const studentLoginForm =
    document.getElementById("studentLoginForm");

const adminLoginForm =
    document.getElementById("adminLoginForm");

const loginMessage =
    document.getElementById("loginMessage");


// ================= LOGIN TABS =================

studentTab.addEventListener("click", function () {

    studentTab.classList.add("active");
    adminTab.classList.remove("active");

    studentLoginForm.classList.remove("hidden");
    adminLoginForm.classList.add("hidden");

    loginMessage.textContent = "";

});


adminTab.addEventListener("click", function () {

    adminTab.classList.add("active");
    studentTab.classList.remove("active");

    adminLoginForm.classList.remove("hidden");
    studentLoginForm.classList.add("hidden");

    loginMessage.textContent = "";

});


// ================= STUDENT LOGIN =================

studentLoginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const password = document.getElementById("studentPassword").value;

    if (!name || !email || !password) {
        loginMessage.textContent = "Please fill all details.";
        return;
    }

    loginMessage.textContent = "Creating your account...";

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    role: "student"
                }
            }
        });

        if (error) {
            loginMessage.textContent = error.message;
            return;
        }

        if (data.session && data.user) {
            currentUser = {
                id: data.user.id,
                name: name,
                email: data.user.email,
                role: "student"
            };

            localStorage.setItem(
                "currentUser",
                JSON.stringify(currentUser)
            );

            openApplication();
        } else {
            loginMessage.textContent =
                "Account created! Please check your email to confirm your account before logging in.";
        }
    } catch (error) {
        loginMessage.textContent =
            "Connection error. Please try again.";
        console.error(error);
    }
});


// ================= ADMIN LOGIN =================

adminLoginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;


    if (
        email === "admin@campusconnect.com" &&
        password === "admin123"
    ) {

        currentUser = {

            name: "Campus Administrator",

            email: email,

            role: "admin"

        };


        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );


        openApplication();

    }

    else {

        loginMessage.textContent =
            "Incorrect admin email or password.";

    }

});


// ================= OPEN APPLICATION =================

function openApplication() {

    loginPage.classList.add("hidden");

    app.classList.remove("hidden");


    document.getElementById("loggedUserName")
        .textContent = currentUser.name;


    document.getElementById("loggedUserRole")
        .textContent =
        currentUser.role === "admin"
            ? "🛡️ Administrator"
            : "🎓 Student";


    updateStatistics();

    showHome();

}


// ================= LOGOUT =================

function logout() {

    localStorage.removeItem("currentUser");

    currentUser = null;

    app.classList.add("hidden");

    loginPage.classList.remove("hidden");

}


// ================= PAGE NAVIGATION =================

function hideAllPages() {

    document
        .querySelectorAll(".page-section")
        .forEach(function (section) {

            section.classList.add("hidden");

        });

}


function showHome() {

    hideAllPages();

    document
        .getElementById("homeSection")
        .classList.remove("hidden");

    updateStatistics();

}


function showProblems() {

    hideAllPages();

    document
        .getElementById("problemsSection")
        .classList.remove("hidden");

    renderProblems("All");

}


function showReport() {

    if (currentUser.role !== "student") {

        alert(
            "Only students can submit campus problems."
        );

        return;

    }


    hideAllPages();

    document
        .getElementById("reportSection")
        .classList.remove("hidden");

}


function showDashboard() {

    hideAllPages();


    if (currentUser.role === "admin") {

        document
            .getElementById("adminDashboard")
            .classList.remove("hidden");

        renderAdminDashboard();

    }

    else {

        document
            .getElementById("studentDashboard")
            .classList.remove("hidden");

        renderStudentDashboard();

    }

}


// ================= REPORT SUBMISSION =================

document
    .getElementById("problemForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const problem = {

            id: Date.now(),

            category:
                document
                    .getElementById("problemType")
                    .value,

            description:
                document
                    .getElementById("description")
                    .value
                    .trim(),

            location:
                document
                    .getElementById("location")
                    .value
                    .trim(),

            risk:
                document
                    .getElementById("riskLevel")
                    .value,

            affected:
                Number(
                    document
                        .getElementById("affectedCount")
                        .value
                ),

            duration:
                document
                    .getElementById("duration")
                    .value
                    .trim(),


            reporterName:
                currentUser.name,

            reporterEmail:
                currentUser.email,


            status: "Submitted",

            supporters: [],

            notification: "",

            createdAt:
                new Date().toLocaleString()

        };


        problems.unshift(problem);


        localStorage.setItem(
            "campusProblems",
            JSON.stringify(problems)
        );


        alert(
            "✅ Problem submitted successfully!\n\n" +
            "Admin can now see your report."
        );


        document
            .getElementById("problemForm")
            .reset();


        updateStatistics();

        showDashboard();

    });


// ================= RENDER PROBLEMS =================

function renderProblems(category) {

    const container =
        document.getElementById("problemList");


    container.innerHTML = "";


    let filteredProblems;


    if (category === "All") {

        filteredProblems = problems;

    }

    else {

        filteredProblems =
            problems.filter(function (problem) {

                return problem.category === category;

            });

    }


    if (filteredProblems.length === 0) {

        container.innerHTML = `

            <div class="problem-card">

                <h3>📭 No problems reported here</h3>

                <p>
                    Everything looks good in this category!
                </p>

            </div>

        `;

        return;

    }


    filteredProblems.forEach(function (problem) {

        const card =
            document.createElement("div");

        card.className = "problem-card";


        const priorityClass =
            problem.risk === "High" ||
            problem.risk === "Critical"
                ? "priority-high"
                : problem.risk === "Medium"
                    ? "priority-medium"
                    : "priority-low";


        const statusClass =
            problem.status === "Resolved"
                ? "status-resolved"
                : problem.status === "Investigating"
                    ? "status-investigating"
                    : "status-submitted";


        const alreadyFacing =
            problem.supporters.includes(
                currentUser.email
            );


        card.innerHTML = `

            <h3>
                ${getCategoryIcon(problem.category)}
                ${problem.category}
            </h3>

            <p>
                ${problem.description}
            </p>

            <div class="problem-meta">
                📍 ${problem.location}
            </div>

            <div class="problem-meta ${priorityClass}">
                🚨 Risk: ${problem.risk}
            </div>

            <div class="problem-meta">
                👥
                <strong>
                    ${problem.affected}
                </strong>
                people affected
            </div>

            <div class="problem-meta">
                ⏳ Existing for:
                ${problem.duration}
            </div>

            <div class="problem-meta">
                👤 Reported by:
                ${problem.reporterName}
            </div>

            <span class="status ${statusClass}">
                ${problem.status}
            </span>

            <br>

            <button
                class="facing-btn"
                onclick="supportProblem(${problem.id})"
                ${alreadyFacing ? "disabled" : ""}
            >

                ${alreadyFacing
                    ? "✅ You're facing this too"
                    : "🙋 I'm facing this too"}

            </button>

        `;


        container.appendChild(card);

    });

}


// ================= CATEGORY ICON =================

function getCategoryIcon(category) {

    const icons = {

        "Wi-Fi / Network": "📶",

        "Water": "💧",

        "Electricity": "⚡",

        "Canteen": "🍱",

        "Furniture": "🪑",

        "Safety": "🚨",

        "Other": "📌"

    };


    return icons[category] || "📌";

}


// ================= SUPPORT PROBLEM =================

function supportProblem(id) {

    const problem =
        problems.find(function (item) {

            return item.id === id;

        });


    if (!problem) return;


    if (
        problem.supporters.includes(
            currentUser.email
        )
    ) {

        return;

    }


    problem.supporters.push(
        currentUser.email
    );


    problem.affected =
        Number(problem.affected) + 1;


    localStorage.setItem(
        "campusProblems",
        JSON.stringify(problems)
    );


    renderProblems("All");

    updateStatistics();

}


// ================= CATEGORY FILTER =================

function filterCategory(category) {

    showProblems();

    renderProblems(category);


    document
        .querySelectorAll(".filter-btn")
        .forEach(function (button) {

            button.classList.remove("active");

        });


    document
        .querySelectorAll(".filter-btn")
        .forEach(function (button) {

            if (
                button.textContent
                    .toLowerCase()
                    .includes(
                        category
                            .split(" ")[0]
                            .toLowerCase()
                    )
            ) {

                button.classList.add("active");

            }

        });

}


// ================= STUDENT DASHBOARD =================

function renderStudentDashboard() {

    const myProblems =
        problems.filter(function (problem) {

            return (
                problem.reporterEmail ===
                currentUser.email
            );

        });


    document.getElementById("myReportCount")
        .textContent = myProblems.length;


    document.getElementById("myActiveCount")
        .textContent =
        myProblems.filter(function (problem) {

            return problem.status !== "Resolved";

        }).length;


    document.getElementById("myResolvedCount")
        .textContent =
        myProblems.filter(function (problem) {

            return problem.status === "Resolved";

        }).length;


    renderNotifications(myProblems);


    const container =
        document.getElementById("myReports");


    container.innerHTML = "";


    if (myProblems.length === 0) {

        container.innerHTML = `

            <div class="problem-card">

                <h3>📭 No reports yet</h3>

                <p>
                    Your submitted complaints will appear here.
                </p>

            </div>

        `;

        return;

    }


    myProblems.forEach(function (problem) {

        const card =
            document.createElement("div");

        card.className = "problem-card";


        const statusClass =
            problem.status === "Resolved"
                ? "status-resolved"
                : problem.status === "Investigating"
                    ? "status-investigating"
                    : "status-submitted";


        card.innerHTML = `

            <h3>
                ${getCategoryIcon(problem.category)}
                ${problem.category}
            </h3>

            <p>
                ${problem.description}
            </p>

            <div class="problem-meta">
                📍 ${problem.location}
            </div>

            <div class="problem-meta">
                👥 ${problem.affected}
                people affected
            </div>

            <div class="problem-meta">
                📅 ${problem.createdAt}
            </div>

            <span class="status ${statusClass}">
                ${problem.status}
            </span>

        `;


        container.appendChild(card);

    });

}


// ================= STUDENT NOTIFICATIONS =================

function renderNotifications(myProblems) {

    const container =
        document.getElementById(
            "studentNotifications"
        );


    container.innerHTML = "";


    const updated =
        myProblems.filter(function (problem) {

            return problem.notification;

        });


    if (updated.length === 0) {

        container.innerHTML = `

            <div class="notification">

                🔔 No new updates yet.

            </div>

        `;

        return;

    }


    updated.forEach(function (problem) {

        const notification =
            document.createElement("div");

        notification.className =
            "notification";


        notification.innerHTML = `

            🔔 <strong>
                ${problem.category}
            </strong>

            <br>

            ${problem.notification}

        `;


        container.appendChild(notification);

    });

}


// ================= ADMIN DASHBOARD =================

function renderAdminDashboard() {

    document.getElementById("adminTotal")
        .textContent = problems.length;


    document.getElementById("adminPending")
        .textContent =
        problems.filter(function (problem) {

            return problem.status === "Submitted";

        }).length;


    document.getElementById("adminProgress")
        .textContent =
        problems.filter(function (problem) {

            return problem.status === "Investigating";

        }).length;


    document.getElementById("adminResolved")
        .textContent =
        problems.filter(function (problem) {

            return problem.status === "Resolved";

        }).length;


    const container =
        document.getElementById("adminReports");


    container.innerHTML = "";


    if (problems.length === 0) {

        container.innerHTML = `

            <div class="problem-card">

                <h3>📭 No complaints yet.</h3>

            </div>

        `;

        return;

    }


    problems.forEach(function (problem) {

        const card =
            document.createElement("div");

        card.className = "admin-report";


        card.innerHTML = `

            <div class="admin-report-header">

                <div>

                    <h3>
                        ${getCategoryIcon(problem.category)}
                        ${problem.category}
                    </h3>

                    <p>
                        <strong>
                            ${problem.description}
                        </strong>
                    </p>

                </div>

                <div>

                    <select
                        onchange="updateStatus(
                            ${problem.id},
                            this.value
                        )"
                    >

                        <option
                            ${problem.status === "Submitted"
                                ? "selected"
                                : ""}
                        >
                            Submitted
                        </option>

                        <option
                            ${problem.status === "Investigating"
                                ? "selected"
                                : ""}
                        >
                            Investigating
                        </option>

                        <option
                            ${problem.status === "Resolved"
                                ? "selected"
                                : ""}
                        >
                            Resolved
                        </option>

                    </select>

                </div>

            </div>


            <hr>


            <p>
                👤 <strong>Reported by:</strong>
                ${problem.reporterName}
            </p>

            <p>
                📧 <strong>Email:</strong>
                ${problem.reporterEmail}
            </p>

            <p>
                📍 <strong>Location:</strong>
                ${problem.location}
            </p>

            <p>
                🚨 <strong>Risk:</strong>
                ${problem.risk}
            </p>

            <p>
                👥 <strong>Affected:</strong>
                ${problem.affected}
            </p>

            <p>
                ⏳ <strong>Duration:</strong>
                ${problem.duration}
            </p>

            <p>
                🕒 <strong>Reported:</strong>
                ${problem.createdAt}
            </p>

            <p>
                🙋 <strong>People who confirmed:</strong>
                ${problem.supporters.length}
            </p>

        `;


        container.appendChild(card);

    });

}


// ================= ADMIN STATUS UPDATE =================

function updateStatus(id, newStatus) {

    const problem =
        problems.find(function (item) {

            return item.id === id;

        });


    if (!problem) return;


    problem.status = newStatus;


    if (newStatus === "Submitted") {

        problem.notification =
            "Your complaint has been received by the administration.";

    }

    else if (newStatus === "Investigating") {

        problem.notification =
            "Your complaint is now being investigated by the administration.";

    }

    else if (newStatus === "Resolved") {

        problem.notification =
            "🎉 Your complaint has been marked as resolved by the administration.";

    }


    localStorage.setItem(
        "campusProblems",
        JSON.stringify(problems)
    );


    renderAdminDashboard();

    updateStatistics();


    alert(
        "✅ Status updated.\n\n" +
        "The student will see this update in their dashboard."
    );

}

// ================= STATISTICS =================

function updateStatistics() {

    const totalProblems =
        document.getElementById("totalProblems");

    const totalAffected =
        document.getElementById("totalAffected");

    if (totalProblems) {
        totalProblems.textContent = problems.length;
    }

    if (totalAffected) {

        const total =
            problems.reduce(function (sum, problem) {

                return sum + Number(problem.affected || 0);

            }, 0);

        totalAffected.textContent = total;
    }

}


// ================= START APPLICATION =================

if (currentUser) {

    openApplication();

}
// ================= CHATBOT =================

const chatButton = document.getElementById("chatButton");
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

if (chatButton) {

    chatButton.addEventListener("click", function () {

        chatBox.classList.toggle("hidden");

        if (!chatBox.classList.contains("hidden")) {
            chatInput.focus();
        }

    });

}


function sendChatMessage() {

    const message = chatInput.value.trim();

    if (message === "") {
        return;
    }

    // Show user message
    const userMessage = document.createElement("p");

    userMessage.className = "user-message";
    userMessage.textContent = message;

    chatMessages.appendChild(userMessage);


    // Generate CampusConnect response
    const reply = getChatbotReply(message);


    setTimeout(function () {

        const botMessage = document.createElement("p");

        botMessage.className = "bot-message";
        botMessage.textContent = reply;

        chatMessages.appendChild(botMessage);

        chatMessages.scrollTop = chatMessages.scrollHeight;

    }, 500);


    chatInput.value = "";

}


function getChatbotReply(message) {

    const text = message.toLowerCase().trim();

    // 👋 Greetings
    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey") ||
        text.includes("good morning") ||
        text.includes("good evening")
    ) {
        return "Hi! 👋 I'm the CampusConnect Assistant. I can help you report campus problems, track complaints, understand problem status, and use CampusConnect.";
    }


    // 📢 How to report a problem
    if (
        text.includes("how to report") ||
        text.includes("how can i report") ||
        text.includes("report a problem") ||
        text.includes("make a complaint") ||
        text.includes("submit complaint")
    ) {
        return "To report a problem: 1️⃣ Log in as a student. 2️⃣ Open 'Report'. 3️⃣ Select the problem category. 4️⃣ Describe the issue clearly. 5️⃣ Enter the location. 6️⃣ Select the risk level and affected people. 7️⃣ Submit the report. Your complaint will then appear in your dashboard.";
    }


    // 📶 Wi-Fi / Internet
    if (
        text.includes("wifi") ||
        text.includes("wi-fi") ||
        text.includes("internet") ||
        text.includes("network")
    ) {
        return "For a Wi-Fi or network problem, report the exact location and describe what is happening. For example: 'Wi-Fi is not working in Block A hostel since 3 days.' Also mention approximately how many students are affected. This helps the admin understand the impact.";
    }


    // 🚰 Water
    if (
        text.includes("water") ||
        text.includes("tap") ||
        text.includes("drinking water")
    ) {
        return "For a water problem, report the exact location, such as hostel block, floor, or building. Mention whether there is no water, dirty water, leakage, or another issue. You can also mention how many people are affected.";
    }


    // ⚡ Electricity
    if (
        text.includes("electricity") ||
        text.includes("power") ||
        text.includes("current") ||
        text.includes("light") ||
        text.includes("fan")
    ) {
        return "For an electricity problem, report the location and explain whether it is a power cut, damaged light, fan problem, socket issue, or another electrical problem. If there is a safety risk, mark the report as high risk.";
    }


    // 🍴 Canteen / Food
    if (
        text.includes("canteen") ||
        text.includes("food") ||
        text.includes("mess") ||
        text.includes("meal")
    ) {
        return "You can report canteen or food-related problems through CampusConnect. Describe the issue clearly, mention the canteen or mess location, and include how many students are affected.";
    }


    // 🧹 Cleanliness
    if (
        text.includes("clean") ||
        text.includes("cleanliness") ||
        text.includes("garbage") ||
        text.includes("toilet") ||
        text.includes("waste")
    ) {
        return "For cleanliness problems, report the exact location and describe the issue. For example: 'The hostel washroom on the second floor has not been cleaned for two days.' Add the number of affected people if you know it.";
    }


    // 🪑 Furniture
    if (
        text.includes("chair") ||
        text.includes("desk") ||
        text.includes("bench") ||
        text.includes("furniture")
    ) {
        return "Furniture problems can also be reported. Mention the classroom, laboratory, hostel room, or other location and explain what is damaged or missing.";
    }


    // 🛡️ Safety
    if (
        text.includes("safety") ||
        text.includes("danger") ||
        text.includes("unsafe") ||
        text.includes("emergency")
    ) {
        return "If you notice a campus safety problem, report it immediately through CampusConnect and select the appropriate high-risk level. For an immediate emergency or danger to someone, contact your campus emergency/security service directly as well.";
    }


    // 📍 Location
    if (
        text.includes("location") ||
        text.includes("where") ||
        text.includes("place")
    ) {
        return "When reporting a problem, give the most specific location you know — for example, 'Girls Hostel Block A, 2nd Floor' or 'CSE Block, Room 204'. A clear location helps the admin find the problem faster.";
    }


    // 📊 Track / Status
    if (
        text.includes("track") ||
        text.includes("status") ||
        text.includes("complaint status") ||
        text.includes("where is my complaint")
    ) {
        return "You can track your complaints from your Dashboard. A report can move through these stages: Submitted → Investigating → Resolved. If the admin updates the status, the student can see the update in the dashboard.";
    }


    // 👥 Same problem / affected students
    if (
        text.includes("facing this too") ||
        text.includes("same problem") ||
        text.includes("affected") ||
        text.includes("support")
    ) {
        return "If another student is experiencing the same problem, they can use 'I'm facing this too' instead of creating another duplicate complaint. This increases the affected-user count and helps show the real impact of the issue.";
    }


    // 👨‍💼 Admin
    if (
        text.includes("admin") ||
        text.includes("administrator")
    ) {
        return "The admin dashboard allows the administrator to view reported problems, see reporter details, check locations and impact, and update the status of complaints.";
    }


    // 🔐 Login
    if (
        text.includes("login") ||
        text.includes("log in") ||
        text.includes("sign in") ||
        text.includes("password")
    ) {
        return "CampusConnect has separate Student and Admin login options. Students can log in to report and track problems. Administrators can log in to view complaints and update their status.";
    }


    // 💡 What is CampusConnect?
    if (
        text.includes("what is campusconnect") ||
        text.includes("what is this") ||
        text.includes("about campusconnect")
    ) {
        return "CampusConnect is a campus problem reporting and tracking platform. Students and staff can report issues, find others facing the same problem, and track progress until the issue is resolved.";
    }


    // 🧠 Why use CampusConnect?
    if (
        text.includes("why") &&
        (
            text.includes("campusconnect") ||
            text.includes("use this")
        )
    ) {
        return "CampusConnect helps prevent duplicate complaints, shows how many people are affected, gives administrators organized information, and makes it easier for students to track what happens after they report a problem.";
    }


    // 📝 Example problem
    if (
        text.includes("example") ||
        text.includes("sample complaint")
    ) {
        return "Example: 'Wi-Fi is unavailable in Girls Hostel Block A, second floor, for the last 3 days. Around 25 students are affected.' A detailed report like this gives the admin useful information to investigate the problem.";
    }


    // 🙏 Thanks
    if (
        text.includes("thank") ||
        text.includes("thanks")
    ) {
        return "You're welcome! 💙 I'm always here to help you use CampusConnect.";
    }


    // ❓ Default response
    return "I can help you with CampusConnect! 🤖 Try asking me things like: 'How do I report a problem?', 'My hostel Wi-Fi is not working', 'How can I track my complaint?', 'What does Investigating mean?', or 'What can the admin see?'";
}


// Send message when button is clicked

const sendChat = document.getElementById("sendChat");

if (sendChat) {

    sendChat.addEventListener("click", sendChatMessage);

}


// Send message when Enter is pressed

if (chatInput) {

    chatInput.addEventListener("keypress", function (event) {

        if (event.key === "Enter") {

            sendChatMessage();

        }

    });

}