using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Template.Extensions;

public static class ValidationExtensions
{
    public static RouteHandlerBuilder WithParameterValidation<T>(this RouteHandlerBuilder builder)
    {
        return builder.AddEndpointFilter(async (context, next) =>
        {
            var argument = context.Arguments.OfType<T>().FirstOrDefault();
            if (argument is null)
            {
                return Results.BadRequest("Dados de entrada inválidos.");
            }

            var validationContext = new ValidationContext(argument);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(argument, validationContext, validationResults, true);

            if (!isValid)
            {
                var errors = validationResults
                    .GroupBy(r => r.MemberNames.FirstOrDefault() ?? "Erro")
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(r => r.ErrorMessage ?? "Erro de validação.").ToArray()
                    );

                return Results.ValidationProblem(errors);
            }

            return await next(context);
        });
    }
}
