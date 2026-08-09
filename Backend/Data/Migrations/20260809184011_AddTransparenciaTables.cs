using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Template.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTransparenciaTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DespesasOrcamentarias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NumeroEmpenho = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Ano = table.Column<int>(type: "integer", nullable: false),
                    Mes = table.Column<int>(type: "integer", nullable: false),
                    NaturezaDespesa = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Categoria = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ValorEmpenhado = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ValorLiquidado = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    ValorPago = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Favorecido = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UltimaAtualizacaoUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DespesasOrcamentarias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SincronizacaoLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DataHoraUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Sucesso = table.Column<bool>(type: "boolean", nullable: false),
                    TotalRegistrosImportados = table.Column<int>(type: "integer", nullable: false),
                    MensagemErro = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SincronizacaoLogs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DespesasOrcamentarias_NumeroEmpenho",
                table: "DespesasOrcamentarias",
                column: "NumeroEmpenho",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DespesasOrcamentarias");

            migrationBuilder.DropTable(
                name: "SincronizacaoLogs");
        }
    }
}
