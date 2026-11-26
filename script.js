


// ============================================
// MISBAH | ISLAMIC COMPANION
// Premium Digital Tasbih
// Auto Save + Progress + Daily History
// Individual Zikr History
// ============================================


// TODAY'S DATE

const dateElement = document.getElementById("date");

if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


// ============================================
// ZIKR DATA
// ============================================

const zikrList = [
    "سُبْحَانَ اللَّهِ",
    "الْحَمْدُ لِلَّهِ",
    "اللَّهُ أَكْبَرُ",
    "أَسْتَغْفِرُ اللَّهَ",
    "لَا إِلَٰهَ إِلَّا اللَّهُ"
];


// ============================================
// DATE HELPERS
// ============================================

function getTodayKey() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatHistoryDate(dateKey) {
    if (dateKey === getTodayKey()) return "Today";

    const date = new Date(dateKey + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


// ============================================
// DIGITAL TASBIH
// ============================================

function openTasbih() {

    const oldPage = document.getElementById("tasbihPage");

    if (oldPage) oldPage.remove();


    // LOAD SAVED DATA

    let count = Number(localStorage.getItem("misbahCount")) || 0;

    let target = Number(localStorage.getItem("misbahTarget") || 33);

    let savedDhikr =
        localStorage.getItem("misbahDhikr") ||
        zikrList[0];

    let totalCount = Number(localStorage.getItem("misbahTotal"));

    if (!Number.isFinite(totalCount)) {
        totalCount = count;
    }


    // DAILY HISTORY

    let history = {};

    try {
        history = JSON.parse(
            localStorage.getItem("misbahHistory") || "{}"
        );
    } catch (error) {
        history = {};
    }


    // INDIVIDUAL ZIKR TOTALS

    let zikrTotals = {};

    try {
        zikrTotals = JSON.parse(
            localStorage.getItem("misbahZikrTotals") || "{}"
        );
    } catch (error) {
        zikrTotals = {};
    }


    // INDIVIDUAL DAILY ZIKR HISTORY

    let zikrDailyHistory = {};

    try {
        zikrDailyHistory = JSON.parse(
            localStorage.getItem("misbahZikrDailyHistory") || "{}"
        );
    } catch (error) {
        zikrDailyHistory = {};
    }


    // Ensure every Zikr has a saved total

    zikrList.forEach(zikr => {
        if (!Number.isFinite(Number(zikrTotals[zikr]))) {
            zikrTotals[zikr] = 0;
        }
    });


    const today = getTodayKey();

    if (!history[today]) {
        history[today] = 0;
    }

    if (!zikrDailyHistory[today]) {
        zikrDailyHistory[today] = {};
    }


    // ============================================
    // SAVE ALL DATA
    // ============================================

    function saveAllData() {

        localStorage.setItem("misbahCount", count);
        localStorage.setItem("misbahTarget", target);
        localStorage.setItem("misbahTotal", totalCount);

        localStorage.setItem(
            "misbahHistory",
            JSON.stringify(history)
        );

        localStorage.setItem(
            "misbahZikrTotals",
            JSON.stringify(zikrTotals)
        );

        localStorage.setItem(
            "misbahZikrDailyHistory",
            JSON.stringify(zikrDailyHistory)
        );
    }


    // ============================================
    // CREATE TASBIH PAGE
    // ============================================

    const tasbihPage = document.createElement("div");

    tasbihPage.id = "tasbihPage";

    tasbihPage.style.cssText = `
        position:fixed;
        inset:0;
        z-index:9999;
        overflow-y:auto;
        background:linear-gradient(
            180deg,
            #fffefa 0%,
            #f8f4e9 55%,
            #f1ead9 100%
        );
        padding:22px 18px 45px;
        font-family:Arial,sans-serif;
        color:#222222;
        text-align:center;
        box-sizing:border-box;
    `;


    tasbihPage.innerHTML = `

        <button id="backHome" style="
            display:block;
            padding:11px 18px;
            border:1px solid #e5d5b0;
            border-radius:12px;
            background:#fffefa;
            color:#222222;
            font-weight:bold;
            cursor:pointer;
            margin-bottom:28px;
        ">← Back to Home</button>


        <div style="
            font-size:13px;
            letter-spacing:4px;
            color:#a17b35;
            font-weight:bold;
        ">MISBAH</div>


        <h1 style="
            font-size:27px;
            margin:10px 0 5px;
            color:#222222;
        ">Digital Tasbih</h1>


        <p style="
            color:#555555;
            font-size:13px;
            margin-bottom:25px;
        ">Remember Allah, always.</p>


        <!-- MAIN TASBIH CARD -->

        <div style="
            background:linear-gradient(145deg,#fffefa,#f8f1e2);
            border:1px solid #e5d5b0;
            border-radius:25px;
            padding:25px 17px;
            box-shadow:0 8px 25px rgba(168,138,74,.10);
        ">


            <select id="dhikrSelect" style="
                width:100%;
                padding:14px;
                border-radius:12px;
                border:1px solid #e5d5b0;
                background:#fffefa;
                color:#222222;
                font-size:15px;
                outline:none;
            ">

                <option value="سُبْحَانَ اللَّهِ">سُبْحَانَ اللَّهِ</option>

                <option value="الْحَمْدُ لِلَّهِ">الْحَمْدُ لِلَّهِ</option>

                <option value="اللَّهُ أَكْبَرُ">اللَّهُ أَكْبَرُ</option>

                <option value="أَسْتَغْفِرُ اللَّهَ">أَسْتَغْفِرُ اللَّهَ</option>

                <option value="لَا إِلَٰهَ إِلَّا اللَّهُ">لَا إِلَٰهَ إِلَّا اللَّهُ</option>

            </select>


            <div id="arabicDhikr" style="
                font-size:29px;
                margin:28px 0 20px;
                color:#222222;
                line-height:1.9;
            "></div>


            <div id="counter" style="
                font-size:65px;
                font-weight:bold;
                color:#222222;
                margin:10px 0 0;
            ">${count}</div>


            <p style="
                font-size:13px;
                color:#555555;
                margin:5px 0 15px;
            ">Your Zikr Count</p>


            <!-- PROGRESS RING -->

            <div style="
                width:155px;
                height:155px;
                margin:10px auto 22px;
                position:relative;
            ">

                <svg width="155" height="155" viewBox="0 0 120 120">

                    <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#e9dfc9"
                        stroke-width="8"
                    />

                    <circle
                        id="progressCircle"
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        stroke="#bd9853"
                        stroke-width="8"
                        stroke-linecap="round"
                        stroke-dasharray="326.73"
                        stroke-dashoffset="326.73"
                        transform="rotate(-90 60 60)"
                        style="transition:stroke-dashoffset .4s ease;"
                    />

                </svg>


                <div style="
                    position:absolute;
                    inset:0;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                ">

                    <div id="progressPercent" style="
                        font-size:27px;
                        font-weight:bold;
                        color:#222222;
                    ">0%</div>

                    <div style="
                        font-size:11px;
                        color:#555555;
                        margin-top:4px;
                    ">Completed</div>

                </div>

            </div>


            <!-- TAP BUTTON -->

            <button id="tapButton" style="
                width:145px;
                height:145px;
                border-radius:50%;
                border:5px solid #e5d5b0;
                background:linear-gradient(145deg,#fffefa,#eadbb9);
                color:#222222;
                font-size:25px;
                font-weight:bold;
                cursor:pointer;
                box-shadow:0 8px 20px rgba(168,138,74,.18);
                margin:5px 0 20px;
            ">TAP</button>


            <!-- TARGET -->

            <div style="margin-top:15px;">

                <label style="
                    font-size:13px;
                    color:#222222;
                    font-weight:bold;
                ">Set Target</label>

                <br><br>

                <select id="targetSelect" style="
                    padding:12px 22px;
                    border-radius:10px;
                    border:1px solid #e5d5b0;
                    background:#fffefa;
                    color:#222222;
                    font-size:14px;
                ">

                    <option value="33">33</option>
                    <option value="100">100</option>
                    <option value="0">No Target</option>

                </select>

            </div>


            <button id="resetButton" style="
                margin-top:24px;
                padding:12px 27px;
                border:1px solid #e5d5b0;
                border-radius:12px;
                background:#f1e8d5;
                color:#222222;
                font-weight:bold;
                cursor:pointer;
            ">↻ Reset Counter</button>


            <p id="tasbihMessage" style="
                margin-top:20px;
                font-size:13px;
                color:#444444;
            ">Your progress is automatically saved.</p>

        </div>


        <!-- DAILY SUMMARY -->

        <div style="
            margin-top:22px;
            padding:22px 15px;
            background:linear-gradient(145deg,#fffefa,#f8f1e2);
            border:1px solid #e5d5b0;
            border-radius:22px;
            box-shadow:0 6px 18px rgba(168,138,74,.09);
        ">

            <h2 style="
                font-size:19px;
                color:#222222;
                margin:0 0 18px;
            ">Zikr Summary</h2>


            <div style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:12px;
            ">

                <div style="
                    padding:18px 8px;
                    background:#fffefa;
                    border:1px solid #e9dfc9;
                    border-radius:15px;
                ">

                    <div style="font-size:12px;color:#555555;">
                        Today's Zikr
                    </div>

                    <div id="todayCount" style="
                        font-size:27px;
                        font-weight:bold;
                        color:#222222;
                        margin-top:8px;
                    ">0</div>

                </div>


                <div style="
                    padding:18px 8px;
                    background:#fffefa;
                    border:1px solid #e9dfc9;
                    border-radius:15px;
                ">

                    <div style="font-size:12px;color:#555555;">
                        Total Zikr
                    </div>

                    <div id="totalCount" style="
                        font-size:27px;
                        font-weight:bold;
                        color:#222222;
                        margin-top:8px;
                    ">0</div>

                </div>

            </div>

        </div>


        <!-- DAILY HISTORY -->

        <div style="
            margin-top:22px;
            padding:22px 16px;
            background:linear-gradient(145deg,#fffefa,#f8f1e2);
            border:1px solid #e5d5b0;
            border-radius:22px;
            box-shadow:0 6px 18px rgba(168,138,74,.09);
            text-align:left;
        ">

            <h2 style="
                text-align:center;
                font-size:19px;
                color:#222222;
                margin:0 0 20px;
            ">Daily Zikr History</h2>

            <div id="historyList"></div>

        </div>


        <!-- INDIVIDUAL ZIKR HISTORY -->

        <div style="
            margin-top:22px;
            padding:22px 16px;
            background:linear-gradient(145deg,#fffefa,#f8f1e2);
            border:1px solid #e5d5b0;
            border-radius:22px;
            box-shadow:0 6px 18px rgba(168,138,74,.09);
            text-align:left;
        ">

            <h2 style="
                text-align:center;
                font-size:19px;
                color:#222222;
                margin:0 0 8px;
            ">Individual Zikr History</h2>

            <p style="
                text-align:center;
                font-size:12px;
                color:#555555;
                margin:0 0 20px;
            ">Your total count for each Zikr</p>

            <div id="individualHistory"></div>

        </div>


        <p style="
            font-size:11px;
            color:#555555;
            margin-top:25px;
        ">MISBAH • Your Islamic Companion</p>

    `;


    document.body.appendChild(tasbihPage);


    // ============================================
    // ELEMENT REFERENCES
    // ============================================

    const dhikrSelect = document.getElementById("dhikrSelect");
    const targetSelect = document.getElementById("targetSelect");

    const counter = document.getElementById("counter");
    const arabicDhikr = document.getElementById("arabicDhikr");

    const message = document.getElementById("tasbihMessage");

    const progressCircle = document.getElementById("progressCircle");
    const progressPercent = document.getElementById("progressPercent");

    const circumference = 326.73;


    // RESTORE SELECTIONS

    if ([...dhikrSelect.options].some(option => option.value === savedDhikr)) {
        dhikrSelect.value = savedDhikr;
    }

    if ([...targetSelect.options].some(option => Number(option.value) === target)) {
        targetSelect.value = String(target);
    } else {
        target = 33;
        localStorage.setItem("misbahTarget", target);
        targetSelect.value = "33";
    }

    arabicDhikr.textContent = dhikrSelect.value;


    // ============================================
    // SAVE ALL DATA
    // ============================================

    function saveAllData() {

        localStorage.setItem("misbahCount", count);
        localStorage.setItem("misbahTarget", target);
        localStorage.setItem("misbahTotal", totalCount);

        localStorage.setItem(
            "misbahHistory",
            JSON.stringify(history)
        );

        localStorage.setItem(
            "misbahZikrTotals",
            JSON.stringify(zikrTotals)
        );

        localStorage.setItem(
            "misbahZikrDailyHistory",
            JSON.stringify(zikrDailyHistory)
        );
    }


    // ============================================
    // DAILY HISTORY DISPLAY
    // ============================================

    function renderHistory() {

        const historyList = document.getElementById("historyList");

        const dates = Object.keys(history).sort().reverse();

        if (dates.length === 0) {

            historyList.innerHTML = `
                <p style="text-align:center;color:#555555;font-size:13px;">
                    Your Zikr history will appear here.
                </p>
            `;

            return;
        }

        historyList.innerHTML = dates.map(date => `

            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                padding:14px 12px;
                margin-bottom:9px;
                background:#fffefa;
                border:1px solid #e9dfc9;
                border-radius:13px;
            ">

                <div style="
                    font-size:13px;
                    color:#222222;
                    font-weight:600;
                ">${formatHistoryDate(date)}</div>

                <div style="
                    font-size:14px;
                    font-weight:bold;
                    color:#222222;
                ">${Number(history[date]).toLocaleString()} Zikr</div>

            </div>

        `).join("");

    }


    // ============================================
    // INDIVIDUAL ZIKR HISTORY DISPLAY
    // ============================================

    function renderIndividualHistory() {

        const container = document.getElementById("individualHistory");

        container.innerHTML = zikrList.map(zikr => {

            const total = Number(zikrTotals[zikr] || 0);

            const todayZikr = Number(
                (zikrDailyHistory[getTodayKey()] || {})[zikr] || 0
            );

            return `

                <div style="
                    padding:15px 12px;
                    margin-bottom:11px;
                    background:#fffefa;
                    border:1px solid #e9dfc9;
                    border-radius:14px;
                ">

                    <div style="
                        font-size:20px;
                        text-align:center;
                        color:#222222;
                        line-height:1.8;
                        margin-bottom:10px;
                    ">${zikr}</div>

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        gap:8px;
                    ">

                        <div style="font-size:12px;color:#555555;">
                            Today: <strong style="color:#222222;">
                                ${todayZikr.toLocaleString()}
                            </strong>
                        </div>

                        <div style="font-size:12px;color:#555555;">
                            Total: <strong style="color:#222222;">
                                ${total.toLocaleString()}
                            </strong>
                        </div>

                    </div>

                </div>

            `;

        }).join("");

    }


    // ============================================
    // UPDATE COUNTERS
    // ============================================

    function updateCounter() {

        counter.textContent = count.toLocaleString();

        const todayCount = Number(
            history[getTodayKey()] || 0
        );

        document.getElementById("todayCount").textContent =
            todayCount.toLocaleString();

        document.getElementById("totalCount").textContent =
            totalCount.toLocaleString();


        let percentage = 0;

        if (target > 0) {
            percentage = Math.min((count / target) * 100, 100);
        }

        progressPercent.textContent = Math.round(percentage) + "%";

        const offset =
            circumference - (percentage / 100) * circumference;

        progressCircle.style.strokeDashoffset = offset;


        if (target === 0) {

            message.textContent = "Your progress is automatically saved.";

        } else if (count >= target) {

            message.textContent = "Alhamdulillah! Target completed. 🌙";

        } else {

            message.textContent =
                `${target - count} more to reach your target.`;

        }


        saveAllData();
        renderHistory();
        renderIndividualHistory();

    }


    // INITIAL DISPLAY

    updateCounter();


    // ============================================
    // TAP BUTTON
    // ============================================

    document.getElementById("tapButton").addEventListener("click", function () {

        count++;

        const currentDate = getTodayKey();

        const selectedDhikr = dhikrSelect.value;

        // Update daily total
        history[currentDate] = Number(history[currentDate] || 0) + 1;

        // Update overall total
        totalCount++;

        // Update individual lifetime total
        zikrTotals[selectedDhikr] =
            Number(zikrTotals[selectedDhikr] || 0) + 1;

        // Update individual daily total
        if (!zikrDailyHistory[currentDate]) {
            zikrDailyHistory[currentDate] = {};
        }

        zikrDailyHistory[currentDate][selectedDhikr] =
            Number(zikrDailyHistory[currentDate][selectedDhikr] || 0) + 1;

        updateCounter();

    });


    // ============================================
    // RESET COUNTER
    // History remains saved
    // ============================================

    document.getElementById("resetButton").addEventListener("click", function () {

        count = 0;

        updateCounter();

        message.textContent = "Counter reset successfully.";

    });


    // ============================================
    // CHANGE TARGET
    // ============================================

    targetSelect.addEventListener("change", function () {

        target = Number(this.value);

        updateCounter();

    });


    // ============================================
    // CHANGE DHIKR
    // ============================================

    dhikrSelect.addEventListener("change", function () {

        arabicDhikr.textContent = this.value;

        localStorage.setItem("misbahDhikr", this.value);

        updateCounter();

    });


    // ============================================
    // BACK TO HOME
    // ============================================

    document.getElementById("backHome").addEventListener("click", function () {

        tasbihPage.remove();

    });

}


// ============================================
// FEATURE CARD ACTIONS
// ============================================

document.querySelectorAll(".feature-card").forEach(card => {

    card.addEventListener("click", function () {

        const feature = this.dataset.feature;

        if (feature === "Tasbih") {

            openTasbih();

        } else {

            alert(feature + " feature is coming soon!");

        }

    });

});


// ============================================
// BOTTOM NAVIGATION
// ============================================

document.querySelectorAll(".nav-item").forEach(item => {

    item.addEventListener("click", function () {

        document.querySelectorAll(".nav-item").forEach(nav => {
            nav.classList.remove("active");
        });

        this.classList.add("active");

        const label = this.querySelector("small")?.textContent;

        if (label && label !== "Home") {
            alert(label + " page is coming soon!");
        }

    });

});


console.log("MISBAH App Loaded Successfully!");

// ============================================
// MISBAH - QIBLA COMPASS
// Location + Qibla Bearing + Device Compass
// ============================================

const qiblaPage = document.getElementById("qiblaPage");

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

let qiblaBearing = null;
let compassHeading = null;


// Calculate Qibla direction

function calculateQibla(lat, lng) {

    const toRad = degree => degree * Math.PI / 180;
    const toDeg = radian => radian * 180 / Math.PI;

    const lat1 = toRad(lat);
    const lat2 = toRad(KAABA_LAT);
    const deltaLng = toRad(KAABA_LNG - lng);

    const y = Math.sin(deltaLng);

    const x =
        Math.cos(lat1) * Math.tan(lat2) -
        Math.sin(lat1) * Math.cos(deltaLng);

    let bearing = toDeg(Math.atan2(y, x));

    return (bearing + 360) % 360;
}


// Open Qibla page

function openQibla() {

    if (!qiblaPage) {
        alert("Qibla page could not be found.");
        return;
    }

    qiblaPage.style.display = "block";

    qiblaPage.style.position = "fixed";
    qiblaPage.style.inset = "0";
    qiblaPage.style.zIndex = "9998";
    qiblaPage.style.overflowY = "auto";
    qiblaPage.style.boxSizing = "border-box";

    document.querySelector(".bottom-nav").style.display = "none";

    getQiblaLocation();
}


// Back to Home

document.getElementById("qiblaBack")?.addEventListener("click", function () {

    qiblaPage.style.display = "none";

    document.querySelector(".bottom-nav").style.display = "flex";

});


// Get current location

function getQiblaLocation() {

    const locationText = document.getElementById("qiblaLocation");
    const statusText = document.getElementById("qiblaStatus");

    if (!navigator.geolocation) {

        statusText.textContent =
            "Your browser does not support location services.";

        return;
    }

    locationText.textContent = "Detecting location...";

    statusText.textContent =
        "Please allow location permission.";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            qiblaBearing = calculateQibla(lat, lng);

            locationText.textContent =
                lat.toFixed(4) + ", " + lng.toFixed(4);

            document.getElementById("qiblaDirection").textContent =
                Math.round(qiblaBearing) + "°";

            statusText.textContent =
                "Your Qibla direction has been calculated. Start the compass to use your device sensor.";

            updateCompassDisplay();

        },

        function (error) {

            locationText.textContent = "Location unavailable";

            if (error.code === 1) {
                statusText.textContent =
                    "Location permission denied. Please allow location access in your browser.";
            } else if (error.code === 2) {
                statusText.textContent =
                    "Your current location could not be detected.";
            } else {
                statusText.textContent =
                    "Location request timed out. Please try again.";
            }

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
        }

    );

}


// Locate button

document.getElementById("qiblaLocate")?.addEventListener("click", function () {

    getQiblaLocation();

});


// Update compass

function updateCompassDisplay() {

    if (qiblaBearing === null) return;

    const compassCircle = document.getElementById("compassCircle");

    const compassDegree = document.getElementById("compassDegree");

    const needle = document.querySelector(".compass-needle");

    if (compassHeading === null) {

        compassCircle.style.transform = "rotate(0deg)";

        needle.style.transform =
            "rotate(" + qiblaBearing + "deg)";

        compassDegree.textContent =
            "Qibla " + Math.round(qiblaBearing) + "°";

        return;
    }

    compassCircle.style.transform =
        "rotate(" + (-compassHeading) + "deg)";

    needle.style.transform =
        "rotate(" + qiblaBearing + "deg)";

    compassDegree.textContent =
        "Qibla " + Math.round(qiblaBearing) + "°";

}


// Device compass sensor

function handleDeviceOrientation(event) {

    let heading = null;

    if (typeof event.webkitCompassHeading === "number") {

        heading = event.webkitCompassHeading;

    } else if (
        event.absolute === true &&
        typeof event.alpha === "number"
    ) {

        heading = (360 - event.alpha) % 360;

    } else {

        return;

    }

    compassHeading = heading;

    updateCompassDisplay();

    document.getElementById("qiblaStatus").textContent =
        "Compass is active. Turn your device to align with the Qibla.";
}


// Start compass

document.getElementById("startCompass")?.addEventListener("click", async function () {

    const statusText = document.getElementById("qiblaStatus");

    if (qiblaBearing === null) {

        statusText.textContent =
            "Please detect your location first.";

        getQiblaLocation();

        return;
    }

    if (!window.isSecureContext) {

        statusText.textContent =
            "Compass sensors require HTTPS or localhost. Open the app through a secure connection.";

        return;
    }

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        try {

            const permission =
                await DeviceOrientationEvent.requestPermission();

            if (permission !== "granted") {

                statusText.textContent =
                    "Compass permission was not granted.";

                return;
            }

        } catch (error) {

            statusText.textContent =
                "Could not access compass permission.";

            return;
        }

    }

    if (typeof DeviceOrientationEvent === "undefined") {

        statusText.textContent =
            "This device does not support a compass sensor.";

        return;
    }

    window.addEventListener(
        "deviceorientationabsolute",
        handleDeviceOrientation
    );

    window.addEventListener(
        "deviceorientation",
        handleDeviceOrientation
    );

    statusText.textContent =
        "Waiting for compass sensor... Move your phone gently.";

});


// Intercept Qibla feature button before the old Coming Soon alert

document.addEventListener("click", function (event) {

    const card = event.target.closest(".feature-card");

    if (card && card.dataset.feature === "Qibla") {

        event.preventDefault();
        event.stopImmediatePropagation();

        openQibla();

    }

}, true);


document.querySelectorAll(".feature-card").forEach(card => {
    if (card.dataset.feature === "Qibla") {
        card.addEventListener("click", function () {
            const page = document.getElementById("qiblaPage");

            if (page) {
                page.style.display = "block";
                page.style.position = "fixed";
                page.style.inset = "0";
                page.style.zIndex = "99999";
                page.style.overflowY = "auto";
            } else {
                alert("Qibla HTML not found!");
            }
        });
    }
});

// ============================================
// MISBAH - 99 NAMES OF ALLAH
// Search + Bangla Meaning + Favorites
// Auto Save
// ============================================

const allahNames = [
["الرَّحْمَٰنُ","Ar-Rahman","The Most Merciful","পরম দয়ালু"],
["الرَّحِيمُ","Ar-Raheem","The Most Compassionate","অতি মেহেরবান"],
["الْمَلِكُ","Al-Malik","The King","সর্বময় অধিপতি"],
["الْقُدُّوسُ","Al-Quddus","The Most Holy","অতি পবিত্র"],
["السَّلَامُ","As-Salam","The Source of Peace","শান্তিদাতা"],
["الْمُؤْمِنُ","Al-Mu'min","The Giver of Faith","নিরাপত্তাদানকারী"],
["الْمُهَيْمِنُ","Al-Muhaymin","The Guardian","রক্ষক"],
["الْعَزِيزُ","Al-Aziz","The Almighty","পরাক্রমশালী"],
["الْجَبَّارُ","Al-Jabbar","The Compeller","মহাপ্রতাপশালী"],
["الْمُتَكَبِّرُ","Al-Mutakabbir","The Supreme","মহিমান্বিত"],
["الْخَالِقُ","Al-Khaliq","The Creator","সৃষ্টিকর্তা"],
["الْبَارِئُ","Al-Bari","The Originator","উদ্ভাবনকারী"],
["الْمُصَوِّرُ","Al-Musawwir","The Fashioner","আকৃতিদানকারী"],
["الْغَفَّارُ","Al-Ghaffar","The All-Forgiving","পরম ক্ষমাশীল"],
["الْقَهَّارُ","Al-Qahhar","The Subduer","মহাপরাক্রমশালী"],
["الْوَهَّابُ","Al-Wahhab","The Bestower","মহাদাতা"],
["الرَّزَّاقُ","Ar-Razzaq","The Provider","রিজিকদাতা"],
["الْفَتَّاحُ","Al-Fattah","The Opener","বিজয়দানকারী"],
["الْعَلِيمُ","Al-Alim","The All-Knowing","সর্বজ্ঞ"],
["الْقَابِضُ","Al-Qabid","The Withholder","সংকোচনকারী"],
["الْبَاسِطُ","Al-Basit","The Expander","প্রশস্তকারী"],
["الْخَافِضُ","Al-Khafid","The Abaser","অবনতকারী"],
["الرَّافِعُ","Ar-Rafi","The Exalter","উন্নতকারী"],
["الْمُعِزُّ","Al-Mu'izz","The Honorer","সম্মানদাতা"],
["الْمُذِلُّ","Al-Mudhill","The Humiliator","অপমানিতকারী"],
["السَّمِيعُ","As-Sami","The All-Hearing","সর্বশ্রোতা"],
["الْبَصِيرُ","Al-Basir","The All-Seeing","সর্বদ্রষ্টা"],
["الْحَكَمُ","Al-Hakam","The Judge","বিচারক"],
["الْعَدْلُ","Al-Adl","The Just","পরম ন্যায়বিচারক"],
["اللَّطِيفُ","Al-Latif","The Subtle One","সূক্ষ্মদর্শী ও কোমল"],
["الْخَبِيرُ","Al-Khabir","The All-Aware","সর্ববিষয়ে অবহিত"],
["الْحَلِيمُ","Al-Halim","The Forbearing","অত্যন্ত সহনশীল"],
["الْعَظِيمُ","Al-Azim","The Magnificent","মহামহিম"],
["الْغَفُورُ","Al-Ghafur","The Great Forgiver","অতিশয় ক্ষমাশীল"],
["الشَّكُورُ","Ash-Shakur","The Appreciative","গুণগ্রাহী"],
["الْعَلِيُّ","Al-Ali","The Most High","সর্বোচ্চ মর্যাদাবান"],
["الْكَبِيرُ","Al-Kabir","The Most Great","সুমহান"],
["الْحَفِيظُ","Al-Hafiz","The Preserver","সংরক্ষণকারী"],
["الْمُقِيتُ","Al-Muqit","The Sustainer","জীবিকাদানকারী"],
["الْحَسِيبُ","Al-Hasib","The Reckoner","হিসাব গ্রহণকারী"],
["الْجَلِيلُ","Al-Jalil","The Majestic","মহিমান্বিত"],
["الْكَرِيمُ","Al-Karim","The Generous","মহানুভব"],
["الرَّقِيبُ","Ar-Raqib","The Watchful","সতর্ক পর্যবেক্ষক"],
["الْمُجِيبُ","Al-Mujib","The Responsive","দোয়া কবুলকারী"],
["الْوَاسِعُ","Al-Wasi","The All-Encompassing","সর্বব্যাপী"],
["الْحَكِيمُ","Al-Hakim","The All-Wise","প্রজ্ঞাময়"],
["الْوَدُودُ","Al-Wadud","The Most Loving","পরম স্নেহশীল"],
["الْمَجِيدُ","Al-Majid","The Most Glorious","মহিমান্বিত"],
["الْبَاعِثُ","Al-Ba'ith","The Resurrector","পুনরুত্থানকারী"],
["الشَّهِيدُ","Ash-Shahid","The Witness","সর্বসাক্ষী"],
["الْحَقُّ","Al-Haqq","The Truth","পরম সত্য"],
["الْوَكِيلُ","Al-Wakil","The Trustee","কর্মবিধায়ক"],
["الْقَوِيُّ","Al-Qawiyy","The Most Strong","পরম শক্তিশালী"],
["الْمَتِينُ","Al-Matin","The Firm","সুদৃঢ়"],
["الْوَلِيُّ","Al-Waliyy","The Protecting Friend","অভিভাবক ও সাহায্যকারী"],
["الْحَمِيدُ","Al-Hamid","The Praiseworthy","প্রশংসার যোগ্য"],
["الْمُحْصِي","Al-Muhsi","The Enumerator","সবকিছুর গণনাকারী"],
["الْمُبْدِئُ","Al-Mubdi","The Originator","প্রথমবার সৃষ্টিকারী"],
["الْمُعِيدُ","Al-Muid","The Restorer","পুনরায় সৃষ্টিকারী"],
["الْمُحْيِي","Al-Muhyi","The Giver of Life","জীবনদাতা"],
["الْمُمِيتُ","Al-Mumit","The Giver of Death","মৃত্যুদাতা"],
["الْحَيُّ","Al-Hayy","The Ever-Living","চিরঞ্জীব"],
["الْقَيُّومُ","Al-Qayyum","The Self-Subsisting","চিরস্থায়ী ও সবকিছুর ধারক"],
["الْوَاجِدُ","Al-Wajid","The Finder","অভাবহীন"],
["الْمَاجِدُ","Al-Majid","The Noble","মহামর্যাদাবান"],
["الْوَاحِدُ","Al-Wahid","The One","এক ও অদ্বিতীয়"],
["الصَّمَدُ","As-Samad","The Eternal Refuge","অমুখাপেক্ষী"],
["الْقَادِرُ","Al-Qadir","The All-Powerful","সর্বশক্তিমান"],
["الْمُقْتَدِرُ","Al-Muqtadir","The Omnipotent","সর্বক্ষমতাবান"],
["الْمُقَدِّمُ","Al-Muqaddim","The Expediter","অগ্রসরকারী"],
["الْمُؤَخِّرُ","Al-Mu'akhkhir","The Delayer","পশ্চাৎকারী"],
["الْأَوَّلُ","Al-Awwal","The First","সর্বপ্রথম"],
["الْآخِرُ","Al-Akhir","The Last","সর্বশেষ"],
["الظَّاهِرُ","Az-Zahir","The Manifest","প্রকাশ্য"],
["الْبَاطِنُ","Al-Batin","The Hidden","গোপন"],
["الْوَالِي","Al-Wali","The Governor","সর্বময় শাসক"],
["الْمُتَعَالِي","Al-Muta'ali","The Most Exalted","সর্বোচ্চ মর্যাদার অধিকারী"],
["الْبَرُّ","Al-Barr","The Source of Goodness","পরম কল্যাণকারী"],
["التَّوَّابُ","At-Tawwab","The Accepter of Repentance","তওবা কবুলকারী"],
["الْمُنْتَقِمُ","Al-Muntaqim","The Avenger","প্রতিশোধ গ্রহণকারী"],
["الْعَفُوُّ","Al-Afuww","The Pardoner","পরম মার্জনাকারী"],
["الرَّؤُوفُ","Ar-Ra'uf","The Most Kind","অত্যন্ত স্নেহশীল"],
["مَالِكُ الْمُلْكِ","Malik-ul-Mulk","Owner of Sovereignty","সমগ্র রাজ্যের মালিক"],
["ذُو الْجَلَالِ وَالْإِكْرَامِ","Dhul-Jalali wal-Ikram","Lord of Majesty and Honor","মহিমা ও সম্মানের অধিকারী"],
["الْمُقْسِطُ","Al-Muqsit","The Equitable","ন্যায়বিচারক"],
["الْجَامِعُ","Al-Jami","The Gatherer","একত্রকারী"],
["الْغَنِيُّ","Al-Ghaniyy","The Self-Sufficient","অমুখাপেক্ষী"],
["الْمُغْنِي","Al-Mughni","The Enricher","সমৃদ্ধিদানকারী"],
["الْمَانِعُ","Al-Mani","The Preventer","নিবারণকারী"],
["الضَّارُّ","Ad-Darr","The Distresser","কষ্টের স্রষ্টা"],
["النَّافِعُ","An-Nafi","The Benefactor","উপকারকারী"],
["النُّورُ","An-Nur","The Light","আলো"],
["الْهَادِي","Al-Hadi","The Guide","পথপ্রদর্শক"],
["الْبَدِيعُ","Al-Badi","The Incomparable Originator","অতুলনীয় সৃষ্টিকর্তা"],
["الْبَاقِي","Al-Baqi","The Everlasting","চিরস্থায়ী"],
["الْوَارِثُ","Al-Warith","The Inheritor","সবকিছুর চূড়ান্ত মালিক"],
["الرَّشِيدُ","Ar-Rashid","The Guide to the Right Path","সঠিক পথপ্রদর্শক"],
["الصَّبُورُ","As-Sabur","The Patient","অসীম ধৈর্যশীল"]
];


// ============================================
// FAVORITE STORAGE
// ============================================

let favoriteNames = [];

try {
    favoriteNames = JSON.parse(
        localStorage.getItem("misbahFavoriteNames") || "[]"
    );
} catch (error) {
    favoriteNames = [];
}

let showingFavorites = false;


// ============================================
// OPEN 99 NAMES PAGE
// ============================================

function openNamesPage() {
    const page = document.getElementById("namesPage");

    if (!page) {
        alert("99 Names page HTML was not found.");
        return;
    }

    page.style.display = "block";

    document.querySelector(".bottom-nav")?.style &&
        (document.querySelector(".bottom-nav").style.display = "none");

    document.getElementById("namesSearch").value = "";
    showingFavorites = false;

    document.getElementById("allNamesBtn").classList.add("active");
    document.getElementById("favoriteNamesBtn").classList.remove("active");

    renderAllahNames();
}


// ============================================
// CLOSE PAGE
// ============================================

document.getElementById("namesBack")?.addEventListener("click", function () {
    document.getElementById("namesPage").style.display = "none";

    const bottomNav = document.querySelector(".bottom-nav");

    if (bottomNav) {
        bottomNav.style.display = "flex";
    }
});


// ============================================
// DISPLAY NAMES
// ============================================

function renderAllahNames() {
    const grid = document.getElementById("namesGrid");
    const search = document.getElementById("namesSearch").value
        .trim()
        .toLowerCase();

    let filteredNames = allahNames.map((name, index) => ({
        number: index + 1,
        arabic: name[0],
        pronunciation: name[1],
        english: name[2],
        bangla: name[3]
    }));

    if (showingFavorites) {
        filteredNames = filteredNames.filter(name =>
            favoriteNames.includes(name.number)
        );
    }

    if (search) {
        filteredNames = filteredNames.filter(name =>
            name.arabic.includes(search) ||
            name.pronunciation.toLowerCase().includes(search) ||
            name.english.toLowerCase().includes(search) ||
            name.bangla.includes(search) ||
            String(name.number) === search
        );
    }

    document.getElementById("namesCount").textContent =
        filteredNames.length + " Names Found";

    if (filteredNames.length === 0) {
        grid.innerHTML = `
            <div class="names-empty">
                No names found.
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredNames.map(name => {
        const isFavorite = favoriteNames.includes(name.number);

        return `
            <div class="name-card">

                <button
                    class="name-favorite"
                    data-favorite="${name.number}"
                    aria-label="Toggle favorite"
                >${isFavorite ? "♥" : "♡"}</button>

                <div class="name-number">
                    ${String(name.number).padStart(2, "0")}
                </div>

                <div class="name-arabic" dir="rtl">
                    ${name.arabic}
                </div>

                <div class="name-transliteration">
                    ${name.pronunciation}
                </div>

                <div class="name-meaning">
                    ${name.english}
                    <br>
                    ${name.bangla}
                </div>

            </div>
        `;
    }).join("");
}


// ============================================
// SEARCH
// ============================================

document.getElementById("namesSearch")?.addEventListener(
    "input",
    renderAllahNames
);


// ============================================
// ALL NAMES TAB
// ============================================

document.getElementById("allNamesBtn")?.addEventListener("click", function () {
    showingFavorites = false;

    this.classList.add("active");
    document.getElementById("favoriteNamesBtn").classList.remove("active");

    renderAllahNames();
});


// ============================================
// FAVORITES TAB
// ============================================

document.getElementById("favoriteNamesBtn")?.addEventListener("click", function () {
    showingFavorites = true;

    this.classList.add("active");
    document.getElementById("allNamesBtn").classList.remove("active");

    renderAllahNames();
});


// ============================================
// FAVORITE BUTTON
// ============================================

document.getElementById("namesGrid")?.addEventListener("click", function (event) {
    const button = event.target.closest("[data-favorite]");

    if (!button) return;

    const number = Number(button.dataset.favorite);

    if (favoriteNames.includes(number)) {
        favoriteNames = favoriteNames.filter(item => item !== number);
    } else {
        favoriteNames.push(number);
    }

    localStorage.setItem(
        "misbahFavoriteNames",
        JSON.stringify(favoriteNames)
    );

    renderAllahNames();
});


// ============================================
// OPEN FROM HOME FEATURE CARD
// ============================================

document.addEventListener("click", function (event) {
    const card = event.target.closest(".feature-card");

    if (card && card.dataset.feature === "99 Names") {
        event.preventDefault();
        event.stopImmediatePropagation();

        openNamesPage();
    }
}, true);


// ============================================
// END OF 99 NAMES FEATURE
// ============================================

console.log("MISBAH 99 Names Feature Ready!");

/* =====================================
   MISBAH - HADITH FEATURE
===================================== */

const hadithPage = document.getElementById("hadithPage");
const hadithGrid = document.getElementById("hadithGrid");
const hadithSearch = document.getElementById("hadithSearch");

const hadithBack = document.getElementById("hadithBack");

let selectedHadithCategory = "All";

let favoriteHadiths = [];
try {
    favoriteHadiths = JSON.parse(
        localStorage.getItem("misbahFavoriteHadiths") || "[]"
    );
    if (!Array.isArray(favoriteHadiths)) favoriteHadiths = [];
} catch (error) {
    favoriteHadiths = [];
}

// Hadith collection
// Arabic text and Bengali translation are presented
// with source references for reading and learning.

const hadithData = [

{
    id: 1,
    narrator: "হযরত উমর ইবনুল খাত্তাব (রাঃ)",
    arabic: "عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
    bangla: "হযরত উমর ইবনুল খাত্তাব (রাঃ) থেকে বর্ণিত, তিনি বলেন, আমি রাসূলুল্লাহ (সাঃ)-কে বলতে শুনেছি, নিশ্চয়ই সমস্ত কাজ নিয়তের ওপর নির্ভরশীল। প্রত্যেক ব্যক্তি তাই পাবে, যা সে নিয়ত করেছে। অতএব যার হিজরত হবে দুনিয়ার কোনো স্বার্থ অর্জনের জন্য অথবা কোনো নারীকে বিবাহ করার জন্য, তার হিজরত সে উদ্দেশ্যেই গণ্য হবে, যে উদ্দেশ্যে সে হিজরত করেছে।",
    reference: "সহিহ বুখারি, হাদিস ১"
},

{
    id: 2,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, যে ব্যক্তি ইলম অর্জনের জন্য কোনো পথে চলে, আল্লাহ তাআলা তার জন্য জান্নাতের পথ সহজ করে দেন।",
    reference: "সহিহ মুসলিম, হাদিস ২৬৯৯ (অংশ)"
},

{
    id: 3,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, দুটি বাক্য জিহ্বার জন্য খুব সহজ, আমলনামার পাল্লায় খুব ভারী এবং পরম দয়াময় আল্লাহর কাছে অত্যন্ত প্রিয়। তা হলো: সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আযিম।",
    reference: "সহিহ বুখারি, হাদিস ৬৪০৬"
},

{
    id: 4,
    narrator: "হযরত আবদুল্লাহ ইবন আমর (রাঃ)",
    arabic: "عَنْ عَبْدِ اللهِ بْنِ عَمْرٍو رَضِيَ اللهُ عَنْهُمَا عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللهُ عَنْهُ",
    bangla: "হযরত আবদুল্লাহ ইবন আমর (রাঃ) থেকে বর্ণিত, নবী করিম (সাঃ) বলেছেন, প্রকৃত মুসলিম সে, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে। আর প্রকৃত মুহাজির সে, যে আল্লাহ যা নিষেধ করেছেন তা পরিত্যাগ করে।",
    reference: "সহিহ বুখারি, হাদিস ১০"
},

{
    id: 5,
    narrator: "হযরত আনাস ইবন মালিক (রাঃ)",
    arabic: "عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    bangla: "হজরত আনাস ইবন মালিক (রা.) থেকে বর্ণিত। নবী করিম ﷺ বলেছেন, তোমাদের কেউ ততক্ষণ পর্যন্ত পূর্ণাঙ্গ মুমিন হতে পারবে না, যতক্ষণ না সে নিজের জন্য যা পছন্দ করে, তার মুসলিম ভাইয়ের জন্যও তা  পছন্দ করে।",
    reference: "সহিহ বুখারি, হাদিস ১৩"
},

{
    id: 6,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: مَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ فَلَا يُؤْذِ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ فَلْيُكْرِمْ ضَيْفَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, যে ব্যক্তি আল্লাহ ও শেষ দিনের প্রতি বিশ্বাস রাখে, সে যেন তার প্রতিবেশীকে কষ্ট না দেয়। যে ব্যক্তি আল্লাহ ও শেষ দিনের প্রতি বিশ্বাস রাখে, সে যেন তার মেহমানকে সম্মান করে। আর যে ব্যক্তি আল্লাহ ও শেষ দিনের প্রতি বিশ্বাস রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।",
    reference: "সহিহ বুখারি, হাদিস ৬০১৮"
},

{
    id: 7,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: مِنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, কোনো ব্যক্তির ইসলামের সৌন্দর্যের একটি দিক হলো, অনর্থক ও অপ্রয়োজনীয় বিষয় পরিত্যাগ করা।",
    reference: "জামে তিরমিজি, হাদিস ২৩১৭ (দুর্বল)"
},

{
    id: 8,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَجُلًا قَالَ لِلنَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: أَوْصِنِي، قَالَ: لَا تَغْضَبْ، فَرَدَّدَ مِرَارًا، قَالَ: لَا تَغْضَبْ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, এক ব্যক্তি নবী করিম (সাঃ)-কে বলল, আমাকে উপদেশ দিন। তিনি বললেন, রাগ করো না। লোকটি কয়েকবার একই কথা বলার অনুরোধ করল। প্রতিবারই তিনি বললেন, রাগ করো না।",
    reference: "সহিহ বুখারি, হাদিস ৬১১৬"
},

{
    id: 9,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: كُلُّ سُلَامَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ، كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ تَعْدِلُ بَيْنَ اثْنَيْنِ صَدَقَةٌ، وَتُعِينُ الرَّجُلَ فِي دَابَّتِهِ فَتَحْمِلُهُ عَلَيْهَا أَوْ تَرْفَعُ لَهُ عَلَيْهَا مَتَاعَهُ صَدَقَةٌ، وَالْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ، وَبِكُلِّ خُطْوَةٍ تَمْشِيهَا إِلَى الصَّلَاةِ صَدَقَةٌ، وَتُمِيطُ الْأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, মানুষের শরীরের প্রতিটি জোড়ার জন্য প্রতিদিন সদকা করা কর্তব্য। দুই ব্যক্তির মধ্যে ন্যায়বিচার করা সদকা। কাউকে তার বাহনে উঠতে সাহায্য করা অথবা তার মালপত্র তুলে দিতে সাহায্য করা সদকা। ভালো কথা বলা সদকা। নামাজের উদ্দেশ্যে প্রতিটি পদক্ষেপ সদকা। আর রাস্তা থেকে কষ্টদায়ক বস্তু সরিয়ে ফেলাও সদকা।",
    reference: "সহিহ বুখারি, হাদিস ২৯৮৯ (অংশ)"
},

{
    id: 10,
    narrator: "হযরত আবু মালিক আল-আশআরি (রাঃ)",
    arabic: "عَنْ أَبِي مَالِكٍ الْأَشْعَرِيِّ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: الطُّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ، وَسُبْحَانَ اللهِ وَالْحَمْدُ لِلَّهِ تَمْلَآنِ أَوْ تَمْلَأُ مَا بَيْنَ السَّمَاوَاتِ وَالْأَرْضِ",
    bangla: "হযরত আবু মালিক আল-আশআরি (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, পবিত্রতা ঈমানের অর্ধেক। আলহামদুলিল্লাহ আমলনামার পাল্লা পূর্ণ করে। আর সুবহানাল্লাহ ও আলহামদুলিল্লাহ আসমানসমূহ ও জমিনের মধ্যবর্তী স্থান পূর্ণ করে দেয়।",
    reference: "সহিহ মুসলিম, হাদিস ২২৩ (অংশ)"
},

{
    id: 11,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: مَنْ غَشَّنَا فَلَيْسَ مِنَّا",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, যে ব্যক্তি আমাদের সঙ্গে প্রতারণা করে, সে আমাদের দলভুক্ত নয়।",
    reference: "সহিহ মুসলিম, হাদিস ১০১"
},

{
    id: 12,
    narrator: "হযরত আবু মুসা আল-আশআরি (রাঃ)",
    arabic: "عَنْ أَبِي مُوسَى رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ، يَشُدُّ بَعْضُهُ بَعْضًا، وَشَبَّكَ بَيْنَ أَصَابِعِهِ",
    bangla: "হযরত আবু মুসা আল-আশআরি (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, একজন মুমিন অন্য মুমিনের জন্য একটি ভবনের মতো, যার এক অংশ অন্য অংশকে শক্তিশালী করে। এরপর তিনি নিজের এক হাতের আঙুল অন্য হাতের আঙুলের সঙ্গে জড়িয়ে দেখালেন।",
    reference: "সহিহ বুখারি, হাদিস ৪৮১"
},

{
    id: 13,
    narrator: "হযরত আয়িশা (রাঃ)",
    arabic: "عَنْ عَائِشَةَ رَضِيَ اللهُ عَنْهَا قَالَتْ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي",
    bangla: "হযরত আয়িশা (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, তোমাদের মধ্যে সেই ব্যক্তি সর্বোত্তম, যে তার পরিবারের কাছে সর্বোত্তম। আর আমি আমার পরিবারের কাছে তোমাদের মধ্যে সর্বোত্তম।",
    reference: "জামে তিরমিজি, হাদিস ৩৮৯৫"
},

{
    id: 14,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: مَنْ لَا يَرْحَمُ لَا يُرْحَمُ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, যে ব্যক্তি অন্যের প্রতি দয়া করে না, তার প্রতিও দয়া করা হয় না।",
    reference: "সহিহ বুখারি, হাদিস ৫৯৯৭"
},

{
    id: 15,
    narrator: "হযরত আবু যর (রাঃ)",
    arabic: "عَنْ أَبِي ذَرٍّ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ لِي رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: اتَّقِ اللهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
    bangla: "হযরত আবু যর (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) আমাকে বলেছেন, তুমি যেখানেই থাকো আল্লাহকে ভয় করো। কোনো মন্দ কাজ হয়ে গেলে তার পরপরই ভালো কাজ করো, যা মন্দ কাজটিকে মুছে দেবে। আর মানুষের সঙ্গে উত্তম চরিত্রের আচরণ করো।",
    reference: "জামে তিরমিজি, হাদিস ১৯৮৭"
},

{
    id: 16,
    narrator: "হযরত নুমান ইবন বশির (রাঃ)",
    arabic: "عَنْ النُّعْمَانِ بْنِ بَشِيرٍ رَضِيَ اللهُ عَنْهُمَا قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: الدُّعَاءُ هُوَ الْعِبَادَةُ",
    bangla: "হযরত নুমান ইবন বশির (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, দোয়াই হলো ইবাদত।",
    reference: "জামে তিরমিজি, হাদিস ৩৩৭২"
},

{
    id: 17,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: لَا تَحَاسَدُوا، وَلَا تَنَاجَشُوا، وَلَا تَبَاغَضُوا، وَلَا تَدَابَرُوا، وَلَا يَبِعْ بَعْضُكُمْ عَلَى بَيْعِ بَعْضٍ، وَكُونُوا عِبَادَ اللهِ إِخْوَانًا",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ) বলেছেন, তোমরা একে অপরের প্রতি হিংসা করো না, কৃত্রিমভাবে দাম বাড়িয়ো না, পরস্পরের প্রতি বিদ্বেষ পোষণ করো না, একে অপরের থেকে মুখ ফিরিয়ে নিয়ো না এবং একে অপরের বেচাকেনার ওপর বেচাকেনা করো না। তোমরা আল্লাহর বান্দা হিসেবে পরস্পর ভাই ভাই হয়ে থাকো।",
    reference: "সহিহ মুসলিম, হাদিস ২৫৬৪"
},

{
    id: 18,
    narrator: "হযরত আবদুল্লাহ ইবন উমর (রাঃ)",
    arabic: "عَنِ ابْنِ عُمَرَ رَضِيَ اللهُ عَنْهُمَا أَنَّ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: الْمُسْلِمُ أَخُو الْمُسْلِمِ، لَا يَظْلِمُهُ وَلَا يُسْلِمُهُ، وَمَنْ كَانَ فِي حَاجَةِ أَخِيهِ كَانَ اللهُ فِي حَاجَتِهِ",
    bangla: "হযরত আবদুল্লাহ ইবন উমর (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, একজন মুসলিম অন্য মুসলিমের ভাই। সে তার ওপর জুলুম করে না এবং তাকে অসহায় অবস্থায় ছেড়ে দেয় না। যে ব্যক্তি তার ভাইয়ের প্রয়োজন পূরণে সাহায্য করে, আল্লাহ তার প্রয়োজন পূরণে সাহায্য করেন।",
    reference: "সহিহ বুখারি, হাদিস ২৪৪২ (অংশ)"
},

{
    id: 19,
    narrator: "হযরত আয়িশা (রাঃ)",
    arabic: "عَنْ عَائِشَةَ رَضِيَ اللهُ عَنْهَا قَالَتْ: سُئِلَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: أَيُّ الْأَعْمَالِ أَحَبُّ إِلَى اللهِ؟ قَالَ: أَدْوَمُهَا وَإِنْ قَلَّ",
    bangla: "হযরত আয়িশা (রাঃ) থেকে বর্ণিত, তিনি বলেন, রাসূলুল্লাহ (সাঃ)-কে জিজ্ঞাসা করা হলো, আল্লাহর কাছে কোন আমল সবচেয়ে প্রিয়? তিনি বললেন, যে আমল নিয়মিত করা হয়, যদিও তা পরিমাণে কম হয়।",
    reference: "সহিহ বুখারি, হাদিস ৬৪৬৫"
},

{
    id: 20,
    narrator: "হযরত নাওয়াস ইবন সামআন (রাঃ)",
    arabic: "عَنْ النَّوَّاسِ بْنِ سَمْعَانَ الْأَنْصَارِيِّ رَضِيَ اللهُ عَنْهُ قَالَ: سَأَلْتُ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ عَنِ الْبِرِّ وَالْإِثْمِ، فَقَالَ: الْبِرُّ حُسْنُ الْخُلُقِ، وَالْإِثْمُ مَا حَاكَ فِي صَدْرِكَ وَكَرِهْتَ أَنْ يَطَّلِعَ عَلَيْهِ النَّاسُ",
    bangla: "হযরত নাওয়াস ইবন সামআন (রাঃ) থেকে বর্ণিত, তিনি বলেন, আমি রাসূলুল্লাহ (সাঃ)-কে নেকি ও পাপ সম্পর্কে জিজ্ঞাসা করলাম। তিনি বললেন, নেকি হলো উত্তম চরিত্র। আর পাপ হলো সেই বিষয়, যা তোমার মনে খটকা সৃষ্টি করে এবং তুমি চাও না যে মানুষ তা জেনে ফেলুক।",
    reference: "সহিহ মুসলিম, হাদিস ২৫৫৩ (অংশ)"
}
,

{
    id: 21,
    narrator: "হযরত উমর ইবনুল খাত্তাব (রাঃ)",
    arabic: "عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    bangla: "হযরত উমর ইবনুল খাত্তাব (রাঃ) থেকে বর্ণিত, তিনি বলেন, আমি রাসূলুল্লাহ (সাঃ)-কে বলতে শুনেছি, নিশ্চয়ই সকল আমল নিয়তের ওপর নির্ভরশীল।",
    reference: "সহিহ বুখারী, হাদিস ১"
},

{
    id: 22,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, যে ব্যক্তি ইলম শেখার জন্য কোনো পথে চলে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।",
    reference: "সহিহ মুসলিম, হাদিস ২৬৯৯"
},

{
    id: 23,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, দুটি কালিমা জিহ্বায় হালকা, আমলনামার পাল্লায় ভারী এবং রহমানের কাছে প্রিয়। তা হলো: সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আযিম।",
    reference: "সহিহ বুখারী, হাদিস ৬৪০৬"
},

{
    id: 24,
    narrator: "হযরত আবদুল্লাহ ইবন আমর (রাঃ)",
    arabic: "عَنْ عَبْدِ اللهِ بْنِ عَمْرٍو رَضِيَ اللهُ عَنْهُمَا عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    bangla: "হযরত আবদুল্লাহ ইবন আমর (রাঃ) থেকে বর্ণিত, নবী করিম (সাঃ) বলেছেন, প্রকৃত মুসলিম সে, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।",
    reference: "সহিহ বুখারী, হাদিস ১০"
},

{
    id: 25,
    narrator: "হযরত আনাস ইবন মালিক (রাঃ)",
    arabic: "عَنْ أَنَسٍ رَضِيَ اللهُ عَنْهُ عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    bangla: "হযরত আনাস ইবন মালিক (রাঃ) থেকে বর্ণিত, নবী করিম (সাঃ) বলেছেন, তোমাদের কেউ প্রকৃত মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তা-ই পছন্দ করে, যা নিজের জন্য পছন্দ করে।",
    reference: "সহিহ বুখারী, হাদিস ১৩"
},

{
    id: 26,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: مَنْ كَانَ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, যে ব্যক্তি আল্লাহ ও শেষ দিনের প্রতি বিশ্বাস রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।",
    reference: "সহিহ বুখারী, হাদিস ৬০১৮"
},

{
    id: 27,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: مِنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, অনর্থক বিষয় ছেড়ে দেওয়াই মানুষের ইসলামের সৌন্দর্যের একটি অংশ।",
    reference: "জামে তিরমিজি, হাদিস ২৩১৭ (দুর্বল)"
},

{
    id: 28,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: لَا تَغْضَبْ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, এক ব্যক্তি রাসূলুল্লাহ (সাঃ)-কে উপদেশ দিতে বললে তিনি বলেন, রাগ করো না।",
    reference: "সহিহ বুখারী, হাদিস ৬১১৬"
},

{
    id: 29,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, ভালো কথা বলাও সদকা।",
    reference: "সহিহ বুখারী, হাদিস ২৯৮৯"
},

{
    id: 30,
    narrator: "হযরত আবু মালিক আল-আশআরি (রাঃ)",
    arabic: "عَنْ أَبِي مَالِكٍ الْأَشْعَرِيِّ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: الطُّهُورُ شَطْرُ الْإِيمَانِ",
    bangla: "হযরত আবু মালিক আল-আশআরি (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, পবিত্রতা ঈমানের অর্ধেক।",
    reference: "সহিহ মুসলিম, হাদিস ২২৩"
},

{
    id: 31,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ أَنَّ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: مَنْ غَشَّنَا فَلَيْسَ مِنَّا",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, যে ব্যক্তি আমাদের সঙ্গে প্রতারণা করে, সে আমাদের দলভুক্ত নয়।",
    reference: "সহিহ মুসলিম, হাদিস ১০১"
},

{
    id: 32,
    narrator: "হযরত আবু মুসা আল-আশআরি (রাঃ)",
    arabic: "عَنْ أَبِي مُوسَى رَضِيَ اللهُ عَنْهُ عَنِ النَّبِيِّ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",
    bangla: "হযরত আবু মুসা আল-আশআরি (রাঃ) থেকে বর্ণিত, নবী করিম (সাঃ) বলেছেন, এক মুমিন অন্য মুমিনের জন্য প্রাচীরের মতো, যার এক অংশ অন্য অংশকে শক্ত করে।",
    reference: "সহিহ বুখারী, হাদিস ৪৮১"
},

{
    id: 33,
    narrator: "হযরত আয়িশা (রাঃ)",
    arabic: "عَنْ عَائِشَةَ رَضِيَ اللهُ عَنْهَا قَالَتْ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ، وَأَنَا خَيْرُكُمْ لِأَهْلِي",
    bangla: "হযরত আয়িশা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, তোমাদের মধ্যে উত্তম সে, যে তার পরিবারের কাছে উত্তম। আর আমি আমার পরিবারের কাছে তোমাদের মধ্যে সর্বোত্তম।",
    reference: "জামে তিরমিজি, হাদিস ৩৮৯৫"
},

{
    id: 34,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: مَنْ لَا يَرْحَمْ لَا يُرْحَمْ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, যে দয়া করে না, তার প্রতি দয়া করা হয় না।",
    reference: "সহিহ বুখারী, হাদিস ৫৯৯৭"
},

{
    id: 35,
    narrator: "হযরত আবু যর (রাঃ)",
    arabic: "عَنْ أَبِي ذَرٍّ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ لِي رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: اتَّقِ اللهَ حَيْثُمَا كُنْتَ",
    bangla: "হযরত আবু যর (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, তুমি যেখানেই থাকো, আল্লাহকে ভয় করো।",
    reference: "জামে তিরমিজি, হাদিস ১৯৮৭"
},

{
    id: 36,
    narrator: "হযরত নুমান ইবন বশির (রাঃ)",
    arabic: "عَنِ النُّعْمَانِ بْنِ بَشِيرٍ رَضِيَ اللهُ عَنْهُمَا قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: الدُّعَاءُ هُوَ الْعِبَادَةُ",
    bangla: "হযরত নুমান ইবন বশির (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, দোয়াই হলো ইবাদত।",
    reference: "জামে তিরমিজি, হাদিস ৩৩৭২"
},

{
    id: 37,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: لَا تَحَاسَدُوا وَلَا تَبَاغَضُوا وَلَا تَدَابَرُوا",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, তোমরা একে অপরের প্রতি হিংসা করো না, বিদ্বেষ পোষণ করো না এবং মুখ ফিরিয়ে নিয়ো না।",
    reference: "সহিহ মুসলিম, হাদিস ২৫৬৪"
},

{
    id: 38,
    narrator: "হযরত আবদুল্লাহ ইবন উমর (রাঃ)",
    arabic: "عَنِ ابْنِ عُمَرَ رَضِيَ اللهُ عَنْهُمَا أَنَّ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ: الْمُسْلِمُ أَخُو الْمُسْلِمِ",
    bangla: "হযরত আবদুল্লাহ ইবন উমর (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ) বলেছেন, মুসলমান মুসলমানের ভাই।",
    reference: "সহিহ বুখারী, হাদিস ২৪৪২"
},

{
    id: 39,
    narrator: "হযরত আয়িশা (রাঃ)",
    arabic: "عَنْ عَائِشَةَ رَضِيَ اللهُ عَنْهَا قَالَتْ: سُئِلَ رَسُولُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ: أَيُّ الْأَعْمَالِ أَحَبُّ إِلَى اللهِ؟ قَالَ: أَدْوَمُهَا وَإِنْ قَلَّ",
    bangla: "হযরত আয়িশা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ (সাঃ)-কে জিজ্ঞাসা করা হলো, আল্লাহর কাছে সবচেয়ে প্রিয় আমল কোনটি? তিনি বললেন, যে আমল নিয়মিত করা হয়, যদিও তা অল্প হয়।",
    reference: "সহিহ বুখারী, হাদিস ৬৪৬৫"
},

{
    id: 40,
    narrator: "হযরত নাওয়াস ইবন সামআন (রাঃ)",
    arabic: "عَنِ النَّوَّاسِ بْنِ سَمْعَانَ الْأَنْصَارِيِّ رَضِيَ اللهُ عَنْهُ قَالَ: سَأَلْتُ رَسُولَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ عَنِ الْبِرِّ وَالْإِثْمِ، فَقَالَ: الْبِرُّ حُسْنُ الْخُلُقِ",
    bangla: "হযরত নাওয়াস ইবন সামআন (রাঃ) থেকে বর্ণিত, তিনি বলেন, আমি রাসূলুল্লাহ (সাঃ)-কে নেকি ও পাপ সম্পর্কে জিজ্ঞাসা করলাম। তিনি বললেন, নেকি হলো উত্তম চরিত্র।",
    reference: "সহিহ মুসলিম, হাদিস ২৫৫৩"
},
{
    id: 41,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "إِنَّ الدِّينَ يُسْرٌ، وَلَنْ يُشَادَّ الدِّينَ أَحَدٌ إِلَّا غَلَبَهُ",
    bangla: "হযরত আবু হুরায়রা (রাঃ) থেকে বর্ণিত, রাসূলুল্লাহ ﷺ বলেছেন, নিশ্চয়ই দ্বীন সহজ। কেউ দ্বীনের ব্যাপারে কঠোরতা অবলম্বন করলে দ্বীন তার ওপর প্রবল হয়ে যাবে।",
    reference: "সহিহ বুখারি, হাদিস ৩৯"
},
{
    id: 42,
    narrator: "হযরত আবু হুরায়রা (রাঃ)",
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ النَّبِيُّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: يَقُولُ اللَّهُ تَعَالَى: أَنَا عِنْدَ ظَنِّ عَبْدِي بِي، وَأَنَا مَعَهُ إِذَا ذَكَرَنِي، فَإِنْ ذَكَرَنِي فِي نَفْسِهِ ذَكَرْتُهُ فِي نَفْسِي، وَإِنْ ذَكَرَنِي فِي مَلَإٍ ذَكَرْتُهُ فِي مَلَإٍ خَيْرٍ مِنْهُمْ",
    bangla: "হযরত আবু হুরায়রা (রা.) থেকে বর্ণিত, নবী করিম ﷺ বলেছেন, আল্লাহ তাআলা বলেন, আমার বান্দা আমার সম্পর্কে যেমন ধারণা করে, আমি তার সঙ্গে তেমনই আচরণ করি। সে যখন আমাকে স্মরণ করে, আমি তার সঙ্গে থাকি। সে যদি আমাকে মনে মনে স্মরণ করে, আমিও তাকে আমার কাছে স্মরণ করি। আর সে যদি কোনো দলের মধ্যে আমাকে স্মরণ করে, আমি তাকে তার চেয়ে উত্তম দলের মধ্যে স্মরণ করি।",
reference: "সহিহ বুখারি, হাদিস ৭৪০৫"
},
{
id: 43,
narrator: "হযরত জারির ইবন আবদুল্লাহ (রা.)",
    arabic: "عَنْ جَرِيرِ بْنِ عَبْدِ اللَّهِ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: مَنْ لَا يَرْحَمِ النَّاسَ لَا يَرْحَمْهُ اللَّهُ",
    bangla: "হযরত জারির ইবন আবদুল্লাহ (রা.) থেকে বর্ণিত, রাসূলুল্লাহ ﷺ বলেছেন, যে ব্যক্তি মানুষের প্রতি দয়া করে না, আল্লাহও তার প্রতি দয়া করেন না।",
    reference: "সহিহ বুখারি, হাদিস ৭৩৭৬"
},
{
    id: 44,
    narrator: "উমর ইবনুল খাত্তাব (রা.)",
    arabic: "بَيْنَمَا نَحْنُ عِنْدَ رَسُولِ اللَّهِ صلى الله عليه وسلم ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ شَدِيدُ سَوَادِ الشَّعَرِ لاَ يُرَى عَلَيْهِ أَثَرُ السَّفَرِ وَلاَ يَعْرِفُهُ مِنَّا أَحَدٌ حَتَّى جَلَسَ إِلَى النَّبِيِّ صلى الله عليه وسلم فَأَسْنَدَ رُكْبَتَيْهِ إِلَى رُكْبَتَيْهِ وَوَضَعَ كَفَّيْهِ عَلَى فَخِذَيْهِ وَقَالَ يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ وَتُقِيمَ الصَّلاَةَ وَتُؤْتِيَ الزَّكَاةَ وَتَصُومَ رَمَضَانَ وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً قَالَ صَدَقْتَ قَالَ فَأَخْبِرْنِي عَنِ الإِيمَانِ قَالَ أَنْ تُؤْمِنَ بِاللَّهِ وَمَلاَئِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الآخِرِ وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ قَالَ صَدَقْتَ قَالَ فَأَخْبِرْنِي عَنِ الإِحْسَانِ قَالَ أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ قَالَ فَأَخْبِرْنِي عَنِ السَّاعَةِ قَالَ مَا الْمَسْئُولُ عَنْهَا بِأَعْلَمَ مِنَ السَّائِلِ قَالَ فَأَخْبِرْنِي عَنْ أَمَارَتِهَا قَالَ أَنْ تَلِدَ الأَمَةُ رَبَّتَهَا وَأَنْ تَرَى الْحُفَاةَ الْعُرَاةَ الْعَالَةَ رِعَاءَ الشَّاءِ يَتَطَاوَلُونَ فِي الْبُنْيَانِ ثُمَّ انْطَلَقَ فَلَبِثْتُ مَلِيًّا ثُمَّ قَالَ يَا عُمَرُ أَتَدْرِي مَنِ السَّائِلُ قُلْتُ اللَّهُ وَرَسُولُهُ أَعْلَمُ قَالَ فَإِنَّهُ جِبْرِيلُ أَتَاكُمْ يُعَلِّمُكُمْ دِينَكُمْ",
    bangla: "একদিন আমরা রাসুলুল্লাহ (সা.)-এর কাছে বসে ছিলাম। এমন সময় একজন লোক আমাদের সামনে উপস্থিত হলেন। তাঁর পোশাক ছিল অত্যন্ত সাদা এবং চুল ছিল অত্যন্ত কালো। তাঁর মধ্যে সফরের কোনো চিহ্ন দেখা যাচ্ছিল না এবং আমাদের কেউ তাঁকে চিনত না। তিনি নবী (সা.)-এর কাছে এসে বসলেন এবং তাঁর হাঁটুর সঙ্গে নিজের হাঁটু মিলিয়ে ও দুই হাত নিজের উরুর ওপর রেখে বললেন, হে মুহাম্মদ! আমাকে ইসলাম সম্পর্কে জানান। রাসুলুল্লাহ (সা.) বললেন, ইসলাম হলো—তুমি সাক্ষ্য দেবে যে আল্লাহ ছাড়া কোনো উপাস্য নেই এবং মুহাম্মদ আল্লাহর রাসুল; নামাজ প্রতিষ্ঠা করবে, জাকাত প্রদান করবে, রমজানের রোজা রাখবে এবং সামর্থ্য থাকলে বাইতুল্লাহর হজ করবে। লোকটি বললেন, আপনি সত্য বলেছেন। এরপর তিনি ঈমান সম্পর্কে জানতে চাইলে নবী (সা.) বললেন, ঈমান হলো—আল্লাহ, তাঁর ফেরেশতাগণ, কিতাবসমূহ, রাসুলগণ, আখিরাতের দিন এবং তাকদিরের ভালো-মন্দের ওপর বিশ্বাস স্থাপন করা। এরপর তিনি ইহসান সম্পর্কে জানতে চাইলে নবী (সা.) বললেন, তুমি এমনভাবে আল্লাহর ইবাদত করবে যেন তুমি তাঁকে দেখছ; আর যদি তাঁকে দেখতে না পাও, তবে বিশ্বাস রাখবে যে তিনি তোমাকে দেখছেন। এরপর কিয়ামত সম্পর্কে জানতে চাইলে নবী (সা.) বললেন, যাকে জিজ্ঞাসা করা হচ্ছে, সে প্রশ্নকারী অপেক্ষা বেশি জানে না। কিয়ামতের নিদর্শন সম্পর্কে জানতে চাইলে তিনি বললেন, দাসী তার মনিবকে জন্ম দেবে এবং তুমি দেখবে, খালি পা, বস্ত্রহীন ও দরিদ্র মেষপালকেরা উঁচু উঁচু ভবন নির্মাণে একে অপরের সঙ্গে প্রতিযোগিতা করছে। লোকটি চলে যাওয়ার পর নবী (সা.) আমাকে বললেন, হে উমর! তুমি কি জানো, প্রশ্নকারী কে ছিলেন? আমি বললাম, আল্লাহ ও তাঁর রাসুলই ভালো জানেন। তিনি বললেন, তিনি ছিলেন জিবরাইল (আ.)। তিনি তোমাদের দ্বীন শিক্ষা দিতে এসেছিলেন।",
    reference: "সহিহ মুসলিম, হাদিস: ৮ক"
},

{
    id: 45,
    narrator: "তামিম আদ-দারি (রা.)",
    arabic: "قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم الدِّينُ النَّصِيحَةُ قُلْنَا لِمَنْ قَالَ لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ",
    bangla: "রাসুলুল্লাহ (সা.) বলেছেন, দ্বীন হলো আন্তরিক কল্যাণকামিতা। আমরা জিজ্ঞাসা করলাম, কার প্রতি? তিনি বললেন, আল্লাহর প্রতি, তাঁর কিতাবের প্রতি, তাঁর রাসুলের প্রতি, মুসলিমদের নেতৃবৃন্দের প্রতি এবং সাধারণ মুসলিমদের প্রতি।",
    reference: "সহিহ মুসলিম, হাদিস: ৫৫ক"
},

{
    id: 46,
    narrator: "আবু হুরায়রা (রা.)",
    arabic: "قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلاَ يُؤْذِ جَارَهُ وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    bangla: "রাসুলুল্লাহ (সা.) বলেছেন, যে ব্যক্তি আল্লাহ ও আখিরাতের দিনের প্রতি ঈমান রাখে, সে যেন তার প্রতিবেশীকে কষ্ট না দেয়। যে ব্যক্তি আল্লাহ ও আখিরাতের দিনের প্রতি ঈমান রাখে, সে যেন তার অতিথিকে সম্মান করে। আর যে ব্যক্তি আল্লাহ ও আখিরাতের দিনের প্রতি ঈমান রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।",
    reference: "সহিহ বুখারি, হাদিস: ৬০১৮"
},

{
    id: 47,
    narrator: "আবু হুরায়রা (রা.)",
    arabic: "قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ وَفِي كُلٍّ خَيْرٌ احْرِصْ عَلَى مَا يَنْفَعُكَ وَاسْتَعِنْ بِاللَّهِ وَلاَ تَعْجِزْ وَإِنْ أَصَابَكَ شَيْءٌ فَلاَ تَقُلْ لَوْ أَنِّي فَعَلْتُ كَانَ كَذَا وَكَذَا وَلَكِنْ قُلْ قَدَرُ اللَّهِ وَمَا شَاءَ فَعَلَ فَإِنَّ لَوْ تَفْتَحُ عَمَلَ الشَّيْطَانِ",
    bangla: "রাসুলুল্লাহ (সা.) বলেছেন, শক্তিশালী মুমিন দুর্বল মুমিনের চেয়ে উত্তম এবং আল্লাহর কাছে অধিক প্রিয়। তবে উভয়ের মধ্যেই কল্যাণ রয়েছে। যা তোমার উপকারে আসে, তা অর্জনের জন্য সচেষ্ট হও, আল্লাহর সাহায্য প্রার্থনা করো এবং কখনো অক্ষম হয়ে বসে থেকো না। যদি তোমার কোনো বিপদ ঘটে, তবে এ কথা বলো না যে, আমি যদি এমন করতাম, তাহলে এমন হতো। বরং বলো, আল্লাহর তাকদির নির্ধারিত ছিল এবং তিনি যা চেয়েছেন তাই করেছেন। কারণ 'যদি এমন করতাম' বলা শয়তানের কাজের দরজা খুলে দেয়।",
    reference: "সহিহ মুসলিম, হাদিস: ২৬৬৪"
},

{
    id: 48,
    narrator: "আবু হুরায়রা (রা.)",
    arabic: "قَالَ النَّبِيُّ صلى الله عليه وسلم سَبْعَةٌ يُظِلُّهُمُ اللَّهُ فِي ظِلِّهِ يَوْمَ لاَ ظِلَّ إِلاَّ ظِلُّهُ الإِمَامُ الْعَادِلُ وَشَابٌّ نَشَأَ فِي عِبَادَةِ رَبِّهِ وَرَجُلٌ قَلْبُهُ مُعَلَّقٌ فِي الْمَسَاجِدِ وَرَجُلاَنِ تَحَابَّا فِي اللَّهِ اجْتَمَعَا عَلَيْهِ وَتَفَرَّقَا عَلَيْهِ وَرَجُلٌ طَلَبَتْهُ امْرَأَةٌ ذَاتُ مَنْصِبٍ وَجَمَالٍ فَقَالَ إِنِّي أَخَافُ اللَّهَ وَرَجُلٌ تَصَدَّقَ أَخْفَى حَتَّى لاَ تَعْلَمَ شِمَالُهُ مَا تُنْفِقُ يَمِينُهُ وَرَجُلٌ ذَكَرَ اللَّهَ خَالِيًا فَفَاضَتْ عَيْنَاهُ",
    bangla: "নবী করিম (সা.) বলেছেন, সাত শ্রেণির মানুষকে আল্লাহ সেদিন তাঁর বিশেষ ছায়ায় আশ্রয় দেবেন, যেদিন তাঁর ছায়া ছাড়া আর কোনো ছায়া থাকবে না। তারা হলো—১. ন্যায়পরায়ণ শাসক। ২. সেই যুবক, যে তার প্রতিপালকের ইবাদতের মধ্য দিয়ে বেড়ে উঠেছে। ৩. সেই ব্যক্তি, যার হৃদয় মসজিদের সঙ্গে সম্পৃক্ত থাকে। ৪. এমন দুই ব্যক্তি, যারা কেবল আল্লাহর সন্তুষ্টির জন্য একে অপরকে ভালোবাসে; আল্লাহর জন্যই তারা একত্রিত হয় এবং আল্লাহর জন্যই পৃথক হয়। ৫. এমন ব্যক্তি, যাকে কোনো সম্ভ্রান্ত ও সুন্দরী নারী অবৈধ সম্পর্কের আহ্বান জানায়, কিন্তু সে বলে, আমি আল্লাহকে ভয় করি। ৬. এমন ব্যক্তি, যে এত গোপনে দান করে যে তার বাম হাতও জানতে পারে না তার ডান হাত কী দান করেছে। ৭. এমন ব্যক্তি, যে নির্জনে আল্লাহকে স্মরণ করে এবং তার চোখ অশ্রুতে ভরে যায়।",
    reference: "সহিহ বুখারি, হাদিস: ৬৬০"
}
 ];
       
        

// ============================================
// MISBAH - HADITH PAGE FUNCTIONALITY
// ============================================

// Open Hadith Page
function openHadithPage() {
    const page = document.getElementById("hadithPage");

    if (!page) {
        alert("Hadith page HTML was not found!");
        return;
    }

    page.style.display = "block";
    page.style.position = "fixed";
    page.style.inset = "0";
    page.style.zIndex = "9999";
    page.style.overflowY = "auto";

    const bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav) bottomNav.style.display = "none";

    renderHadiths();
}


// Display Hadiths
function renderHadiths() {
    const grid = document.getElementById("hadithGrid");
    const search = document.getElementById("hadithSearch");

    if (!grid) return;

    const query = search ? search.value.trim().toLowerCase() : "";

    const filtered = hadithData.filter(hadith => {
        return (
            hadith.arabic.includes(query) ||
            hadith.bangla.toLowerCase().includes(query) ||
            hadith.reference.toLowerCase().includes(query) ||
            (hadith.narrator || "").toLowerCase().includes(query)
        );
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <p style="text-align:center;padding:25px;color:#555;">
                No Hadith Found
            </p>
        `;
        return;
    }

    grid.innerHTML = filtered.map(hadith => {
        const isFavorite = favoriteHadiths.includes(hadith.id);

        return `
            <div class="hadith-card">

                <button
                    class="hadith-favorite"
                    data-hadith-favorite="${hadith.id}"
                >${isFavorite ? "♥" : "♡"}</button>

                <p class="hadith-number">
                    HADITH ${hadith.id}
                </p>

                <div class="hadith-narrator">
                    বর্ণনাকারী: ${hadith.narrator || "উল্লেখ নেই"}
                </div>

                <div class="hadith-arabic" dir="rtl">
                    ${hadith.arabic}
                </div>

                <div class="hadith-bangla">
                    ${hadith.bangla}
                </div>

                <div class="hadith-reference">
                    ${hadith.reference}
                </div>

                

            </div>
        `;
    }).join("");
}


// Search Hadith
document.getElementById("hadithSearch")?.addEventListener(
    "input",
    renderHadiths
);


// Favorite Hadith
document.getElementById("hadithGrid")?.addEventListener(
    "click",
    function(event) {
        const button = event.target.closest("[data-hadith-favorite]");

        if (!button) return;

        const id = Number(button.dataset.hadithFavorite);

        if (favoriteHadiths.includes(id)) {
            favoriteHadiths = favoriteHadiths.filter(item => item !== id);
        } else {
            favoriteHadiths.push(id);
        }

        localStorage.setItem(
            "misbahFavoriteHadiths",
            JSON.stringify(favoriteHadiths)
        );

        renderHadiths();
    }
);


// Back to Home
document.getElementById("hadithBack")?.addEventListener(
    "click",
    function() {
        document.getElementById("hadithPage").style.display = "none";

        const bottomNav = document.querySelector(".bottom-nav");
        if (bottomNav) bottomNav.style.display = "flex";
    }
);


// Open Hadith from Home Feature
document.addEventListener("click", function(event) {
    const card = event.target.closest(".feature-card");

    if (card && card.dataset.feature === "Hadith") {
        event.preventDefault();
        event.stopImmediatePropagation();

        openHadithPage();
    }
}, true);

console.log("MISBAH Hadith Feature Ready!");
document.querySelectorAll(".feature-card").forEach(card => {
    if (card.dataset.feature === "Hadith") {
        card.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            openHadithPage();
        }, true);
    }
});
