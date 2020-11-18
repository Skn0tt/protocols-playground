import { setupEditor } from "./editor";
import executor from "./executor";
import "./ui"

setupEditor(document.getElementById("editor-container"), executor);
