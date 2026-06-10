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
const Paciente = mongoose.model('Paciente', new mongoose.Schema({
    id_paciente: String, nombre: String, apellidos: String,
    sexo: String, edad: Number, telefono: String,
    fecha_nac: String, direccion: String
}, { collection: 'pacientes' }));

const Odontologo = mongoose.model('Odontologo', new mongoose.Schema({
    id_od: String, nombre: String, especialidad: String,
    cedula: String, horario: String
}, { collection: 'odontologos' }));

const Pago = mongoose.model('Pago', new mongoose.Schema({
    folio: String, paciente: String, servicio: String,
    total: Number, pagado: Number, saldo: Number,
    metodo: String, fecha: String
}, { collection: 'pagos' }));

const Cita = mongoose.model('Cita', new mongoose.Schema({
    id_cita: String, paciente: String, doctor: String,
    servicio: String, fecha: String, hora: String, notas: String
}, { collection: 'citas' }));

const Servicio = mongoose.model('Servicio', new mongoose.Schema({
    codigo: String, nombre: String, precio: Number, descripcion: String
}, { collection: 'servicios' }));

// --- HELPER: GENERADOR DE RUTAS CRUD ---
function crearRutas(router, modelo, nombreRuta) {
    // GET todos
    router.get(`/api/${nombreRuta}`, async (req, res) => {
        try {
            const docs = await modelo.find().sort({ _id: -1 });
            res.json(docs);
        } catch (e) { res.status(500).json({ error: e.message }); }
    });

    // POST crear
    router.post(`/api/${nombreRuta}`, async (req, res) => {
        try {
            const nuevo = new modelo(req.body);
            await nuevo.save();
            res.status(201).json(nuevo);
        } catch (e) { res.status(500).json({ error: e.message }); }
    });

    // PUT actualizar
    router.put(`/api/${nombreRuta}/:id`, async (req, res) => {
        try {
            const doc = await modelo.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!doc) return res.status(404).json({ error: 'No encontrado' });
            res.json(doc);
        } catch (e) { res.status(500).json({ error: e.message }); }
    });

    // DELETE eliminar
    router.delete(`/api/${nombreRuta}/:id`, async (req, res) => {
        try {
            const doc = await modelo.findByIdAndDelete(req.params.id);
            if (!doc) return res.status(404).json({ error: 'No encontrado' });
            res.json({ eliminado: true });
        } catch (e) { res.status(500).json({ error: e.message }); }
    });
}

// --- REGISTRAR RUTAS PARA CADA COLECCIÓN ---
crearRutas(app, Paciente,    'pacientes');
crearRutas(app, Odontologo,  'odontologos');
crearRutas(app, Pago,        'pagos');
crearRutas(app, Cita,        'citas');
crearRutas(app, Servicio,    'servicios');

// --- RUTA PRINCIPAL ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
