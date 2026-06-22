/* =====================================================
   Event Explorer — main.js
   Events: mouseover, mouseout, mousemove,
           click, dblclick, contextmenu,
           keydown, keyup,
           input, focus, blur,
           dragstart, dragover, dragleave, drop,
           scroll
   ===================================================== */

/* ─────────────────────────────────────────────────────
   THEME TOGGLE  (localStorage ilə yadda saxla)
   ───────────────────────────────────────────────────── */
const html        = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon   = document.getElementById("themeIcon");

// Əvvəlki seçimi yüklə
const savedTheme = localStorage.getItem("ee-theme") || "dark";
html.setAttribute("data-theme", savedTheme);
themeIcon.textContent = savedTheme === "dark" ? "🌙" : "☀️";

themeToggle.addEventListener("click", function () {
    const current = html.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", next);
    localStorage.setItem("ee-theme", next);
    themeIcon.textContent = next === "dark" ? "🌙" : "☀️";

    addLog("click", `Tema dəyişdi → ${next === "dark" ? "🌙 Qaranlıq" : "☀️ İşıqlı"}`, "dot-other");
});

/* ─────────────────────────────────────────────────────
   SCROLL PROGRESS BAR  (scroll)
   ───────────────────────────────────────────────────── */
const scrollBar = document.getElementById("scrollBar");

window.addEventListener("scroll", function () {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollBar.style.width = pct.toFixed(1) + "%";

    // Hər 20%-də bir log yaz (çox kənar etmə)
    if (pct > 0 && Math.round(pct) % 20 === 0) {
        addLog("scroll", `Sürüşdürmə: ${Math.round(pct)}%`, "dot-scroll");
    }
});

/* ─────────────────────────────────────────────────────
   DOM SEÇİMİ
   ───────────────────────────────────────────────────── */
const colorBtn     = document.getElementById("colorBtn");
const colorPreview = document.getElementById("colorPreview");
const colorBadge   = document.getElementById("colorBadge");

const counterDisplay = document.getElementById("counterDisplay");
const incrementBtn   = document.getElementById("incrementBtn");
const resetBtn       = document.getElementById("resetBtn");

const keyDisplay = document.getElementById("keyDisplay");
const keyInfo    = document.getElementById("keyInfo");

const trackerZone  = document.getElementById("trackerZone");
const trackerDot   = document.getElementById("trackerDot");
const trackerLabel = document.getElementById("trackerLabel");

const liveInput = document.getElementById("liveInput");
const mirror    = document.getElementById("mirror");
const charCount = document.getElementById("charCount");

const swStart   = document.getElementById("swStart");
const swStop    = document.getElementById("swStop");
const swReset   = document.getElementById("swReset");
const swDisplay = document.getElementById("stopwatchDisplay");

const clickZone     = document.getElementById("clickZone");
const clickZoneText = document.getElementById("clickZoneText");

const slotA = document.getElementById("slotA");
const slotB = document.getElementById("slotB");

const logList  = document.getElementById("logList");
const clearLog = document.getElementById("clearLog");
const logCount = document.getElementById("logCount");

const confettiContainer = document.getElementById("confettiContainer");

/* ─────────────────────────────────────────────────────
   LOG
   ───────────────────────────────────────────────────── */
let totalLogs = 0;

function addLog(eventType, message, dotClass = "dot-other") {
    const empty = logList.querySelector(".log-empty");
    if (empty) empty.remove();

    totalLogs++;
    logCount.textContent = `${totalLogs} event`;

    const time = new Date().toLocaleTimeString("az-AZ", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
    });

    const li = document.createElement("li");
    li.className = "log-item";
    li.innerHTML = `
        <span class="log-dot ${dotClass}"></span>
        <span class="log-event">${eventType}</span>
        <span class="log-msg">${message}</span>
        <span class="log-time">${time}</span>
    `;
    logList.prepend(li);

    const items = logList.querySelectorAll(".log-item");
    if (items.length > 40) items[items.length - 1].remove();
}

clearLog.addEventListener("click", function () {
    logList.innerHTML = `<li class="log-empty">Hələ heç bir event baş verməyib</li>`;
    totalLogs = 0;
    logCount.textContent = "0 event";
});

/* ─────────────────────────────────────────────────────
   1. RƏNG DƏYİŞDİRİCİ  —  mouseover / mouseout
   ───────────────────────────────────────────────────── */
const bgColors = [
    { name: "İndiqo",    hex: "#4f46e5" },
    { name: "Bənövşəyi", hex: "#7c3aed" },
    { name: "Mavi",      hex: "#2563eb" },
    { name: "Firuzəyi",  hex: "#0891b2" },
    { name: "Yaşıl",     hex: "#059669" },
    { name: "Qırmızı",   hex: "#dc2626" },
    { name: "Çəhrayı",   hex: "#db2777" },
    { name: "Narıncı",   hex: "#ea580c" },
];
let colorIndex = 0;

colorBtn.addEventListener("mouseover", function () {
    const color = bgColors[colorIndex];
    colorPreview.style.background = color.hex;
    colorPreview.classList.add("pop");
    setTimeout(() => colorPreview.classList.remove("pop"), 300);

    colorBadge.textContent = `🎨 ${color.name} — ${color.hex}`;
    colorBadge.classList.add("active");

    colorIndex = (colorIndex + 1) % bgColors.length;
    addLog("mouseover", `Rəng → ${color.name} (${color.hex})`, "dot-mouse");
});

colorBtn.addEventListener("mouseout", function () {
    colorBadge.textContent = "Gözləyir...";
    colorBadge.classList.remove("active");
    addLog("mouseout", "Düymədən uzaqlaşdı", "dot-mouse");
});

/* ─────────────────────────────────────────────────────
   2. KLİK SAYĞACI  —  click
   ───────────────────────────────────────────────────── */
let count = 0;

incrementBtn.addEventListener("click", function () {
    count++;
    counterDisplay.textContent = count;
    counterDisplay.classList.add("bump");
    setTimeout(() => counterDisplay.classList.remove("bump"), 150);
    addLog("click", `Sayğac artdı → ${count}`, "dot-click");

    if (count % 10 === 0) {
        launchConfetti();
        addLog("click", `🎉 ${count} klik — konfetti!`, "dot-click");
    }
});

resetBtn.addEventListener("click", function () {
    count = 0;
    counterDisplay.textContent = 0;
    addLog("click", "Sayğac sıfırlandı", "dot-click");
});

/* ─────────────────────────────────────────────────────
   3. KLAVİATURA  —  keydown / keyup
   ───────────────────────────────────────────────────── */
document.addEventListener("keydown", function (e) {
    // Input aktiv olsa da göstər, amma log-da fərqli yaz
    const label = e.key === " " ? "SPACE" : e.key;
    keyDisplay.innerHTML = `<span class="key-bubble">${label}</span>`;
    keyDisplay.classList.add("pressed");
    keyInfo.textContent = `KeyCode: ${e.keyCode}  |  Code: ${e.code}`;
    addLog("keydown", `"${label}" basıldı  •  ${e.code}`, "dot-key");
});

document.addEventListener("keyup", function (e) {
    keyDisplay.classList.remove("pressed");
    addLog("keyup", `"${e.key === " " ? "SPACE" : e.key}" buraxıldı`, "dot-key");
});

/* ─────────────────────────────────────────────────────
   4. MOUSE İZLƏYİCİ  —  mousemove
   ───────────────────────────────────────────────────── */
trackerZone.addEventListener("mousemove", function (e) {
    const rect = trackerZone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    trackerDot.style.left = x + "px";
    trackerDot.style.top  = y + "px";
    trackerDot.classList.add("active");

    trackerLabel.textContent = `X: ${Math.round(x)}  Y: ${Math.round(y)}`;
});

trackerZone.addEventListener("mouseleave", function () {
    trackerDot.classList.remove("active");
    trackerLabel.textContent = "X: —   Y: —";
    addLog("mouseleave", "Mouse sahədən çıxdı", "dot-mouse");
});

trackerZone.addEventListener("mouseenter", function () {
    addLog("mouseenter", "Mouse sahəyə girdi", "dot-mouse");
});

/* ─────────────────────────────────────────────────────
   5. CANLI MƏTİN  —  input / focus / blur
   ───────────────────────────────────────────────────── */
liveInput.addEventListener("input", function () {
    const val = this.value;
    charCount.textContent = val.length;

    // Simvol sayına görə rəng ver
    const pct = val.length / 60;
    if (pct >= 0.9) {
        charCount.style.color = "var(--danger)";
    } else if (pct >= 0.65) {
        charCount.style.color = "var(--warning)";
    } else {
        charCount.style.color = "var(--text-muted)";
    }

    if (val.trim() === "") {
        mirror.innerHTML = `<span class="mirror__placeholder">Hələ heç nə yoxdur...</span>`;
    } else {
        mirror.textContent = val;
    }

    addLog("input", `"${val.slice(0, 28)}${val.length > 28 ? "…" : ""}"  (${val.length} sim.)`, "dot-input");
});

liveInput.addEventListener("focus", () => addLog("focus",  "Input aktiv oldu",     "dot-input"));
liveInput.addEventListener("blur",  () => addLog("blur",   "Input fokusdan çıxdı", "dot-input"));

/* ─────────────────────────────────────────────────────
   6. STOPWATCH  —  click
   ───────────────────────────────────────────────────── */
let swInterval  = null;
let swRunning   = false;
let swElapsed   = 0;   // millisaniyə
let swStartTime = 0;

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centis  = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
}

swStart.addEventListener("click", function () {
    if (swRunning) return;
    swRunning   = true;
    swStartTime = Date.now() - swElapsed;

    swInterval = setInterval(function () {
        swElapsed = Date.now() - swStartTime;
        swDisplay.textContent = formatTime(swElapsed);
    }, 10);

    swStart.disabled = true;
    swStop.disabled  = false;
    addLog("click", "Stopwatch başladı ▶", "dot-click");
});

swStop.addEventListener("click", function () {
    if (!swRunning) return;
    clearInterval(swInterval);
    swRunning = false;
    swStart.disabled = false;
    swStop.disabled  = true;
    addLog("click", `Stopwatch dayandı ⏸  —  ${formatTime(swElapsed)}`, "dot-click");
});

swReset.addEventListener("click", function () {
    clearInterval(swInterval);
    swRunning = false;
    swElapsed = 0;
    swDisplay.textContent = "00:00.00";
    swStart.disabled = false;
    swStop.disabled  = true;
    addLog("click", "Stopwatch sıfırlandı ↺", "dot-click");
});

/* ─────────────────────────────────────────────────────
   7. XÜSUSI KLİKLƏR  —  dblclick / contextmenu
   ───────────────────────────────────────────────────── */
function flashZone(cls, emoji, text, logMsg, logDot) {
    clickZoneText.textContent = `${emoji} ${text}`;
    clickZone.classList.add(cls);

    setTimeout(() => {
        clickZoneText.textContent = "👆 Klik et";
        clickZone.classList.remove(cls);
    }, 900);

    addLog(logMsg.event, logMsg.msg, logDot);
}

clickZone.addEventListener("dblclick", function () {
    flashZone("flash-double", "⚡", "Cüt Klik!",
        { event: "dblclick", msg: "Cüt klik edildi" }, "dot-click");
});

clickZone.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    flashZone("flash-right", "🖱️", "Sağ Klik!",
        { event: "contextmenu", msg: "Sağ klik — default dayandırıldı" }, "dot-other");
});

/* ─────────────────────────────────────────────────────
   8. DRAG & DROP  —  dragstart / dragover / dragleave / drop
   ───────────────────────────────────────────────────── */
let draggedItem = null;

// Hər iki slotdakı itemlər üçün event qoş
function bindDragItems() {
    document.querySelectorAll(".dnd-item").forEach(function (item) {
        item.addEventListener("dragstart", function (e) {
            draggedItem = item;
            item.classList.add("dragging");
            e.dataTransfer.effectAllowed = "move";
            addLog("dragstart", `"${item.textContent.trim()}" sürüklənir`, "dot-drag");
        });

        item.addEventListener("dragend", function () {
            item.classList.remove("dragging");
            draggedItem = null;
        });
    });
}

[slotA, slotB].forEach(function (slot) {
    slot.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        slot.classList.add("drag-over");
    });

    slot.addEventListener("dragleave", function () {
        slot.classList.remove("drag-over");
    });

    slot.addEventListener("drop", function (e) {
        e.preventDefault();
        slot.classList.remove("drag-over");

        if (draggedItem) {
            const hint = slot.querySelector(".dnd-hint");
            if (hint) hint.remove();          // "Bura burax" mətnini sil

            slot.appendChild(draggedItem);
            addLog("drop", `"${draggedItem.textContent.trim()}" → ${slot.id === "slotB" ? "Hədəf" : "Mənbə"}`, "dot-drag");
        }

        bindDragItems(); // yeni yerə köçən item üçün yenidən bind et
    });
});

bindDragItems(); // Səhifə yüklənəndə ilk bind

/* ─────────────────────────────────────────────────────
   KONFETTİ
   ───────────────────────────────────────────────────── */
function launchConfetti() {
    const colors = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#a78bfa", "#ec4899"];

    for (let i = 0; i < 70; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left       = Math.random() * 100 + "vw";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width      = (Math.random() * 10 + 5) + "px";
        piece.style.height     = (Math.random() * 10 + 5) + "px";
        piece.style.borderRadius       = Math.random() > 0.5 ? "50%" : "3px";
        piece.style.animationDuration  = (Math.random() * 2 + 1.2) + "s";
        piece.style.animationDelay     = (Math.random() * 0.6) + "s";
        confettiContainer.appendChild(piece);
        piece.addEventListener("animationend", () => piece.remove());
    }
}
