
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
        /*
        '/wick/main.hpp',
        '/wick/main.cpp',
        '/wick/extra.cpp',
        '/wick/extra.hpp'*/
        'wick.exe'
    ];
    const fetchPromises = headerFiles.map(file => fetch(file).then(response => response.text()));

    return Promise.all(fetchPromises);
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
