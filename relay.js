// MontCode™ Hybrid Relay Serverless Node
let vault = {}; // Memoria temporal para los mensajes

export default function handler(req, res) {
    const { id } = req.query;

    if (!id) return res.status(400).json({ error: "ID Required" });

    // MÉTODO POST: El Provider "Deja la nota"
    if (req.method === 'POST') {
        try {
            const body = JSON.parse(req.body);
            vault[id] = body; // Guarda el paquete en el casillero ID
            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: "Storage Error" });
        }
    }

    // MÉTODO GET: El Paciente "Recoge la nota"
    if (req.method === 'GET') {
        const message = vault[id];
        if (message) {
            // Una vez recogida, la borramos (seguridad por un solo uso)
            delete vault[id]; 
            return res.status(200).json({ message });
        }
        return res.status(200).json({ status: "Empty" });
    }
}

