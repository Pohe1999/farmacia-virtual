import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import QrGenerador from './QrGenerador'; // Importamos el componente QrGenerador
import { municipios } from './municipios'; // Ajusta la ruta según tu estructura de carpetas


// Componente de Formulario de Registro
const RegistrationForm = ({ onClose, selectedProduct, onFolioGenerated }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [folio, setFolio] = useState(""); // Estado para almacenar el folio generado

  const onSubmit = async (data) => {
    try {
      const response = await fetch("https://farmacia-virtual.onrender.com/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          producto: selectedProduct.name, // Incluir el nombre del producto
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el registro");
      }

      const result = await response.json();
      alert(result.message);

      // Mostrar el folio generado
      setFolio(result.folio); // Asignamos el folio recibido del backend
      reset();

      {/*// Actualizar stock
      const updateStockResponse = await fetch(
        `https://farmacia-virtual.onrender.com/api/productos/${selectedProduct._id}/decrementar`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!updateStockResponse.ok) {
        throw new Error("Error al actualizar el stock");
      }

      const updateResult = await updateStockResponse.json();
    alert(updateResult.message);  */}

      // Llamamos a la función onFolioGenerated con el folio generado
      onFolioGenerated(result.folio);

      onClose(); // Cerrar formulario
    } catch (error) {
      alert("Hubo un problema al enviar el registro: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-">
      <div className="bg-white p-4 sm:max-w-lg sm:w-full m-2 border rounded-lg shadow-xl overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Formulario de registro de: <br />
          <span className="text-2xl text-[#821e30] border-b-2 border-[#821e30]">{selectedProduct.name}</span>
        </h2>
        <p className="text-center text-md mb-6 bg-cover border border-red-900 shadow-xl rounded-md p-3 text-justify" style={{ backgroundImage: 'url("/FONDO-MORENA-2.jpg")' }}>
          Verifica tus datos antes de enviar. Es importante que completes todos los campos correctamente para que podamos contactarte y agendar la fecha de entrega.
          Además, recuerda que el beneficiario deberá presentar una <span className="font-semibold">identificación oficial </span> 
          al momento de recibir tu medicamento. ¡Gracias por tu cooperación!
        </p>

        {folio && (
          <div className="text-center mb-4 text-lg font-bold text-green-500">
            ¡Registro exitoso! Tu folio es: {folio}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-xl mb-2">Nombre:</label>
            <input
              {...register("nombre", { required: "Este campo es obligatorio" })}
              className="w-full max-w-md border-2 border-slate-400 rounded p-3"
              placeholder="Ingresa tu nombre"
            />
            {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre.message}</p>}
          </div>

          {/* Apellido Paterno */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-xl mb-2">Apellido Paterno:</label>
            <input
              {...register("apellidoPaterno",  { required: "Este campo es obligatorio" })}
              className="w-full max-w-md border-2 border-slate-400 rounded p-3"
              placeholder="Ingresa tu apellido paterno"
            />
            {errors.apellidoPaterno && <p className="text-red-600 text-sm">{errors.apellidoPaterno.message}</p>}
          </div>

          {/* Apellido Materno */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-xl mb-2">Apellido Materno:</label>
            <input
              {...register("apellidoMaterno", { required: "Este campo es obligatorio" })}
              className="w-full max-w-md border-2 border-slate-400 rounded p-3"
              placeholder="Ingresa tu apellido materno"
            />
            {errors.apellidoMaterno && <p className="text-red-600 text-sm">{errors.apellidoMaterno.message}</p>}
          </div>

          {/* Fecha de Nacimiento */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-xl">Fecha de Nacimiento:</label>
            <p className="text-slate-600">El beneficiario debe ser mayor de edad</p>
            <input
              type="date"
              {...register("fechaNacimiento",  { required: "Este campo es obligatorio" })}
              className="w-full max-w-md border-2 border-slate-400 rounded p-3"
            />
            {errors.fechaNacimiento && <p className="text-red-600 text-sm">{errors.fechaNacimiento.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-xl mb-2">Municipio donde habita:</label>
            <select
              {...register("municipio",  { required: "Este campo es obligatorio" })} // Asegúrate de que el hook de react-hook-form esté configurado correctamente
              className="w-full max-w-md border rounded p-3"
            >
              <option value="">Selecciona un municipio</option>
              {municipios.map((municipio) => (
                <option key={municipio.id} value={municipio.id}>
                  {municipio.nombre}
                </option>
              ))}
            </select>
          </div>


          {/* Descripción del padecimiento */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-xl mb-2">Descripción del Padecimiento:</label>
            <textarea
              {...register("descripcionPadecimiento",  { required: "Este campo es obligatorio" })}
              className="w-full max-w-md border-2 border-slate-400 rounded p-5"
              placeholder="Describe tu padecimiento"
            />
            {errors.descripcionPadecimiento && <p className="text-red-600 text-sm">{errors.descripcionPadecimiento.message}</p>}
          </div>

          {/* Celular */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-xl mb-2">Celular:</label>
            <input
              type="tel"
              {...register("celular", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Debe ser un número de 10 dígitos",
                },required: "Este campo es obligatorio" 
              })}
              className="w-full max-w-md border-2 border-slate-400 rounded p-3"
              placeholder="Ingresa tu celular"
            />
            {errors.celular && <p className="text-red-600 text-sm">{errors.celular.message}</p>}
          </div>

          {/* Correo Electrónico */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold text-xl mb-2">Correo Electrónico:</label>
            <input
              type="email"
              className="w-full max-w-md border-2 border-slate-400 rounded p-3"
              placeholder="ejemplo@correo.com"
              {...register("correo", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Debe ser un correo válido"
                },required: "Este campo es obligatorio" 
              })}
            />
            {errors.correo && <p className="text-red-600 text-sm mt-1">{errors.correo.message}</p>}
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-[#821e30] text-white px-6 py-3 rounded-lg hover:bg-[#a72b35]"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#821e30] text-white px-6 py-3 rounded-lg hover:bg-[#a72b35]"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de la Página Principal
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [folio, setFolio] = useState(""); // Para almacenar el folio generado
  const [showQrModal, setShowQrModal] = useState(false); // Estado para controlar la visibilidad del modal de QR

  // Cargar productos desde la API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("https://farmacia-virtual.onrender.com/api/productos");
        if (!response.ok) {
          throw new Error("No se pudieron cargar los productos.");
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };
    loadProducts();
  }, []);

  // Filtrar productos por nombre o descripción
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  // Función que se llama cuando el folio es generado
  const handleFolioGenerated = (generatedFolio) => {
    setFolio(generatedFolio); // Guardamos el folio generado
    setShowQrModal(true); // Mostramos el modal con el QR
  };

  // Función para cerrar el modal del QR
  const closeQrModal = () => {
    setShowQrModal(false);
  };

  return (
    <div>
      {/* Navbar */}
      <div className="bg-[#F8F8F8] text-[#4A4A4A] py-4 px-6 flex justify-between items-center fixed w-full top-0 z-10 shadow-lg">
        <div className="text-2xl font-bold">Por tu salud <span className="text-[#821e30]">MG</span></div>
        <div className="space-x-6">
          <button className="font-semibold text-lg">Inicio</button>
        </div>
      </div>

      {/* Banner Principal */}
      <div
        className="relative bg-cover bg-center sm:pt-[600px] pt-[300px] sm:bg-[length:90%_120%] bg-no-repeat md:bg-[length:90%_170%]"
        style={{ backgroundImage: 'url("/senadora-logo.jpg")' }}
      >
        <div className="absolute inset-0 bg-slate-900 bg-opacity-10"></div>
      </div>




      {/* Buscador */}
      <div className="p-3 mt-1">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar por nombre o descripción..."
          className="w-full border border-slate-900 rounded p-3"
        />
      </div>

      {/* Productos */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg shadow-xl overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 bg-[#f7f7f7]">
              <h2 className="text-xl font-semibold text-[#821e30]">{product.name}</h2>
              <p className="text-gray-600 mb-3">{product.description}</p>
              <p className="text-gray-500 mb-4">Disponibles: {product.stock}</p>
              <div className="border-t-2 border-[#4CAF50] mb-4"></div>
              <button
                className="bg-[#821e30] text-white px-6 py-3 rounded-lg w-full hover:bg-[#a72b35]"
                onClick={() => {
                  setSelectedProduct(product);
                  setShowForm(true);
                }}
              >
                Consíguelo aquí
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario de Registro */}
      {showForm && (
        <RegistrationForm
          onClose={() => setShowForm(false)}
          selectedProduct={selectedProduct}
          onFolioGenerated={handleFolioGenerated}
        />
      )}

      {/* Modal con QR */}
      {showQrModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="m-9 bg-cover bg-center bg-no-repeat rounded-md" style={{ backgroundImage: 'url("/FONDO-MORENA-2.jpg")' }}>
            <h2 className="text-2xl font-bold mb-4 text-center bg-red-800 text-slate-100 p-2 rounded-sm">
              ¡Registro existoso!
            </h2>
            <QrGenerador folio={folio} />
            <div className="flex justify-center mt-4">
              <button
                className="bg-[#821e30] text-white px-6 py-3 rounded-lg hover:bg-[#a72b35]"
                onClick={closeQrModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;