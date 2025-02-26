const input = document.querySelector('input');
const buttons = document.getElementsByClassName('submitButton');
const choices = [];
const setUpButtons = document.getElementsByClassName('setUpButton');

if (buttons.length > 0) {
    buttons[0].addEventListener('click', (event) => {
        event.preventDefault();
        let inputValue = input.value.trim();

        if (!inputValue) {
            alert("Please enter a value.");
            return;
        }

        const newPrize = {
            text: inputValue,
            color: `hsl(${Math.floor(Math.random() * 360)} 70% 50%)`,
            reaction: "resting"
        };

        prizes.push(newPrize);

        const ulElements = document.getElementsByClassName('itemList');
        if (ulElements.length > 0) {
            const ul = ulElements[0];
            const li = document.createElement('li');
            li.textContent = inputValue;
            ul.appendChild(li);
        } else {
            console.error("No element with class 'itemList' found.");
        }

        input.value = "";

        setupWheel(); // Call setupWheel here, after adding to prizes.
    });
}

const prizes = []; // Initial empty prizes array

const wheel = document.querySelector(".deal-wheel");
const spinner = wheel.querySelector(".spinner");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");
const reaper = wheel.querySelector(".grim-reaper");
const spinClass = "is-spinning";
const selectedClass = "selected";
const spinnerStyles = window.getComputedStyle(spinner);
let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;
let prizeSlice;
let prizeOffset;

const createPrizeNodes = () => {
    spinner.innerHTML = "";
    prizes.forEach(({ text, color, reaction }, i) => {
        const rotation = ((prizeSlice * i) * -1) - prizeOffset;

        spinner.insertAdjacentHTML(
            "beforeend",
            `<li class="prize" data-reaction=${reaction} style="--rotate: ${rotation}deg">
                <span class="text">${text}</span>
            </li>`
        );
    });
    prizeNodes = wheel.querySelectorAll(".prize");
};

const createConicGradient = () => {
    spinner.setAttribute(
        "style",
        `background: conic-gradient(
            from -90deg,
            ${prizes
                .map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`)
                .reverse()
            }
        );`
    );
};

const setupWheel = () => {
    prizeSlice = 360 / prizes.length;
    prizeOffset = Math.floor(180 / prizes.length);
    createConicGradient();
    createPrizeNodes();
};

const spinertia = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const runTickerAnimation = () => {
    const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
    const a = values[0];
    const b = values[1];
    let rad = Math.atan2(b, a);

    if (rad < 0) rad += (2 * Math.PI);

    const angle = Math.round(rad * (180 / Math.PI));
    const slice = Math.floor(angle / prizeSlice);

    if (currentSlice !== slice) {
        ticker.style.animation = "none";
        setTimeout(() => ticker.style.animation = null, 10);
        currentSlice = slice;
    }

    tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const selectPrize = () => {
    const selected = Math.floor(rotation / prizeSlice);
    prizeNodes[selected].classList.add(selectedClass);
    reaper.dataset.reaction = prizeNodes[selected].dataset.reaction;
};

trigger.addEventListener("click", () => {
    if (reaper.dataset.reaction !== "resting") {
        reaper.dataset.reaction = "resting";
    }

    trigger.disabled = true;
    rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
    prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
    wheel.classList.add(spinClass);
    spinner.style.setProperty("--rotate", rotation);
    ticker.style.animation = "none";
    runTickerAnimation();
});

spinner.addEventListener("transitionend", () => {
    cancelAnimationFrame(tickerAnim);
    trigger.disabled = false;
    trigger.focus();
    rotation %= 360;
    selectPrize();
    wheel.classList.remove(spinClass);
    spinner.style.setProperty("--rotate", rotation);
});

setupWheel(); // Initial setup