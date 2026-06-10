const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// --- CONFIGURACIÓN DE MONGODB ---
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error de conexión:', err));

// --- MODELOS ---

// 1. Pacientes
const Paciente = mongoose.model('Paciente', new mongoose.Schema({
    id_paciente: String, nombre: String, apellidos: String,
    sexo: String, edad: Number, telefono: String,
    fecha_nac: String, direccion: String
}));

// 2. Odontólogos
const Odontologo = mongoose.model('Odontologo', new mongoose.Schema({
    id_od: String, nombre: String, especialidad: String,
    cedula: String, horario: String
}));

// 3. Pagos
const Pago = mongoose.model('Pago', new mongoose.Schema({
    folio: String, paciente: String, servicio: String,
    total: Number, pagado: Number, saldo: Number,
    metodo: String, fecha: String
}));

// 4. Citas
const Cita = mongoose.model('Cita', new mongoose.Schema({
    id_cita: String, paciente: String, doctor: String,
    servicio: String, fecha: String, hora: String, notas: String
}));

// --- RUTAS DE API ---

// Ruta para servir el HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});

// Endpoint genérico para guardar datos (POST)
app.post('/api/pacientes', async (req, res) => {
    try {
        const nuevo = new Paciente(req.body);
        await nuevo.save();
        res.status(201).json({ exito: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/odontologos', async (req, res) => {
    try {
        const nuevo = new Odontologo(req.body);
        await nuevo.save();
        res.status(201).json({ exito: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/citas', async (req, res) => {
    try {
        const nuevo = new Cita(req.body);
        await nuevo.save();
        res.status(201).json({ exito: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/pagos', async (req, res) => {
    try {
        const nuevo = new Pago(req.body);
        await nuevo.save();
        res.status(201).json({ exito: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor en puerto ${PORT}`);
});
