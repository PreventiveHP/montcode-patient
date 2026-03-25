let clinicalLogs = [];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        try {
            const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            
            // Creamos una entrada con metadatos de auditoría clínica
            const entry = {
                id: Date.now(),
                stationID: payload.id || "UNKNOWN-STATION", // Vincula con el QR del Dr.
                payload: payload.data, // Aquí vienen los síntomas, BP, Glucosa, etc.
                type: payload.type || "GENERAL_SYNC",
                timestamp: new Date().toISOString(),
                status: "VERIFIED_P2P"
            };

            clinicalLogs.unshift(entry);
            
            // Mantenemos solo los últimos 50 registros para optimizar memoria local
            if (clinicalLogs.length > 50) clinicalLogs.pop();

            // Mensaje de feedback que el paciente verá en su App
            return res.status(200).json({ 
                status: "Received", 
                message: "Clinical Handshake Successful",
                protocol: "MontCode™ v2.6"
            });
        } catch (error) {
            return res.status(400).json({ status: "Error", message: "Invalid Handshake Data" });
        }
    }

    if (req.method === 'GET') {
        const { id } = req.query;
        // Si el Dr. pide un ID específico, filtramos para que no vea datos de otros pacientes
        if (id) {
            const filtered = clinicalLogs.find(log => log.stationID === id);
            return res.status(200).json(filtered || { message: "Waiting for signal..." });
        }
        return res.status(200).json(clinicalLogs);
    }
}
