namespace Template.Features.Items;

public class Item
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; }
}
