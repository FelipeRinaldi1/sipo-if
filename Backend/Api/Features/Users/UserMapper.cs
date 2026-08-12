namespace Api.Features.Users;

public static class UserMapper
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto(
            user.Id,
            user.Name,
            user.Email!,
            user.Role,
            user.IsActive,
            user.CreatedAt
        );
    }

    public static User ToEntity(this RegisterUserDto dto)
    {
        return new User
        {
            Name = dto.Name,
            Email = dto.Email,
            UserName = dto.Email,
            Role = dto.Role
        };
    }
}
