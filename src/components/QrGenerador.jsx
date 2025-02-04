import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

const QrGenerador = ({ folio }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  // Generar el QR a partir del folio
  useEffect(() => {
    if (folio) {
      const generateQRCode = async () => {
        try {
          // Ajustar escala para mejorar calidad
          const qrCode = await QRCode.toDataURL(folio, { scale: 10 });
          setQrCodeDataUrl(qrCode);
        } catch (err) {
          console.error("Error generando el código QR", err);
        }
      };

      generateQRCode();
    }
  }, [folio]); // Se ejecuta cuando el folio cambia

  // Descargar el QR como ticket PDF
  const downloadPdf = () => {
    if (!qrCodeDataUrl) {
      alert("Primero genera un código QR.");
      return;
    }

    const pdf = new jsPDF();

    // Estilos generales
    pdf.setFillColor(240, 240, 240); // Fondo claro
    pdf.rect(10, 10, 190, 277, "F"); // Rectángulo con bordes y fondo
    pdf.setTextColor(40, 40, 40); // Texto en color oscuro
    pdf.setFont("helvetica", "normal");

    // Título
    pdf.setFontSize(18);
    pdf.text("Vale de Entrega", pdf.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    });

    // Texto de introducción
    pdf.setFontSize(12);
    pdf.text(
      "Este es tu código QR. Deberás presentarlo el día de la entrega para recibir tu medicamento junto con una identificación oficial. Este ticket puedes presentarlo digital o impreso.",
      20,
      50,
      { maxWidth: 170, align: "justify" }
    );

    pdf.text(
      "En las próximas horas nos pondremos en contacto para confirmar el día, fecha y ubicación de la entrega. Gracias por registrarte.",
      20,
      70,
      { maxWidth: 170, align: "justify" }
    );

    // Código QR
    pdf.addImage(qrCodeDataUrl, "PNG", 65, 90, 80, 80);

    // Información adicional
    pdf.setFontSize(10);
    pdf.text(
      "Por favor, conserva este ticket. Es importante para validar tu registro.",
      20,
      190,
      { maxWidth: 170, align: "justify" }
    );

    // Pie de página
    pdf.setFontSize(10);
    pdf.text(
      "Sistema de entrega de medicamentos | © 2025",
      pdf.internal.pageSize.getWidth() / 2,
      280,
      { align: "center" }
    );

    // Descargar el PDF
    pdf.save("vale-entrega.pdf");
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4 text-center">Este es tu codigo QR que debes presentar para la entrega de tu medicamento.</h1>

      {folio && (
        <div className="mt-4 justify-center flex">
          <img src={qrCodeDataUrl} alt="Código QR generado" />
        </div>
      )}
      <div className="text-center">
        <button
          className="bg-green-500 text-white p-2 rounded mt-4"
          onClick={downloadPdf}
        >
          Descargar como PDF aqui
        </button>
      </div>
    </div>
  );
};

export default QrGenerador;
