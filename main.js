async function runningCode() {
  var userCode = document.getElementById("code-editor").value;

  try {
    const response = await fetch("/compile-and-run", {
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
