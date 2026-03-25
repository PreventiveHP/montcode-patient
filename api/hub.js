// /api/hub.js - El Servidor de Enlace MontCode™
let clinicalVault = {}; // Memoria temporal para el intercambio

export default function handler(req, res) {
    // 1. PERMISOS DE CONEXIÓN (CORS) - Esto elimina el error de "Offline"
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    // 2. EL PACIENTE ENVÍA DATOS (POST)
    if (req.method === 'POST') {
        const { data } = req.body;
        if (!id || !data) return res.status(400).json({ error: "Missing ID or Data" });
        
        clinicalVault[id] = {
            data: data,
            timestamp: Date.now()
        };
        return res.status(200).json({ status: "Signal Transmitted" });
    }

    // 3. EL DOCTOR RECIBE DATOS (GET)
    if (req.method === 'GET') {
        if (!id) return res.status(400).json({ error: "Identification Required" });
        
        const report = clinicalVault[id];
        if (!report) return res.status(404).json({ status: "Awaiting Patient Signal" });

        return res.status(200).json(report);
    }
}
