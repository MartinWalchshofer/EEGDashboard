document.getElementById('sendButton').addEventListener('click', async () => {
    console.log('test');
    try {
        const response = await fetch('http://localhost:5832/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cmd: 'StartScanning' })
        });
        const data = await response.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
});