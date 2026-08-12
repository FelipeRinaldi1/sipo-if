using Api.Data;
using Api.Extensions;

// Carrega o arquivo .env localizado na raiz do monorepo (se existir)
DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

builder.AddArchitectures();
builder.AddServices();

var app = builder.Build();

app.UseExtensions();
app.UseMapRoutes();
app.MigrateDb();

app.Run();