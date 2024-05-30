function writeData() {
    fetch('https://api.thingspeak.com/update?api_key=1K8OS7SCUKG2UXCE&field1=0')
        .then(response => response.text())
        .then(data => {
            document.getElementById('response').innerHTML = 'Write response: ' + data;
        })
        .catch(error => console.error('Error writing data:', error));
}

function readData() {
    fetch('https://api.thingspeak.com/channels/2545003/feeds.json?api_key=YW5XKP20X5TNFB36&results=20')
        .then(response => response.json())
        .then(data => {
            const feeds = data.feeds;
            const labels = feeds.map(feed => new Date(feed.created_at).toLocaleString());
            const temperatureData = feeds.map(feed => parseFloat(feed.field2)); // Misalnya field2 adalah temperature
            const humidityData = feeds.map(feed => parseFloat(feed.field1)); // Misalnya field1 adalah humidity

            // Update tabel
            const tableBody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear previous data
            feeds.forEach(feed => {
                const row = tableBody.insertRow();
                const timeCell = row.insertCell(0);
                const dateCell = row.insertCell(1);
                const tempCell = row.insertCell(2);
                const humidityCell = row.insertCell(3);
                
                const dateTime = new Date(feed.created_at);
                timeCell.innerHTML = dateTime.toLocaleTimeString();
                dateCell.innerHTML = dateTime.toLocaleDateString();
                tempCell.innerHTML = feed.field2; // Temperature
                humidityCell.innerHTML = feed.field1; // Humidity
            });

            // Draw chart
            const ctx = document.getElementById('myChart').getContext('2d');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Temperature',
                        data: temperatureData,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }, {
                        label: 'Humidity',
                        data: humidityData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error reading data:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    readData(); 
    setInterval(readData, 60000); 
});




