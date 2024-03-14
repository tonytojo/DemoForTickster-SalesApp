// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace SalesApp.Services
{
    using Microsoft.Extensions.Options;
    using Microsoft.Identity.Client;
    using System;
    using System.Linq;
    using System.Security;
    using SalesApp.Models;
    using Microsoft.Graph;
    using System.Threading.Tasks;
    using System.Net.Http;
    using System.Net.Http.Headers;

    public class AadService : IAuthenticationProvider
    {
        private readonly KeyVaultService keyVaultService;
        private readonly IOptions<AzureAd> azureAd;
        private readonly IOptions<PowerBI> powerBI;
        private readonly IOptions<Graph> graph;

        public AadService(IOptions<AzureAd> azureAd, IOptions<Graph> graph, KeyVaultService keyVaultService, IOptions<PowerBI> powerBI)
        {
            this.azureAd = azureAd;
            this.graph = graph;
            this.keyVaultService = keyVaultService;
            this.powerBI = powerBI;
        }

        /// <summary>
        /// For Microsoft Graph
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public Task AuthenticateRequestAsync(HttpRequestMessage request)
        {
            // For app only authentication, we need the specific tenant id in the authority url
            var tenantSpecificUrl = graph.Value.AuthorityUri.Replace("organizations", graph.Value.TenantId);

            // Create a confidential client to authorize the app with the AAD app
            IConfidentialClientApplication clientApp = ConfidentialClientApplicationBuilder
                                                                                .Create(graph.Value.ClientId)
                                                                                .WithClientSecret(graph.Value.ClientSecret)
                                                                                .WithAuthority(tenantSpecificUrl)
                                                                                .Build();

            AuthenticationResult result = clientApp.AcquireTokenForClient(graph.Value.Scope).ExecuteAsync().Result;

            request.Headers.Authorization = AuthenticationHeaderValue.Parse(result.CreateAuthorizationHeader());

            return Task.CompletedTask;
        }

        /// <summary>
        /// Generates and returns Access token
        /// </summary>
        /// <returns>AAD token</returns>
        public string GetAccessToken()
        {
            AuthenticationResult authenticationResult = null;
            if (powerBI.Value.AuthenticationMode.Equals("masteruser", StringComparison.InvariantCultureIgnoreCase))
            {
                // Create a public client to authorize the app with the AAD app
                IPublicClientApplication clientApp = PublicClientApplicationBuilder.Create(powerBI.Value.ClientId).WithAuthority(powerBI.Value.AuthorityUri).Build();
                var userAccounts = clientApp.GetAccountsAsync().Result;
                try
                {
                    // Retrieve Access token from cache if available
                    authenticationResult = clientApp.AcquireTokenSilent(powerBI.Value.Scope, userAccounts.FirstOrDefault()).ExecuteAsync().Result;
                }
                catch (Exception)
                {
                    string pbiPassword = keyVaultService.GetPbiPassword();
                    SecureString password = new SecureString();
                    foreach (var key in pbiPassword)
                    {
                        password.AppendChar(key);
                    }
                    authenticationResult = clientApp.AcquireTokenByUsernamePassword(powerBI.Value.Scope, powerBI.Value.PbiUsername, password).ExecuteAsync().Result;
                }
            }

            // Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
            else if (powerBI.Value.AuthenticationMode.Equals("serviceprincipal", StringComparison.InvariantCultureIgnoreCase))
            {
                // For app only authentication, we need the specific tenant id in the authority url
                var tenantSpecificUrl = powerBI.Value.AuthorityUri.Replace("organizations", powerBI.Value.TenantId);

                // Create a confidential client to authorize the app with the AAD app
                IConfidentialClientApplication clientApp = ConfidentialClientApplicationBuilder
                                                                                .Create(powerBI.Value.ClientId)
                                                                                .WithClientSecret(powerBI.Value.ClientSecret)
                                                                                .WithAuthority(tenantSpecificUrl)
                                                                                .Build();


                // Make a client call if Access token is not available in cache
                authenticationResult = clientApp.AcquireTokenForClient(powerBI.Value.Scope).ExecuteAsync().Result;
            }

            return authenticationResult.AccessToken;
        }
    }
}
