function initializeIDE() {
    document.getElementById('runButton').addEventListener('click', runningCode);
}

function runningCode(e) {
    var userCode = document.getElementById('codeEditor').value;

    // Display the user's code in the output area (optional)
    document.getElementById('output').innerText = userCode;

    // Execute the user's code (you may use eval() or a sandboxed environment)
    try {
        eval(userCode); // Note: Using eval() is generally not recommended in production due to security risks
    } catch (error) {
        console.error('Error executing code:', error);
    }
}

// Call the initializeIDE function when the page loads
window.onload = initializeIDE;
