document.getElementById('sendButton').addEventListener('click', () => {
    fetch('http://localhost:5832/api/endpoint', {
        method: 'POST', // or 'GET'
        headers: {
            'Content-Type': 'application/json'
            // Add any additional headers if needed
        },
        body: JSON.stringify({ key: 'value' }) // Replace with your data
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from Flask:', data);
        // Handle the response from Flask if needed
    })
    .catch(error => {
        console.error('Error sending request to Flask:', error);
    });
});