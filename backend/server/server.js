// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid"); // Importamos uuid para generar identificadores únicos

// Crear la aplicación de Express
const app = express();

// Usar cors para permitir peticiones entre dominios (React + Express)
app.use(cors());

// Usar bodyParser para manejar las solicitudes con JSON
app.use(bodyParser.json());

// Conexión a MongoDB Atlas utilizando la variable de entorno
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error al conectar a MongoDB Atlas", err));

// Definir el modelo de Producto
const Producto = mongoose.model(
  "Producto",
  new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true }, // Campo de stock
  })
);

// Definir el modelo de Cuentas (para validar usuarios)
const Cuenta = mongoose.model(
  "Cuenta",
  new mongoose.Schema({
    user: { type: String, required: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validación de email
    },
  })
);

// Ruta para validar login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar la cuenta por email
    const cuenta = await Cuenta.findOne({ email });

    if (!cuenta) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    // Comparar la contraseña directamente
    if (cuenta.password !== password) {
      return res
        .status(401)
        .json({ message: "Usuario o contraseña incorrectos" });
    }

    res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error("Error al validar la cuenta:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

// Ruta para obtener todos los productos
app.get("/api/productos", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos); // Enviar los productos como respuesta
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
});

// Ruta para recibir los datos del formulario y guardarlos en la base de datos
app.post("/api/registro", async (req, res) => {
  const {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    fechaNacimiento,
    municipio,
    descripcionPadecimiento,
    celular,
    correo,
    producto,
  } = req.body;

  try {
    // Generar un folio único alfanumérico
    const folio = `FOL-${new Date().getFullYear()}-${uuidv4().slice(0, 8)}`;

    // Crear un nuevo registro en MongoDB
    const nuevoRegistro = new Registro({
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento,
      municipio,
      descripcionPadecimiento,
      celular,
      correo,
      producto,
      folio, // Guardamos el folio en el registro
    });

    // Guardar el registro
    await nuevoRegistro.save();

    // Decrementar el stock del producto
    const productoEncontrado = await Producto.findOne({ name: producto });

    if (!productoEncontrado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (productoEncontrado.stock <= 0) {
      return res
        .status(400)
        .json({ message: "No hay suficiente stock para este producto" });
    }

    productoEncontrado.stock -= 1;
    await productoEncontrado.save();

    // Responder con el folio generado
    res.status(201).json({
      message: "Registro guardado exitosamente y stock actualizado.",
      folio, // Incluir el folio generado en la respuesta
    });
  } catch (error) {
    console.error("Error al guardar el registro o actualizar el stock:", error);
    res.status(500).json({
      message: "Error al guardar el registro o actualizar el stock",
      error,
    });
  }
});

// Ruta para actualizar el stock manualmente (opcional)
app.patch("/api/productos/:id/decrementar", async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (producto.stock > 0) {
      producto.stock -= 1;
      await producto.save();
      res.json({ message: "Stock actualizado con éxito", stock: producto.stock });
    } else {
      res.status(400).json({ message: "No hay suficiente stock" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el stock", error });
  }
});

// Definir el modelo de Registro
const Registro = mongoose.model(
  "Registro",
  new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidoPaterno: { type: String },
    apellidoMaterno: { type: String },
    fechaNacimiento: { type: Date },
    municipio: { type: String },
    descripcionPadecimiento: { type: String },
    celular: { type: String },
    correo: { type: String, required: true },
    producto: { type: String, required: true },
    folio: { type: String, required: true }, // Campo para almacenar el folio
  })
);

// Iniciar el servidor
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
