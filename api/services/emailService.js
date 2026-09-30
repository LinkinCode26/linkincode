import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


/**
 * Mail interno al equipo con todos los datos del lead
 */
export async function sendLeadNotificationToTeam(lead) {
  console.log("➡️ [Nodemailer] Intentando enviar mail interno al equipo...");
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
      <h2 style="color: #0d6efd; border-bottom: 2px solid #eee; padding-bottom: 8px;">
        📥 Nuevo Lead Registrado
      </h2>
      <p>Se ha recibido una nueva consulta a través del sitio web:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold; width: 35%;">Nombre:</td>
          <td style="padding: 10px; border: 1px solid #dee2e6;">${lead.nombre}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border: 1px solid #dee2e6;"><a href="mailto:${lead.email}">${lead.email}</a></td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Tipo de Proyecto:</td>
          <td style="padding: 10px; border: 1px solid #dee2e6;">${lead.tipoProyecto}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Mensaje:</td>
          <td style="padding: 10px; border: 1px solid #dee2e6;">${lead.mensaje}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Origen:</td>
          <td style="padding: 10px; border: 1px solid #dee2e6;">${lead.origen || "Web / No especificado"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Fecha:</td>
          <td style="padding: 10px; border: 1px solid #dee2e6;">${new Date().toLocaleString("es-AR")}</td>
        </tr>
      </table>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.TEAM_EMAIL,
      subject: `[Nuevo Lead] Consulta de ${lead.nombre} (${lead.tipoProyecto})`,
      html: htmlContent,
    });
    console.log("✅ [Nodemailer] Mail interno enviado al equipo con éxito! ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ [Nodemailer] Error enviando mail al equipo:", error.message);
    throw error;
  }
}

/**
 * Auto-respuesta al cliente con template propio ("menos de 24hs")
 */
export async function sendLeadAutoReply(lead) {
  console.log(`➡️ [Nodemailer] Intentando enviar auto-respuesta al cliente (${lead.email})...`);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 8px; color: #2d3748;">
      <h2 style="color: #1a202c; margin-top: 0;">¡Hola ${lead.nombre}!</h2>
      <p style="font-size: 15px;">Muchas gracias por comunicarte con nosotros por tu proyecto de <strong>${lead.tipoProyecto}</strong>.</p>
      <p style="font-size: 15px;">Hemos recibido tu consulta correctamente y nuestro equipo ya la está revisando.</p>
      
      <div style="background-color: #ebf8ff; border-left: 4px solid #3182ce; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: bold; color: #2b6cb0;">
          🕒 Te responderemos en menos de 24hs.
        </p>
      </div>

      <p style="font-size: 14px; color: #718096;">
        Si querés aportar algún dato adicional, podés responder directamente a este correo.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
      
      <p style="font-size: 14px; margin-bottom: 0;">
        Saludos cordiales,<br />
        <strong>El equipo</strong>
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: lead.email,
      subject: "Recibimos tu consulta - Te responderemos pronto",
      html: htmlContent,
    });
    console.log("✅ [Nodemailer] Auto-respuesta enviada al cliente con éxito! ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ [Nodemailer] Error enviando auto-respuesta al cliente:", error.message);
    throw error;
  }
}