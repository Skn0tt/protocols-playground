import { overrideToOutlog, writeToOutlog } from "./ui";
import * as WalkieTalkie from "./walkie-talkie";

export const declaration = `
function log(message: string, lineToOverride?: number): void
function send(message: string): void
`;

interface IButton {
  caption?: string,
  id?: string,
  onclick?: () => void
}

function log(message: string, lineToOverride?: number) {
  if (typeof lineToOverride === "number") {
    overrideToOutlog(lineToOverride, message);
  } else {
    writeToOutlog(message);
  }
}

function send(message: string) {
  WalkieTalkie.send(message);
}

function createButtons(buttons: IButton[]) {
  document.getElementById("btn-container").innerHTML = "";
  buttons.forEach(button => {
    createButton(button);
  });
}

function createButton(button: IButton) {
  if (typeof button.caption === "undefined" || button.caption.length === 0) return;
  const btnContainer = document.getElementById("btn-container");
  btnContainer.innerHTML += `<button id="${(button.id ? button.id : "")}" class="btn btn-primary" type="button" onclick="${button.onclick}()">${button.caption}</button>`
}

export const initialContent = `
// === Button definitions =====================

var buttons = [
  {
    caption: "A",
    onclick: "onPressA",
    id: "btnA"
  },
  {
    caption: "B",
    onclick: "onPressB",
    id: "btnB"
  }
  /* New button:
     {
       caption: string,
       onclick: function name (add to routes below),
       id: string (optional)
     }
  */
];

// === Route button functions =================

// simply add 'window.' before the onclick-function
window.onPressA = onPressA;
window.onPressB = onPressB;

// === Your code =============================

function onPressA() {
  log("A was pressed")
}

function onPressB() {
  log("B was pressed")
}

function onReceive(msg) {
  log(msg)
}

function onSubmit(input) {
  // do smth when pressing enter in text input
}
`.trim();

WalkieTalkie.listen((msg) => (window as any).handlers.onReceive(msg));

export default function execute(code: string) {
  eval(`
    window.handlers = {}
    window.handlers.onReceive = typeof onReceive !== "undefined" ? onReceive : undefined;
    window.handlers.onSubmit = typeof onSubmit !== "undefined" ? onSubmit : () => alert("Specify onSubmit()");

    var buttons = [];

    ${code}

    createButtons(buttons);

  `);
}
