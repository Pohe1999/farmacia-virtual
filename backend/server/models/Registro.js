const mongoose = require("mongoose");

const registroSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  edad: { type: Number, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  producto: { type: String, required: true },  // Agregar este campo para el producto
});

const Registro = mongoose.model("Registro", registroSchema);

module.exports = Registro;
