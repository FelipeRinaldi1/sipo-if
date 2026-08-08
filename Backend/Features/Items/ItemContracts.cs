using System.ComponentModel.DataAnnotations;

namespace Template.Features.Items;

public record ItemDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    DateTime CreatedAt
);

public record ItemDetailsDto(
    Guid Id,
    string Name,
    string Description,
    decimal Price,
    DateTime CreatedAt
);

public record CreateItemDto(
    [property: Required][property: StringLength(100)] string Name,
    [property: Required][property: StringLength(500)] string Description,
    [property: Required][property: Range(0.01, 100000.00)] decimal Price
);

public record UpdateItemDto(
    [property: Required][property: StringLength(100)] string Name,
    [property: Required][property: StringLength(500)] string Description,
    [property: Required][property: Range(0.01, 100000.00)] decimal Price
);
