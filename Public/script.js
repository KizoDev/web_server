document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/hello')
        .then(response => response.json())
        .then(data => {
            console.log('Greeting message:', data.greetingMessage); // Check the generated greeting message
            document.getElementById('greeting').textContent = data.greetingMessage;
        })
        .catch(error => {
            console.error('Error fetching greeting message:', error);
            document.getElementById('greeting').textContent = 'Hello Mark, we could not fetch your location or weather data at this time.';
        });
});
