import * as WalkieTalkie from "./walkie-talkie";

const outlog = document.getElementById("out-log") as HTMLParagraphElement;

function selectionWrapper(content: string, cls?: string, title?: string): string {
  // wraps given content with a paragraph to limit selection by a user's double click to this content
  return '<p ' +
    (title ? ' title="' + title + '"' : "") + 
    (cls ? ' class="' + cls + '"' : "") +'>' + content + '</p>';
}

function getHmString(date: Date): string {
    var localeSpecificTime = date.toLocaleTimeString();
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
}

function getHmsString(date: Date): string {
    var localeSpecificTime = date.toLocaleTimeString();
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit',
      second:'2-digit'
    });
}

function getLogTimeString(date: Date): string {
  return selectionWrapper(getHmString(date), "log-time", getHmsString(date));
}

export function writeToOutlog(msg: string) {
  if (outlog.innerHTML !== "") outlog.innerHTML = "<br>" + outlog.innerHTML;
  outlog.innerHTML = 
    getLogTimeString(new Date()) + ' ' + 
    selectionWrapper(msg) + outlog.innerHTML;
}

export function overrideToOutlog(lineIndex: number, msg: string) {
  const lines = outlog.innerHTML.split("<br>");

  let [timestamp, prev_msg, lastChange = ""] = lines[lineIndex].split("</p>");
  timestamp += "</p>";

  // update last change
  lastChange = selectionWrapper(`(last change: ${getHmString(new Date())})`, 'log-time last-change', getHmsString(new Date()));

  // update line
  lines[lineIndex] = timestamp + ' ' + msg + ' ' + lastChange;

  outlog.innerHTML = lines.join("<br>");
}

const channelInput = document.getElementById(
  "channel-input"
) as HTMLInputElement;
channelInput.value = "" + WalkieTalkie.getChannel();
channelInput.onchange = () => {
  WalkieTalkie.setChannel(+channelInput.value);
};

const inputForm = document.getElementById(
  "input-form"
) as HTMLFormElement;

inputForm.onsubmit = (evt) => {
  evt.preventDefault()
  const input = new FormData(inputForm).get("value");
  (window as any).handlers.onSubmit(input);
  inputForm.reset()
}
