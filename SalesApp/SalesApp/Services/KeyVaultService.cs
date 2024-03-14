using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Options;
using SalesApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Services
{
    public class KeyVaultService
    {
        private readonly IOptions<PowerBI> _powerBI;
        private readonly string _pbiPassword = "PowerBIService";
        //private readonly string _pbiPassword = "Password";

        public KeyVaultService(IOptions<PowerBI> powerBI)
        {
            _powerBI = powerBI;
        }

        public SecretClient GetSecretClient()
        {
            var credentials = new ClientSecretCredential(_powerBI.Value.TenantId, _powerBI.Value.ClientId, _powerBI.Value.ClientSecret);
            var client = new SecretClient(new Uri(_powerBI.Value.KeyVaultUri), credentials);
            return client;
        }

        public string GetPbiPassword()
        {
            //var client = GetSecretClient();
            //var secret = client.GetSecret(_pbiPassword);
            //return secret.Value.Value;

            return "Haku76%1_";
        }
    }
}
