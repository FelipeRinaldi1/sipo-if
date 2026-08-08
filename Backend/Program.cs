using Template.Data;
using Template.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddArchitectures();
builder.AddServices();

var app = builder.Build();

app.UseExtensions();
app.UseMapRoutes();
app.MigrateDb();

app.Run();