document.addEventListener("DOMContentLoaded", () => {

    const boot = document.getElementById("boot");

    if (!boot) return;

    const sessionKey = "matilde-portfolio:entered";
    let timer;
    const hideBoot = () => {clearTimeout(timer);boot.remove();};
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {hideBoot();return;}

    try {
        if (sessionStorage.getItem(sessionKey)) {
            hideBoot();
            return;
        }
        sessionStorage.setItem(sessionKey, "1");
    } catch {
        // Keep navigation usable when browser storage is disabled.
        hideBoot();
        return;
    }

    window.addEventListener("pagehide", hideBoot, {once: true});
    boot.hidden=false;
    boot.removeAttribute("aria-hidden");
    const skip=document.createElement("button");
    skip.id="boot-skip";skip.type="button";skip.textContent="[ SKIP ]";
    skip.addEventListener("click",hideBoot);boot.appendChild(skip);

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

        if (!boot.isConnected) return;
        if (lineIndex >= lines.length) {

            timer=setTimeout(hideBoot, 350);

            return;
        }

        const line = document.createElement("div");
        line.textContent = lines[lineIndex];

        boot.appendChild(line);

        lineIndex++;

        timer=setTimeout(showNextLine, line.textContent === "" ? 100 : 230);
    }

    showNextLine();

});
