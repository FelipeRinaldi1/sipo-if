namespace Api.Features.Users;

using Microsoft.EntityFrameworkCore;
using Api.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Api.Extensions;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

public static class UserEndpoints
{
    const string GetUserRouteName = "GetUser";

    public static void MapUsersEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/users");

        group.MapPost("/register", async (UserManager<User> userManager, RegisterUserDto registerDto) =>
        {
            var user = registerDto.ToEntity();

            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                return Results.BadRequest(result.Errors);
            }

            return Results.Created($"/users/{user.Id}", user.ToDto());
        })
        .WithParameterValidation<RegisterUserDto>();

        group.MapGet("/me", async (ClaimsPrincipal claimsUser, UserManager<User> userManager) =>
        {
            var userId = claimsUser.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Results.Unauthorized();
            }

            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Results.NotFound("User not found.");
            }

            return Results.Ok(user.ToDto());
        })
        .RequireAuthorization();

        group.MapPut("/me", async (ClaimsPrincipal claimsUser, UserManager<User> userManager, UpdateUserDto updateDto) =>
        {
            var userId = claimsUser.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Results.Unauthorized();
            }

            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return Results.NotFound("User not found");
            }

            user.Name = updateDto.Name;
            user.Email = updateDto.Email;
            user.UserName = updateDto.Email;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return Results.BadRequest(result.Errors);
            }

            return Results.Ok(user.ToDto());
        })
        .RequireAuthorization()
        .WithParameterValidation<UpdateUserDto>();

        group.MapGet("/", async (UserManager<User> userManager) =>
        {
            var users = await userManager.Users.ToListAsync();
            var dtos = users.Select(user => user.ToDto());
            return Results.Ok(dtos);
        })
        .RequireAuthorization(policy => policy.RequireRole(UserRole.Admin.ToString()));

        group.MapPost("/{id}/deactivate", async (Guid id, UserManager<User> userManager) =>
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return Results.NotFound("User not found.");
            }

            user.IsActive = false;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return Results.BadRequest(result.Errors);
            }

            return Results.NoContent();
        })
        .RequireAuthorization(policy => policy.RequireRole(UserRole.Admin.ToString()));
    }


}