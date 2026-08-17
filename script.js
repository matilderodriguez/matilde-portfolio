document.addEventListener("DOMContentLoaded", () => {

    const boot = document.getElementById("boot");

    if (!boot) return;

    const lines = [
        "user@localhost:~$ ssh matilde@career",
        "",
        "Connecting to career.matilderodriguez...",
        "",
        "Authenticating...",
        "",
        "Access granted.",
        "",
        "$ whoami"
    ];

    let lineIndex = 0;

    function showNextLine() {

        if (lineIndex >= lines.length) {

            setTimeout(() => {
                boot.classList.add("boot-hidden");
            }, 900);

            return;
        }

        const line = document.createElement("div");
        line.textContent = lines[lineIndex];

        boot.appendChild(line);

        lineIndex++;

        setTimeout(showNextLine, line.textContent === "" ? 350 : 650);
    }

    showNextLine();

});
