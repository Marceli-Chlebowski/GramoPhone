// Obsługa ładowania ramion i wkładek
document.addEventListener('DOMContentLoaded', async () => {
    const armSelect = document.getElementById('arm');
    const cartridgeSelect = document.getElementById('cartridge');

    try {
        // Poprawiona ścieżka do Netlify Functions
        const response = await fetch('/.netlify/functions/calculator/data');
        const { arms, cartridges } = await response.json();

        arms.forEach(arm => {
            const option = document.createElement('option');
            option.value = arm.id;
            option.textContent = arm.name;
            armSelect.appendChild(option);
        });

        cartridges.forEach(cartridge => {
            const option = document.createElement('option');
            option.value = cartridge.id;
            option.textContent = cartridge.name;
            cartridgeSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

// Funkcja do rysowania wykresu
let resonanceChart;

function createChart(resonanceFrequency) {
    const canvas = document.getElementById('resonanceChart');
    const ctx = canvas.getContext('2d');

    // Jeśli wykres już istnieje, usuń go przed utworzeniem nowego
    if (resonanceChart) {
        resonanceChart.destroy();
    }

    resonanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Very Poor', 'Poor', 'Excellent', 'Poor', 'Very Poor'],
            datasets: [{
                label: 'Resonance Frequency',
                data: [
                    resonanceFrequency >= 0 && resonanceFrequency <= 7.0 ? resonanceFrequency : 0,
                    resonanceFrequency >= 7.01 && resonanceFrequency <= 8.0 ? resonanceFrequency : 0,
                    resonanceFrequency >= 8.01 && resonanceFrequency <= 11.0 ? resonanceFrequency : 0,
                    resonanceFrequency >= 11.01 && resonanceFrequency <= 12.0 ? resonanceFrequency : 0,
                    resonanceFrequency > 12.01 ? resonanceFrequency : 0
                ],
                backgroundColor: [
                    'red',
                    'orange',
                    'green',
                    'orange',
                    'red',
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Scale' }
                },
                y: {
                    title: { display: true, text: 'Frequency (Hz)' },
                    min: 0,
                    max: 20,
                    ticks: {
                        stepSize: 1,
                        font: { weight: 'bold', size: 12 },
                        callback: function(value) {
                            return value;
                        },
                        color: function(context) {
                            const value = context.tick.value;
                            if (value >= 0 && value < 7) return 'red';
                            if (value >= 7 && value < 8) return 'orange';
                            if (value >= 8 && value <= 11) return 'green';
                            if (value > 11 && value <= 12) return 'orange';
                            if (value > 12) return 'red';
                            return 'black';
                        },
                    },
                },
            }
        }
    });

    // Po utworzeniu wykresu pokaż canvas
    canvas.style.display = 'block';

}

function updateEvaluationColor(resonanceFrequency) {
    const evaluationElement = document.getElementById('result');
    let color;

    if (resonanceFrequency >= 0 && resonanceFrequency <= 7.0) {
        color = 'red'; // Very Poor
    } else if (resonanceFrequency >= 7.01 && resonanceFrequency <= 8.0) {
        color = 'orange'; // Poor
    } else if (resonanceFrequency >= 8.01 && resonanceFrequency <= 11.0) {
        color = 'green'; // Excellent
    } else if (resonanceFrequency >= 11.01 && resonanceFrequency <= 12.0) {
        color = 'orange'; // Poor
    } else if (resonanceFrequency > 12.01) {
        color = 'red'; // Very Poor
    }

    // Zmień kolor tekstu
    evaluationElement.style.color = color;
}

// Obsługa formularza i wyświetlanie wyniku
document.getElementById('calcForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const arm = document.getElementById('arm').value;
    const cartridge = document.getElementById('cartridge').value;
    const additionalMass = document.getElementById('additionalMass').value;

    try {
        // Poprawiona ścieżka do Netlify Functions
        const response = await fetch('/.netlify/functions/calculator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ armId: parseInt(arm), cartridgeId: parseInt(cartridge), additionalMass })
        });

        const resultDiv = document.getElementById('result');
        if (response.ok) {
            const data = await response.json();
            resultDiv.innerHTML = `
                <p>Resonance Frequency: ${data.resonanceFrequency} Hz</p>
                <p>Effective Mass: ${data.effectiveMass} g</p>
                <p>Compliance: ${data.compliance}</p>
                <p>Evaluation: ${data.evaluation}</p>
            `;

            // Zmień kolor oceny
            updateEvaluationColor(parseFloat(data.resonanceFrequency));

            // Rysowanie wykresu na podstawie wyniku
            createChart(parseFloat(data.resonanceFrequency));
        } else {
            resultDiv.innerHTML = `<p>Error: Invalid input data</p>`;
        }
    } catch (error) {
        console.error('Error processing calculation:', error);
    }
});