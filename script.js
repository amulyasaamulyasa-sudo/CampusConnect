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

studentLoginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
        document.getElementById("studentName").value.trim();

    const email =
        document.getElementById("studentEmail").value.trim();

    const password =
        document.getElementById("studentPassword").value;

    if (!name || !email || !password) {
        loginMessage.textContent =
            "Please fill all details.";
        return;
    }


    currentUser = {

        name: name,

        email: email,

        role: "student"

    };


    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );


    openApplication();

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
