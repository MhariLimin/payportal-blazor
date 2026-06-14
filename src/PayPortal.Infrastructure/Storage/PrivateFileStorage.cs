using PayPortal.Application.Abstractions;

namespace PayPortal.Infrastructure.Storage;

internal sealed class PrivateFileStorage(string rootPath) : IFileStorage
{
    public async Task<string> SaveAsync(
        Stream stream,
        string extension,
        CancellationToken cancellationToken)
    {
        Directory.CreateDirectory(rootPath);
        var storageName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var fullPath = Path.Combine(rootPath, storageName);
        await using var output = File.Create(fullPath);
        await stream.CopyToAsync(output, cancellationToken);
        return storageName;
    }

    public Task<Stream?> OpenReadAsync(string storageName, CancellationToken cancellationToken)
    {
        var path = SafePath(storageName);
        Stream? stream = File.Exists(path) ? File.OpenRead(path) : null;
        return Task.FromResult(stream);
    }

    public Task DeleteAsync(string storageName, CancellationToken cancellationToken)
    {
        var path = SafePath(storageName);
        if (File.Exists(path))
        {
            File.Delete(path);
        }

        return Task.CompletedTask;
    }

    private string SafePath(string storageName)
    {
        var path = Path.GetFullPath(Path.Combine(rootPath, storageName));
        var root = Path.GetFullPath(rootPath) + Path.DirectorySeparatorChar;
        if (!path.StartsWith(root, StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Invalid storage path.");
        }

        return path;
    }
}
