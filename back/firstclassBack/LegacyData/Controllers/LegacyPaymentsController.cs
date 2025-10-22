using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LegacyData.Data;

namespace LegacyData.Controllers;

[ApiController]
[Route("api/legacy")]
public class LegacyPaymentsController : ControllerBase
{
    private readonly LegacyContext _db;
    public LegacyPaymentsController(LegacyContext db) => _db = db;

    // GET /api/legacy/personas/{codPersona}/pagos
    [HttpGet("personas/{codPersona:int}/pagos")]
    public async Task<IActionResult> GetPagosByPersona(
        [FromRoute] int codPersona,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? origen = null,
        [FromQuery] int? anioCancelacion = null)
    {
        page = Math.Max(1, page);
        pageSize = pageSize is < 1 or > 200 ? 50 : pageSize;

        // Excluir pagos marcados en ESTADO_OBS (observados/eliminados lÃ³gicamente)
        var q = _db.Pagos.AsNoTracking()
            .Where(pg => pg.COD_PERSONA_NB == codPersona && pg.ESTADO_OBS == false);

        if (!string.IsNullOrEmpty(origen))
        {
            q = q.Where(pg => pg.Origen == origen);
        }

        if (anioCancelacion.HasValue)
        {
            q = q.Where(pg => pg.PM_FECHA_QUE_CANCELO.HasValue &&
                              pg.PM_FECHA_QUE_CANCELO.Value.Year == anioCancelacion.Value);
        }

        var total = await q.CountAsync();

        var items = await q
            .OrderByDescending(pg => pg.PM_FECHA_QUE_CANCELO ?? pg.FECHA_REGISTRO_DH ?? pg.FECHA_PLANIFICADA_DH)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(pg => new
            {
                codPago = pg.COD_PAGO_NB,
                monto = pg.MONTO_NB,
                estado = pg.ESTADO_VC,
                gestion = pg.GESTION_NB,
                mes = pg.MES_NB,
                nroFactura = pg.NRO_FACTURA_NB,
                nroRecibo = pg.NRO_RECIBO_NB,
                fechaPlanificada = pg.FECHA_PLANIFICADA_DH,
                fechaACancelar = pg.PM_FECHA_A_CANCELAR,
                fechaQueCancelo = pg.PM_FECHA_QUE_CANCELO,
                anioCancelacion = pg.PM_FECHA_QUE_CANCELO.HasValue ? pg.PM_FECHA_QUE_CANCELO.Value.Year : (int?)null,
                observaciones = pg.PM_OBSERVACIONES,
                origen = pg.Origen
            })
            .ToListAsync();

        return Ok(new { total, page, pageSize, items });
    }
}
