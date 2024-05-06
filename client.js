async function runningCode() {
  try {
    var userCode = document.getElementById("code-editor").value;

    const response = await fetch("http://localhost:8000/compile-and-run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: userCode }),
    });

    if (!response.ok) {
      throw new Error("Failed to execute code");
    }

    const result = await response.json();

    document.getElementById("output").innerText = result.output;
  } catch (error) {
    console.error("Error executing code:", error);
  }
}

document.getElementById("compileButton").addEventListener("click", runningCode);
