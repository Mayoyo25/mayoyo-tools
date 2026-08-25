(() => {
  "use strict";

  const input = document.getElementById("input");
  const output = document.getElementById("output");
  const statusText = document.getElementById("statusText");
  const typeText = document.getElementById("typeText");
  const charText = document.getElementById("charText");
  const lineText = document.getElementById("lineText");

  const errorBox = document.getElementById("errorBox");
  const errorMessage = document.getElementById("errorMessage");
  const errorLocation = document.getElementById("errorLocation");
  const errorLine = document.getElementById("errorLine");

  const validateBtn = document.getElementById("validateBtn");
  const clearBtn = document.getElementById("clearBtn");
  const sampleBtn = document.getElementById("sampleBtn");
  const largeSampleBtn = document.getElementById("largeSampleBtn");
  const copyBtn = document.getElementById("copyBtn");
  const minifyBtn = document.getElementById("minifyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const toast = document.getElementById("toast");
  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");
  const dropOverlay = document.getElementById("dropOverlay");

  let parsedValue = null;
  let formattedValue = "";
  let toastTimer = null;

  const sample = {
    name: "Franklin Mayoyo",
    role: "Software Engineer",
    active: true,
    skills: ["Python", "JavaScript", "TypeScript"],
    profile: {
      location: "Nairobi",
      available: true
    },
    projects: [
      { name: "JSON Validator", status: "active" },
      { name: "Example API", status: "draft" }
    ],
    metadata: null
  };

  function updateStats(text) {
    charText.textContent = text.length.toLocaleString();
    lineText.textContent = text.length
      ? text.split(/\r\n|\r|\n/).length.toLocaleString()
      : "0";
  }

  function getJsonType(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";

    const type = typeof value;

    if (type === "object") return "object";
    return type;
  }

  function setStatus(message, valid = null) {
    statusText.textContent = message;

    statusText.classList.remove(
      "text-slate-300",
      "text-emerald-400",
      "text-red-400",
      "text-amber-400"
    );

    if (valid === true) {
      statusText.classList.add("text-emerald-400");
    } else if (valid === false) {
      statusText.classList.add("text-red-400");
    } else {
      statusText.classList.add("text-slate-300");
    }
  }

  function setOutput(text) {
    formattedValue = text;

    if (!text) {
      output.innerHTML =
        '<span class="text-slate-700">Formatted JSON will appear here.</span>';
      return;
    }

    if (window.Prism) {
      output.innerHTML = Prism.highlight(
        text,
        Prism.languages.json,
        "json"
      );
    } else {
      output.textContent = text;
    }
  }

  function setButtons(enabled) {
    copyBtn.disabled = !enabled;
    minifyBtn.disabled = !enabled;
    downloadBtn.disabled = !enabled;
  }

  function clearError() {
    errorBox.classList.add("hidden");
    errorMessage.textContent = "";
    errorLocation.textContent = "";
    errorLine.textContent = "";
  }

  function showError(error, text) {
    errorBox.classList.remove("hidden");
    errorMessage.textContent = error.message || "Invalid JSON.";

    const line = error.lineNumber ?? error.lineno ?? "?";
    const column = error.columnNumber ?? error.colno ?? "?";

    errorLocation.textContent = `Line ${line}, column ${column}`;

    const lines = text.split(/\r\n|\r|\n/);
    const sourceLine = lines[(Number(line) || 1) - 1] ?? "";

    if (sourceLine) {
      const safeColumn = Math.max(1, Number(column) || 1);

      errorLine.textContent =
        sourceLine +
        "\n" +
        " ".repeat(Math.max(0, safeColumn - 1)) +
        "^";
    }
  }

  function validate() {
    const text = input.value;

    updateStats(text);
    clearError();

    if (!text.trim()) {
      parsedValue = null;
      formattedValue = "";

      setStatus("Waiting for JSON");
      typeText.textContent = "-";
      setOutput("");
      setButtons(false);

      return;
    }

    try {
      parsedValue = JSON.parse(text);
      formattedValue = JSON.stringify(parsedValue, null, 2);

      setStatus("Valid JSON", true);
      typeText.textContent = getJsonType(parsedValue);
      setOutput(formattedValue);
      setButtons(true);
    } catch (error) {
      parsedValue = null;
      formattedValue = "";

      setStatus("Invalid JSON", false);
      typeText.textContent = "-";
      setOutput("");
      setButtons(false);

      showError(error, text);
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.add("hidden");
    }, 1800);
  }

  async function copyOutput() {
    if (!formattedValue) return;

    try {
      await navigator.clipboard.writeText(formattedValue);
      showToast("Formatted JSON copied");
    } catch {
      showToast("Copy failed - browser permission denied");
    }
  }

  function minify() {
    if (parsedValue === null) return;

    const minified = JSON.stringify(parsedValue);

    setOutput(minified);
    showToast("JSON minified");
  }

  function download() {
    if (!formattedValue) return;

    const blob = new Blob([formattedValue + "\n"], {
      type: "application/json;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "validated.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showToast("JSON downloaded");
  }

  const MAX_FILE_BYTES = 10 * 1024 * 1024;

  function loadFile(file) {
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      showToast("File too large (max 10MB)");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      input.value =
        typeof reader.result === "string"
          ? reader.result
          : "";

      validate();
      showToast(`Loaded ${file.name}`);
    };

    reader.onerror = () => {
      showToast("Could not read file");
    };

    reader.readAsText(file);
  }

  async function loadLargeSample() {
    try {
      largeSampleBtn.disabled = true;

      const response = await fetch("sample.json");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      input.value = await response.text();
      validate();
    } catch (error) {
      console.error("Failed to load sample.json:", error);
      showToast("Could not load sample.json");
    } finally {
      largeSampleBtn.disabled = false;
    }
  }

  function clear() {
    input.value = "";
    parsedValue = null;
    formattedValue = "";

    updateStats("");
    setStatus("Waiting for JSON");
    typeText.textContent = "-";
    setOutput("");
    setButtons(false);
    clearError();

    input.focus();
  }

  validateBtn.addEventListener("click", validate);

  clearBtn.addEventListener("click", clear);

  sampleBtn.addEventListener("click", () => {
    input.value = JSON.stringify(sample, null, 2);
    validate();
  });

  largeSampleBtn.addEventListener("click", loadLargeSample);

  copyBtn.addEventListener("click", copyOutput);

  minifyBtn.addEventListener("click", minify);

  downloadBtn.addEventListener("click", download);

  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];

    fileInput.value = "";

    loadFile(file);
  });

  let dragDepth = 0;

  input.addEventListener("dragenter", (event) => {
    event.preventDefault();

    dragDepth += 1;

    dropOverlay.classList.remove("hidden");
    dropOverlay.classList.add("flex");
  });

  input.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  input.addEventListener("dragleave", () => {
    dragDepth = Math.max(0, dragDepth - 1);

    if (dragDepth === 0) {
      dropOverlay.classList.add("hidden");
      dropOverlay.classList.remove("flex");
    }
  });

  input.addEventListener("drop", (event) => {
    event.preventDefault();

    dragDepth = 0;

    dropOverlay.classList.add("hidden");
    dropOverlay.classList.remove("flex");

    const file =
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0];

    loadFile(file);
  });

  input.addEventListener("input", () => {
    updateStats(input.value);

    setStatus(
      input.value.trim()
        ? "Not validated"
        : "Waiting for JSON"
    );

    clearError();
  });

  input.addEventListener("keydown", (event) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === "Enter"
    ) {
      event.preventDefault();
      validate();
    }

    if (event.key === "Tab") {
      event.preventDefault();

      const start = input.selectionStart;
      const end = input.selectionEnd;

      input.setRangeText("  ", start, end, "end");
    }
  });

  updateStats("");
  setButtons(false);
})();