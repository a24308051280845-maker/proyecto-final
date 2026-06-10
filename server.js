const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// --- CONFIGURACIÓN DE MONGODB ---
// La URI se guarda en una variable de entorno para no exponer la contraseña en GitHub.
// En Render: configura la variable MONGO_URI en el panel de Environment Variables.
// En local:  crea un archivo .env con la línea: MONGO_URI=mongodb://tu-uri-aqui
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ ERROR: La variable de entorno MONGO_URI no está definida.');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ ¡Conectado con éxito a MongoDB!'))
    .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// --- 1. ESQUEMA Y MODELO DE PACIENTES ---
const PacienteSchema = new mongoose.Schema({
    id_paciente: String,
    nombre:      String,
    apellidos:   String,
    sexo:        String,
    edad:        String,
    telefono:    String,
    fecha_nac:   String,
    direccion:   String
});
const Paciente = mongoose.model('Paciente', PacienteSchema);

// --- 2. ESQUEMA Y MODELO DE ODONTÓLOGOS ---
const OdontologoSchema = new mongoose.Schema({
    id:           String,
    nombre:       String,
    especialidad: String,
    turno:        String
});
const Odontologo = mongoose.model('Odontologo', OdontologoSchema);

// --- 3. ESQUEMA Y MODELO DE PAGOS ---
const PagoSchema = new mongoose.Schema({
    id:       String,
    paciente: String,
    fecha:    String,
    precio:   String,
    forma:    String
});
const Pago = mongoose.model('Pago', PagoSchema);

// --- RUTA RAÍZ ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dagv-dentista.html'));
});

// ==========================================
// --- ENDPOINTS PARA ODONTÓLOGOS ---
// ==========================================
app.get('/api/odontologos', async (req, res) => {
    try {
        const odontologos = await Odontologo.find();
        res.json(odontologos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/odontologos', async (req, res) => {
    try {
        const nuevoOdontologo = new Odontologo(req.body);
        await nuevoOdontologo.save();
        res.status(201).json({ exitoso: true });
    } catch (error) {
        res.status(500).json({ exitoso: false, error: error.message });
    }
});

app.put('/api/odontologos/:id', async (req, res) => {
    try {
        await Odontologo.findByIdAndUpdate(req.params.id, req.body);
        res.json({ exitoso: true });
    } catch (error) {
        res.status(500).json({ exitoso: false, error: error.message });
    }
});

app.delete('/api/odontologos/:id', async (req, res) => {
    try {
        await Odontologo.findByIdAndDelete(req.params.id);
        res.json({ exitoso: true });
    } catch (error) {
        res.status(500).json({ exitoso: false, error: error.message });
    }
});

// ==========================================
// --- ENDPOINTS PARA PAGOS ---
// ==========================================
app.get('/api/pagos', async (req, res) => {
    try {
        const pagos = await Pago.find();
        res.json(pagos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pagos', async (req, res) => {
    try {
        const nuevoPago = new Pago(req.body);
        await nuevoPago.save();
        res.status(201).json({ exitoso: true });
    } catch (error) {
        res.status(500).json({ exitoso: false, error: error.message });
    }
});

app.put('/api/pagos/:id', async (req, res) => {
    try {
        await Pago.findByIdAndUpdate(req.params.id, req.body);
        res.json({ exitoso: true });
    } catch (error) {
        res.status(500).json({ exitoso: false, error: error.message });
    }
});

app.delete('/api/pagos/:id', async (req, res) => {
    try {
        await Pago.findByIdAndDelete(req.params.id);
        res.json({ exitoso: true });
    } catch (error) {
        res.status(500).json({ exitoso: false, error: error.message });
    }
});

// ==========================================
// --- ENDPOINTS PARA PACIENTES ---
// ==========================================
app.get('/api/pacientes', async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pacientes', async (req, res) => {
    try {
        const nuevoPaciente = new Paciente(req.body);
        await nuevoPaciente.save();
        res.status(201).json({ exitoso: true, mensaje: '¡Datos guardados con éxito!' });
    } catch (error) {
        res.status(500).json({ exitoso: false, error: 'No se pudieron guardar los datos.' });
    }
});

app.put('/api/pacientes/:id', async (req, res) => {
    try {
        await Paciente.findByIdAndUpdate(req.params.id, req.body);
        res.json({ exitoso: true });
    } catch (error) {
        res.status(500).json({ exitoso: false, error: error.message });
    }
});

app.delete('/api/pacientes/:id', async (req, res) => {
    try {
        await Paciente.findByIdAndDelete(req.params.id);
        res.json({ exitoso: true });
    } catch (error) {
        res.status(500).json({ exitoso: false, error: error.message });
    }
});

// --- INICIAR EL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor corriendo en el puerto: ${PORT}`);
});
