import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import { declaration as executorDecl, initialContent as executorInitialContent } from "./executor";

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === "typescript" || label === "javascript") {
      return "./ts.worker.js";
    }
    return "./editor.worker.js";
  },
};

function debounce(ms, func) {
  let lastTimer = undefined;

  return (...args) => {
    if (lastTimer) {
      clearTimeout(lastTimer);
    }

    lastTimer = setTimeout(() => func(...args), ms);
  };
}

monaco.languages.typescript.typescriptDefaults.addExtraLib(executorDecl);

/**
 *
 * @param {any} element
 * @param {(code: string) => void} onExecute
 */
export function setupEditor(element, onExecute) {
  const initialContent = localStorage.getItem("content") ?? executorInitialContent
  const editor = monaco.editor.create(element, {
    value: initialContent,
    language: "typescript",
  });

  onExecute(initialContent);

  editor.getModel().onDidChangeContent(
    debounce(500, (event) => {
      const content = editor.getValue();
      localStorage.setItem("content", content)
      onExecute(content);
    })
  );
}
