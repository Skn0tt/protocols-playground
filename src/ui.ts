import * as WalkieTalkie from "./walkie-talkie";

const outlog = document.getElementById("out-log") as HTMLParagraphElement;

export function writeToOutlog(msg: string) {
  outlog.innerText += msg + "\n";
}

export function overrideToOutlog(lineIndex: number, msg: string) {
  const lines = outlog.innerText.split("\n")

  lines[lineIndex] = msg;

  outlog.innerText = lines.join("\n")
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
