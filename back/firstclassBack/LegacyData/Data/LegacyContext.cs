using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;   // <--- IMPORTANTE
using LegacyData.Models;

namespace LegacyData.Data
{
    public class LegacyContext : DbContext
    {
        public LegacyContext(DbContextOptions<LegacyContext> options) : base(options) { }

        public DbSet<Persona> Personas => Set<Persona>();
        public DbSet<Pago> Pagos => Set<Pago>();

        protected override void OnModelCreating(ModelBuilder model)
        {
            // Converters reutilizables
            var intDec = new ValueConverter<int, decimal>(v => (decimal)v, v => (int)v);
            var intDecN = new ValueConverter<int?, decimal?>(v => v, v => v.HasValue ? (int?)(int)v.Value : null);
            var longDec = new ValueConverter<long, decimal>(v => (decimal)v, v => (long)v);
            var longDecN = new ValueConverter<long?, decimal?>(v => v, v => v.HasValue ? (long?)(long)v.Value : null);

            // ================ PERSONAS_UNIFICADO =================
            var p = model.Entity<Persona>();
            p.ToTable("PERSONAS_UNIFICADO", "dbo");
            p.HasKey(x => x.COD_PERSONA_NB);
            p.Property(x => x.COD_PERSONA_NB).HasColumnName("COD_PERSONA_NB"); // INT en BD
            p.Property(x => x.NOMBRE_VC).HasColumnName("NOMBRE_VC").HasMaxLength(80);
            p.Property(x => x.APELLIDO_PATERNO_VC).HasColumnName("APELLIDO_PATERNO_VC").HasMaxLength(80);
            p.Property(x => x.APELLIDO_MATERNO_VC).HasColumnName("APELLIDO_MATERNO_VC").HasMaxLength(80);
            p.Property(x => x.NRO_DOCUMENTO_NB).HasColumnName("NRO_DOCUMENTO_NB").HasMaxLength(40);
            p.Property(x => x.EXPEDIDO_NB).HasColumnName("EXPEDIDO_NB").HasMaxLength(40);
            p.Property(x => x.FECHA_NACIMIENTO_DH).HasColumnName("FECHA_NACIMIENTO_DH");
            p.Property(x => x.DIRECCION_VC).HasColumnName("DIRECCION_VC").HasMaxLength(100);
            p.Property(x => x.EMAIL_VC).HasColumnName("EMAIL_VC").HasMaxLength(80);
            p.Property(x => x.TELEFONO_NB).HasColumnName("TELEFONO_NB");
            p.Property(x => x.CELULAR_NB).HasColumnName("CELULAR_NB").HasMaxLength(40);
            p.Property(x => x.TIPO_VC).HasColumnName("TIPO_VC").HasMaxLength(40);
            p.Property(x => x.PERSONAS_NIT_CI_VC).HasColumnName("PERSONAS_NIT_CI_VC").HasMaxLength(15);
            p.Property(x => x.PERSONAS_NOMBRE_FACTURA_VC).HasColumnName("PERSONAS_NOMBRE_FACTURA_VC").HasMaxLength(50);
            p.Property(x => x.ESTADO_OBS).HasColumnName("ESTADO_OBS");
            p.Property(x => x.Origen).HasColumnName("Origen").HasMaxLength(20);

            // ================ PAGOS_UNIFICADO ====================
            var pg = model.Entity<Pago>();
            pg.ToTable("PAGOS_UNIFICADO", "dbo");
            pg.HasKey(x => x.COD_PAGO_NB);

            // PK numeric(10,0) <-> long
            pg.Property(x => x.COD_PAGO_NB)
              .HasColumnName("COD_PAGO_NB")
              .HasPrecision(10, 0)
              .HasConversion(longDec);

            pg.Property(x => x.PAGO_MENSUALIDAD_ID).HasColumnName("PAGO_MENSUALIDAD_ID");
            pg.Property(x => x.FID_FC).HasColumnName("FID_FC");

            // FK numeric(10,0) <-> int
            pg.Property(x => x.COD_PERSONA_NB)
              .HasColumnName("COD_PERSONA_NB")
              .HasPrecision(10, 0)
              .HasConversion(intDec);

            pg.Property(x => x.MONTO_NB).HasColumnName("MONTO_NB").HasColumnType("numeric(10,2)");

            // numeric(10,0) (nullable) -> long?
            pg.Property(x => x.NRO_FACTURA_NB)
              .HasColumnName("NRO_FACTURA_NB")
              .HasPrecision(10, 0)
              .HasConversion(longDecN);

            pg.Property(x => x.NRO_RECIBO_NB)
              .HasColumnName("NRO_RECIBO_NB")
              .HasPrecision(10, 0)
              .HasConversion(longDecN);

            pg.Property(x => x.NRO_AUTORIZA_NB)
              .HasColumnName("NRO_AUTORIZA_NB")
              .HasPrecision(10, 0)
              .HasConversion(longDecN);

            pg.Property(x => x.COD_TARIFA_NB)
              .HasColumnName("COD_TARIFA_NB")
              .HasPrecision(10, 0)
              .HasConversion(longDecN);

            // numeric(4,0)/(2,0) (nullable) -> int?
            pg.Property(x => x.GESTION_NB)
              .HasColumnName("GESTION_NB")
              .HasPrecision(4, 0)
              .HasConversion(intDecN);

            pg.Property(x => x.MES_NB)
              .HasColumnName("MES_NB")
              .HasPrecision(2, 0)
              .HasConversion(intDecN);

            // strings/fechas
            pg.Property(x => x.NIT_CI).HasColumnName("NIT_CI").HasMaxLength(15);
            pg.Property(x => x.NOMBRE_FACTURA_VC).HasColumnName("NOMBRE_FACTURA_VC").HasMaxLength(15);
            pg.Property(x => x.FECHA_PLANIFICADA_DH).HasColumnName("FECHA_PLANIFICADA_DH");
            pg.Property(x => x.PM_FECHA_A_CANCELAR).HasColumnName("PM_FECHA_A_CANCELAR");
            pg.Property(x => x.PM_FECHA_QUE_CANCELO).HasColumnName("PM_FECHA_QUE_CANCELO");
            pg.Property(x => x.ESTADO_VC).HasColumnName("ESTADO_VC").HasMaxLength(40);
            pg.Property(x => x.USUARIO_VC).HasColumnName("USUARIO_VC").HasMaxLength(40);
            pg.Property(x => x.PM_CONGELADO).HasColumnName("PM_CONGELADO");
            pg.Property(x => x.PM_CON_CARTA).HasColumnName("PM_CON_CARTA");
            pg.Property(x => x.PM_OBSERVACIONES).HasColumnName("PM_OBSERVACIONES").HasMaxLength(80);
            pg.Property(x => x.FECHA_REGISTRO_DH).HasColumnName("FECHA_REGISTRO_DH");
            pg.Property(x => x.FECHA_ULTIMA_DH).HasColumnName("FECHA_ULTIMA_DH");
            pg.Property(x => x.ESTADO_OBS).HasColumnName("ESTADO_OBS");
            pg.Property(x => x.Origen).HasColumnName("Origen").HasMaxLength(20);

            // Relación: FK de Pago -> PK de Persona
            pg.HasOne(x => x.Persona)
              .WithMany(pers => pers.Pagos)
              .HasForeignKey(x => x.COD_PERSONA_NB);
        }
    }
}
