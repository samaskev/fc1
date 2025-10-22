using Microsoft.EntityFrameworkCore;
using LegacyData.Data;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<LegacyContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("LegacyDb")));

// CORS: permite tu front en 9002 (y 3000 si lo usabas antes)
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("AllowLocalDev", p =>
        p.WithOrigins(
            "http://localhost:9002",
            "https://localhost:9002",
            "http://localhost:3000",
            "https://localhost:3000"
        )
        .AllowAnyHeader()
        .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// ⚠️ Importante: NO fuerces redirección a HTTPS en Development
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// CORS antes de MapControllers
app.UseCors("AllowLocalDev");

app.MapControllers();
app.Run();
