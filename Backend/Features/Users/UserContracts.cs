using System.ComponentModel.DataAnnotations;

namespace Template.Features.Users;

public record UserDto(
    Guid Id,
    string Name,
    string Email,
    UserRole Role,
    bool IsActive,
    DateTime CreatedAt
);

public record RegisterUserDto(
    [property: Required][property: StringLength(144)] string Name,
    [property: Required][property: EmailAddress][property: StringLength(255)] string Email,
    [property: Required][property: MinLength(6)][property: StringLength(100)] string Password,
    [property: Required] UserRole Role
);

public record UpdateUserDto(
    [property: Required][property: StringLength(144)] string Name,
    [property: Required][property: EmailAddress][property: StringLength(255)] string Email
);

public record LoginDto(
    [property: Required][property: EmailAddress] string Email,
    [property: Required] string Password
);

public record LoginResponseDto(
    UserDto User,
    string Token
);