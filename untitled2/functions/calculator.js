const serverless = require('serverless-http');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());

// Wczytanie danych z JSON
const dataPath = path.join(__dirname, '../data/database.json');
const data = JSON.parse(fs.readFileSync(dataPath));
const { arms, cartridges } = data;

// API kalkulatora
app.post('/api/calculator', (req, res) => {
    const { armId, cartridgeId, additionalMass } = req.body;

    const arm = arms.find(a => a.id === parseInt(armId));
    const cartridge = cartridges.find(c => c.id === parseInt(cartridgeId));
    const additionalMassFloat = parseFloat(additionalMass);

    if (!arm || !cartridge || isNaN(additionalMassFloat)) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    const effectiveMass = arm.effectiveMass + cartridge.mass + additionalMassFloat;
    const compliance = cartridge.compliance;
    const resonanceFrequency = (1000 / (2 * Math.PI)) * Math.sqrt(1 / (effectiveMass * compliance));

    // Ocena wyniku na podstawie skali z Excela
    const evaluateResonance = (frequency) => {
        if (frequency < 8 || frequency > 11) return "Poor match";
        if (frequency >= 8 && frequency <= 11) return "Optimal match";
    };

    const evaluation = evaluateResonance(resonanceFrequency);

    res.json({
        resonanceFrequency: resonanceFrequency.toFixed(2),
        effectiveMass: effectiveMass.toFixed(2),
        compliance: compliance.toFixed(2),
        evaluation
    });
});

// Endpoint do zwrócenia danych ramion i wkładek
app.get('/api/calculator/data', (req, res) => {
    res.json({ arms, cartridges });
});

// Eksport funkcji serverless
module.exports.handler = serverless(app);