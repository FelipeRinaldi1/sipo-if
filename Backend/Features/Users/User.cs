using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Template.Features.Users;

public enum UserRole
{
    Admin = 1,

    Clerk = 2,

    Technician = 3
}

public class User : IdentityUser<Guid>
{
    [MaxLength(144)]
    public string Name { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Technician;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
