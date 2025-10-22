using System.Net;

namespace BackApi.Auth  // 👈 Ajusta el namespace al nombre de tu proyecto (ver tu Program.cs)
{
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string? _expected;

        // Constructor: se ejecuta al inicio y obtiene la clave configurada en appsettings.json
        public ApiKeyMiddleware(RequestDelegate next, IConfiguration config)
        {
            _next = next;
            _expected = config["Auth:BackendApiKey"];
        }

        // Método principal que intercepta cada request
        public async Task Invoke(HttpContext ctx)
        {
            // Si no hay clave configurada en appsettings.json, dejamos pasar libremente
            if (string.IsNullOrWhiteSpace(_expected))
            {
                await _next(ctx);
                return;
            }

            // Leer el header Authorization
            var auth = ctx.Request.Headers["Authorization"].ToString();
            // El formato debe ser "Bearer <token>"
            var token = auth?.StartsWith("Bearer ") == true ? auth[7..] : null;

            // Validar el token recibido contra el que tenemos en appsettings.json
            if (token != _expected)
            {
                ctx.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                await ctx.Response.WriteAsJsonAsync(new { error = "No autorizado" });
                return;
            }

            // Si el token es correcto, continúa al siguiente middleware o controlador
            await _next(ctx);
        }
    }
}
