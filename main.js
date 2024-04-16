<<<<<<< Updated upstream

function runCode(){ 
    const userCode = document.getElementById('code-editor').value;

    fetch('/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: userCode }),
    })
    .then(response => response.json())
    .then(data => {     
        document.getElementById('output').textContent = data.output || data.error;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('output').textContent = 'Error executing code';
    });
}

function fetchCppHeaders() {
    const headerFiles = [
        '/wick/main.hpp',
        '/wick/main.cpp',
        '/wick/extra.cpp',
        '/wick/extra.hpp'
    ];
    const fetchPromises = headerFiles.map(file => fetch(file).then(response => response.text()));

    return Promise.all(fetchPromises);
=======
function initializeIDE() {
  document.getElementById("runButton").addEventListener("click", runningCode);
}

async function runningCode() {
  var userCode = document.getElementById("code-editor").value;

  try {
    const response = await fetch("/run", {
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
>>>>>>> Stashed changes
}

function executeCode(code) {
    fetch('/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('output').textContent = data.output || data.error;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('output').textContent = 'Error executing code';
    });
}
