const form = document.getElementById("problemForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const problemType = document.getElementById("problemType").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;
    const riskLevel = document.getElementById("riskLevel").value;
    const affectedCount = document.getElementById("affectedCount").value;
    const duration = document.getElementById("duration").value;

    const submittedProblems = document.getElementById("submittedProblems");

submittedProblems.innerHTML += `
    <div class="problem-card">
        <h3>📌 ${problemType}</h3>
        <p>${description}</p>
        <p>📍 ${location}</p>
        <p>🚨 Risk Level: ${riskLevel}</p>
        <p>👥 ${affectedCount} students affected</p>
        <p>⏳ Existing for: ${duration}</p>
    </div>
`;

});