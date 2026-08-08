namespace Template.Features.Items;

using Microsoft.EntityFrameworkCore;
using Template.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Template.Extensions;

public static class ItemEndpoints
{
    const string GetItemRouteName = "GetItem";

    public static void MapItemsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/items");

        // Get all
        group.MapGet("/", async (TemplateContext dbContext) =>
        {
            var items = await dbContext.Items
                .Select(item => new ItemDetailsDto(
                    item.Id,
                    item.Name,
                    item.Description,
                    item.Price,
                    item.CreatedAt
                ))
                .AsNoTracking()
                .ToListAsync();

            return TypedResults.Ok(items);
        }).RequireAuthorization();

        // Get by ID
        group.MapGet("/{id}", async Task<Results<Ok<ItemDetailsDto>, NotFound>> (Guid id, TemplateContext dbContext) =>
        {
            var item = await dbContext.Items.FindAsync(id);

            if (item is null)
            {
                return TypedResults.NotFound();
            }

            return TypedResults.Ok(new ItemDetailsDto(
                item.Id,
                item.Name,
                item.Description,
                item.Price,
                item.CreatedAt
            ));
        })
        .WithName(GetItemRouteName);

        // Post
        group.MapPost("/", async (CreateItemDto itemData, TemplateContext dbContext) =>
        {
            Item item = new()
            {
                Name = itemData.Name,
                Description = itemData.Description,
                Price = itemData.Price,
                CreatedAt = DateTime.UtcNow
            };

            dbContext.Items.Add(item);
            await dbContext.SaveChangesAsync();

            ItemDetailsDto itemDto = new(
                item.Id,
                item.Name,
                item.Description,
                item.Price,
                item.CreatedAt
            );

            return TypedResults.CreatedAtRoute(itemDto, GetItemRouteName, new { id = item.Id });
        })
        .WithParameterValidation<CreateItemDto>();

        // Put
        group.MapPut("/{id}", async Task<Results<NoContent, NotFound>> (Guid id, UpdateItemDto newData, TemplateContext dbContext) =>
        {
            var existingItem = await dbContext.Items.FindAsync(id);

            if (existingItem is null)
            {
                return TypedResults.NotFound();
            }

            existingItem.Name = newData.Name;
            existingItem.Description = newData.Description;
            existingItem.Price = newData.Price;

            await dbContext.SaveChangesAsync();

            return TypedResults.NoContent();
        })
        .WithParameterValidation<UpdateItemDto>();

        // Delete
        group.MapDelete("/{id}", async (Guid id, TemplateContext dbContext) =>
        {
            await dbContext.Items.Where(item => item.Id == id).ExecuteDeleteAsync();
            return TypedResults.NoContent();
        });
    }
}
