using BackEnd.Models;

namespace BackEnd.Services
{
    public interface ILoginService
    {
        bool VerifyPassword(string plainText, string hashedPassword);
        string CreateJwtToken(Employee employee);
        Task LogLoginAttemptAsync(string email, int? employeeId, bool success, string message, string ipAddress);
        Task LogLogoutAsync(string email, int employeeId, string ipAddress);
    }
}