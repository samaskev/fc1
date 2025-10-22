namespace LegacyData.Models;

public class Pago
{
    public long COD_PAGO_NB { get; set; }     // numeric(10,0)
    public int COD_PERSONA_NB { get; set; }  // FK int

    public int? PAGO_MENSUALIDAD_ID { get; set; }
    public int? FID_FC { get; set; }
    public decimal MONTO_NB { get; set; }     // numeric(10,2)

    // numeric(10,0)
    public long? NRO_FACTURA_NB { get; set; }
    public long? NRO_RECIBO_NB { get; set; }
    public long? NRO_AUTORIZA_NB { get; set; }
    public long? COD_TARIFA_NB { get; set; }

    // numeric(4,0)/(2,0)
    public int? GESTION_NB { get; set; }
    public int? MES_NB { get; set; }

    public DateTime? FECHA_PLANIFICADA_DH { get; set; }
    public DateTime? PM_FECHA_A_CANCELAR { get; set; }
    public DateTime? PM_FECHA_QUE_CANCELO { get; set; }

    public string? ESTADO_VC { get; set; }
    public string? USUARIO_VC { get; set; }

    public string? NIT_CI { get; set; }               // <--- FALTABA
    public string? NOMBRE_FACTURA_VC { get; set; }    // <--- FALTABA

    public string? PM_CONGELADO { get; set; }
    public string? PM_CON_CARTA { get; set; }
    public string? PM_OBSERVACIONES { get; set; }
    public DateTime? FECHA_REGISTRO_DH { get; set; }
    public DateTime? FECHA_ULTIMA_DH { get; set; }
    public bool? ESTADO_OBS { get; set; }
    public string? Origen { get; set; }

    public Persona Persona { get; set; } = null!;
}
