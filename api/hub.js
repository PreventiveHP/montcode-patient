let clinicalVault = {}; // Usamos un objeto para separar por StationID

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // --- RECEPCIÓN (Paciente envía datos) ---
    if (req.method === 'POST') {
        const { id, data, type } = req.body;
        
        if (!id) return res.status(400).json({ error: "Missing Station ID" });

        // Guardamos los datos en la "bóveda" bajo el ID de esa estación
        clinicalVault[id] = {
            payload: data,
            type: type || "SYNC",
            timestamp: new Date().toISOString(),
            status: "VERIFIED"
        };

        // FEEDBACK que recibe el paciente en su pantalla
        return res.status(200).json({ 
            status: "SUCCESS", 
            message: "Clinical Handshake Complete",
            node: id,
            instruction: "You may now close the uplink."
        });
    }

    // --- CONSULTA (Doctor lee datos) ---
    if (req.method === 'GET') {
        const { id } = req.query;
        
        if (id && clinicalVault[id]) {
            const response = clinicalVault[id];
            // Opcional: limpiar la bóveda después de leer para seguridad P2P
            // delete clinicalVault[id]; 
            return res.status(200).json(response);
        }
        
        return res.status(200).json({ message: "Awaiting encrypted signal..." });
    }
}
