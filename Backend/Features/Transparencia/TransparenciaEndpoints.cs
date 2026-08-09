using Microsoft.EntityFrameworkCore;
using Template.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Template.Features.Transparencia;

public static class TransparenciaEndpoints
{
    public static void MapTransparenciaEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/sincronizacao");

        group.MapGet("/status", async Task<Ok<StatusSincronizacaoDto>> (TemplateContext dbContext) =>
        {
            var ultimoSucesso = await dbContext.SincronizacaoLogs
                .Where(l => l.Sucesso)
                .OrderByDescending(l => l.DataHoraUtc)
                .FirstOrDefaultAsync();

            var ultimaFalha = await dbContext.SincronizacaoLogs
                .Where(l => !l.Sucesso)
                .OrderByDescending(l => l.DataHoraUtc)
                .FirstOrDefaultAsync();

            var status = new StatusSincronizacaoDto(
                UltimaSincronizacaoComSucessoUtc: ultimoSucesso?.DataHoraUtc,
                TotalRegistrosUltimaSincronizacao: ultimoSucesso?.TotalRegistrosImportados,
                UltimaFalhaUtc: ultimaFalha?.DataHoraUtc,
                MensagemUltimoErro: ultimaFalha?.MensagemErro
            );

            return TypedResults.Ok(status);
        });
    }
}
