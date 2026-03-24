
// montcode-patient/api/relay.js

// NOTA: En Vercel Serverless, esto es temporal (volátil)
let vault = {}; 

export default function handler(req, res) {
    // Permitir que cualquier dispositivo se conecte (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID Required" });

    // MÉTODO POST: Dr. deja nota
    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            vault[id] = body; 
            console.log(`Mensaje guardado para ${id}`);
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: "Data Error" });
        }
    }

    // MÉTODO GET: Paciente recoge nota
    if (req.method === 'GET') {
        const message = vault[id];
        if (message) {
            // No borramos de inmediato para pruebas, que expire solo
            return res.status(200).json({ message });
        }
        return res.status(200).json({ status: "Empty" });
    }
}
