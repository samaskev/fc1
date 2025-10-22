namespace LegacyData.Models;

public class Persona
{
    public int COD_PERSONA_NB { get; set; }                 // PK
    public string NOMBRE_VC { get; set; } = "";
    public string APELLIDO_PATERNO_VC { get; set; } = "";
    public string APELLIDO_MATERNO_VC { get; set; } = "";
    public string NRO_DOCUMENTO_NB { get; set; } = "";      // CI principal (texto)
    public string? EXPEDIDO_NB { get; set; }
    public DateTime? FECHA_NACIMIENTO_DH { get; set; }
    public string? DIRECCION_VC { get; set; }
    public string? EMAIL_VC { get; set; }
    public string? TELEFONO_NB { get; set; }                // nvarchar(MAX)
    public string? CELULAR_NB { get; set; }
    public string? TIPO_VC { get; set; }
    public string? PERSONAS_NIT_CI_VC { get; set; }         // CI alternativo (char(15))
    public string? PERSONAS_NOMBRE_FACTURA_VC { get; set; } // char(50)
    public bool? ESTADO_OBS { get; set; }                   // Flag duplicado (false = válido)
    public string? Origen { get; set; }                     // Fuente del registro (Web/Escritorio)
    // ... (puedes agregar los demás campos que necesites exponer)

    // Navegación (1 persona -> muchos pagos)
    public ICollection<Pago> Pagos { get; set; } = new List<Pago>();

    // Conveniencia
    public string NombreCompleto =>
        $"{NOMBRE_VC} {APELLIDO_PATERNO_VC} {APELLIDO_MATERNO_VC}".Trim();
}
