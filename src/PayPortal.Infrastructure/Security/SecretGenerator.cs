using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using PayPortal.Application.Abstractions;

namespace PayPortal.Infrastructure.Security;

internal sealed class SecretGenerator(IPasswordHasher<string> passwordHasher) : ISecretGenerator
{
    public (string PublicKey, string Secret, string SecretHash) Generate(string environment)
    {
        var prefix = environment.Equals("production", StringComparison.OrdinalIgnoreCase)
            ? "live"
            : "test";
        var publicKey = $"pk_{prefix}_{Token(24)}";
        var secret = $"sk_{prefix}_{Token(36)}";
        return (publicKey, secret, passwordHasher.HashPassword(publicKey, secret));
    }

    private static string Token(int bytes) =>
        Convert.ToHexString(RandomNumberGenerator.GetBytes(bytes)).ToLowerInvariant();
}
