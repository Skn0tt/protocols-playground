import { overrideToOutlog, writeToOutlog } from "./ui";
import * as WalkieTalkie from "./walkie-talkie";

export const declaration = `
function log(message: string, lineToOverride?: number): void
function send(message: string): void
`;

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

export const initialContent = `
function onPressA() {
  log("A was pressed")
}

function onReceive(msg) {
  log(msg)
}

function onSubmit(input) {
  // do smth
}
`.trim();

WalkieTalkie.listen((msg) => (window as any).handlers.onReceive(msg));

export default function execute(code: string) {
  eval(`
window.buttons = {}
window.buttons.onPressA = typeof onPressA !== "undefined" ? onPressA : () => alert("Specify onPressA()");
window.buttons.onPressB = typeof onPressB !== "undefined" ? onPressB : () => alert("Specify onPressB()");
window.buttons.onPressC = typeof onPressC !== "undefined" ? onPressC : () => alert("Specify onPressC()");
window.buttons.onPressD = typeof onPressD !== "undefined" ? onPressD : () => alert("Specify onPressD()");

window.handlers = {}
window.handlers.onReceive = typeof onReceive !== "undefined" ? onReceive : undefined;
window.handlers.onSubmit = typeof onSubmit !== "undefined" ? onSubmit : () => alert("Specify onSubmit()");

${code}
  `);
}
