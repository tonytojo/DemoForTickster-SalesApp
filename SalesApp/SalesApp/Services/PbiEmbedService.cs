// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace SalesApp.Services
{
    using Microsoft.PowerBI.Api;
    using Microsoft.PowerBI.Api.Models;
    using Microsoft.Rest;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Runtime.InteropServices;
    using System.Threading.Tasks;
    using System.IO;
    using System.Net;
    using Microsoft.EntityFrameworkCore;
    using System.Runtime.Caching;
    using Microsoft.Extensions.Options;
    using SalesApp.Models;
    using SalesApp.Mappers;

    public class PbiEmbedService
    {
        private readonly AadService aadService;
        private const string urlPowerBiServiceApiRoot = "https://api.powerbi.com";
        private const string CacheKey = "token";
        CacheItemPolicy cacheItemPolicy = new CacheItemPolicy();
        private readonly IOptions<PowerBI> _powerBI;

        public PbiEmbedService(AadService aadService, IOptions<PowerBI> powerBI)
        {
            this.aadService = aadService;
            _powerBI = powerBI;
            cacheItemPolicy.AbsoluteExpiration = DateTime.Now.AddHours(0.5);
        }

        /// <summary>
        /// Get Power BI client
        /// </summary>
        /// <returns>Power BI client object</returns>
        public PowerBIClient GetPowerBIClient()
        {
            ObjectCache cache = MemoryCache.Default;
            var cachedToken = (string)cache.Get(CacheKey);

            if (cachedToken != null)
            {
                var tokenCredentials = new TokenCredentials(cachedToken, "Bearer");
                return new PowerBIClient(new Uri(urlPowerBiServiceApiRoot), tokenCredentials);
            }
            else
            {
                var token = aadService.GetAccessToken();
                var tokenCredentials = new TokenCredentials(token, "Bearer");
                cache.Add(CacheKey, token, cacheItemPolicy);
                return new PowerBIClient(new Uri(urlPowerBiServiceApiRoot), tokenCredentials);
            }
        }

        /// <summary>
        /// Get embed params for a report v1
        /// </summary>
        /// <param name="workspaceId"></param>
        /// <param name="reportId"></param>
        /// <returns></returns>
        public async Task<EmbedParams> GetEmbedParamsForReportV1Async(Guid workspaceId, Guid reportId, [Optional] Guid additionalDatasetId, [Optional] string username)
        {
            PowerBIClient pbiClient = GetPowerBIClient();
            var pbiReport = await pbiClient.Reports.GetReportInGroupAsync(workspaceId, reportId);
            var datasetIds = new List<Guid>();
            datasetIds.Add(Guid.Parse(pbiReport.DatasetId));

            // Append additional dataset to the list to achieve dynamic binding later
            if (additionalDatasetId != Guid.Empty)
            {
                datasetIds.Add(additionalDatasetId);
            }

            var embedReports = new List<EmbedReport>() {
                new EmbedReport
                {
                    ReportId = pbiReport.Id,
                    ReportName = pbiReport.Name,
                    EmbedUrl = pbiReport.EmbedUrl
                }
            };


            var dataset = await pbiClient.Datasets.GetDatasetInGroupAsync(workspaceId, pbiReport.DatasetId);
            EffectiveIdentity effectiveIdentity = null;
            if (dataset.IsEffectiveIdentityRequired.GetValueOrDefault() && !string.IsNullOrEmpty(username))
            {
                // Experimental
                username = "powerbi_admin@liv.onmicrosoft.com";
                effectiveIdentity = new EffectiveIdentity(username, datasets: new[] { pbiReport.DatasetId }, roles: new[] { "Role_Heroma_Analytiker" });
            }


            // Get Embed token multiple resources
            //var embedToken = await GetEmbedTokenForReportV1Async(reportId, datasetIds, workspaceId, effectiveIdentity);
            var embedToken = await GetEmbedTokenForReportV1Async(reportId, datasetIds, workspaceId, effectiveIdentity);

            // Capture embed params
            var embedParams = new EmbedParams
            {
                EmbedReport = embedReports,
                Type = "Report",
                EmbedToken = embedToken
            };

            return embedParams;
        }

        /// <summary>
        /// Get embed token for a report v1
        /// </summary>
        /// <param name="reportId"></param>
        /// <param name="datasetIds"></param>
        /// <param name="targetWorkspaceId"></param>
        /// <returns></returns>
        public async Task<EmbedToken> GetEmbedTokenForReportV1Async(Guid reportId, IList<Guid> datasetIds, [Optional] Guid targetWorkspaceId, [Optional] EffectiveIdentity effectiveIdentity)
        {
            PowerBIClient pbiClient = GetPowerBIClient();

            var identities = effectiveIdentity == null ? null : new[] { effectiveIdentity };

            var tokenRequest = new GenerateTokenRequest(identities: identities);

            var embedToken = await pbiClient.Reports.GenerateTokenInGroupAsync(targetWorkspaceId, reportId, tokenRequest);

            return embedToken;
        }

        /// <summary>
        /// Get embed params for a dashboard v1
        /// </summary>
        /// <param name="workspaceId"></param>
        /// <param name="dashboardId"></param>
        /// <returns></returns>
        public async Task<EmbedParams> GetEmbedParamsForDashboardV1Async(Guid workspaceId, Guid dashboardId)
        {
            PowerBIClient pbiClient = GetPowerBIClient();

            // Get report info
            var pbiDashboard = await pbiClient.Dashboards.GetDashboardInGroupAsync(workspaceId, dashboardId);

            // Add report data for embedding
            var embedReports = new List<EmbedReport>() {
                new EmbedReport
                {
                    ReportId = pbiDashboard.Id, ReportName = pbiDashboard.DisplayName, EmbedUrl = pbiDashboard.EmbedUrl
                }
            };

            // Get Embed token multiple resources
            var embedToken = await GetEmbedTokenForDashboardV1Async(dashboardId, workspaceId);

            // Capture embed params
            var embedParams = new EmbedParams
            {
                EmbedReport = embedReports,
                Type = "Dashboard",
                EmbedToken = embedToken
            };

            return embedParams;
        }

        /// <summary>
        /// Get embed token for a dashboard v1
        /// </summary>
        /// <param name="dashboardId"></param>
        /// <param name="datasetIds"></param>
        /// <param name="targetWorkspaceId"></param>
        /// <returns></returns>
        public async Task<EmbedToken> GetEmbedTokenForDashboardV1Async(Guid dashboardId, Guid targetWorkspaceId)
        {
            PowerBIClient pbiClient = GetPowerBIClient();

            var tokenRequest = new GenerateTokenRequest();

            var embedToken = await pbiClient.Dashboards.GenerateTokenInGroupAsync(targetWorkspaceId, dashboardId, tokenRequest);

            return embedToken;
        }

        /// <summary>
        /// Get embed params for a report
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL, Report Id, and Report name for single report</returns>
        public EmbedParams GetEmbedParams(Guid workspaceId, Guid reportId, [Optional] Guid additionalDatasetId)
        {
            PowerBIClient pbiClient = GetPowerBIClient();

            // Get report info
            var pbiReport = pbiClient.Reports.GetReportInGroup(workspaceId, reportId);

            // Create list of datasets
            var datasetIds = new List<Guid>();

            // Add dataset associated to the report
            datasetIds.Add(Guid.Parse(pbiReport.DatasetId));

            // Append additional dataset to the list to achieve dynamic binding later
            if (additionalDatasetId != Guid.Empty)
            {
                datasetIds.Add(additionalDatasetId);
            }

            // Add report data for embedding
            var embedReports = new List<EmbedReport>() {
                new EmbedReport
                {
                    ReportId = pbiReport.Id, ReportName = pbiReport.Name, EmbedUrl = pbiReport.EmbedUrl
                }
            };

            // Get Embed token multiple resources
            var embedToken = GetEmbedToken(reportId, datasetIds, workspaceId);

            // Capture embed params
            var embedParams = new EmbedParams
            {
                EmbedReport = embedReports,
                Type = "Report",
                EmbedToken = embedToken
            };

            return embedParams;
        }

        /// <summary>
        /// Get embed params for multiple reports for a single workspace
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL, Report Id, and Report name for multiple reports</returns>
        public EmbedParams GetEmbedParams(Guid workspaceId, IList<Guid> reportIds, [Optional] IList<Guid> additionalDatasetIds)
        {
            // Note: This method is an example and is not consumed in this sample app

            PowerBIClient pbiClient = GetPowerBIClient();

            // Create mapping for reports and Embed URLs
            var embedReports = new List<EmbedReport>();

            // Create list of datasets
            var datasetIds = new List<Guid>();

            // Get datasets and Embed URLs for all the reports
            foreach (var reportId in reportIds)
            {
                // Get report info
                var pbiReport = pbiClient.Reports.GetReportInGroup(workspaceId, reportId);

                datasetIds.Add(Guid.Parse(pbiReport.DatasetId));

                // Add report data for embedding
                embedReports.Add(new EmbedReport { ReportId = pbiReport.Id, ReportName = pbiReport.Name, EmbedUrl = pbiReport.EmbedUrl });
            }

            // Append to existing list of datasets to achieve dynamic binding later
            if (additionalDatasetIds != null)
            {
                datasetIds.AddRange(additionalDatasetIds);
            }

            // Get Embed token multiple resources
            var embedToken = GetEmbedToken(reportIds, datasetIds, workspaceId);

            // Capture embed params
            var embedParams = new EmbedParams
            {
                EmbedReport = embedReports,
                Type = "Report",
                EmbedToken = embedToken
            };

            return embedParams;
        }

        /// <summary>
        /// Get Embed token for single report, multiple datasets, and an optional target workspace
        /// </summary>
        /// <returns>Embed token</returns>
        public EmbedToken GetEmbedToken(Guid reportId, IList<Guid> datasetIds, [Optional] Guid targetWorkspaceId)
        {
            PowerBIClient pbiClient = GetPowerBIClient();

            // Create a request for getting Embed token 
            // This method works only with new Power BI V2 workspace experience
            var tokenRequest = new GenerateTokenRequestV2(

                reports: new List<GenerateTokenRequestV2Report>() { new GenerateTokenRequestV2Report(reportId) },

                datasets: datasetIds.Select(datasetId => new GenerateTokenRequestV2Dataset(datasetId.ToString())).ToList(),

                targetWorkspaces: targetWorkspaceId != Guid.Empty ? new List<GenerateTokenRequestV2TargetWorkspace>() { new GenerateTokenRequestV2TargetWorkspace(targetWorkspaceId) } : null
            );

            // Generate Embed token
            var embedToken = pbiClient.EmbedToken.GenerateToken(tokenRequest);

            return embedToken;
        }

        /// <summary>
        /// Get Embed token for multiple reports, datasets, and an optional target workspace
        /// </summary>
        /// <returns>Embed token</returns>
        public EmbedToken GetEmbedToken(IList<Guid> reportIds, IList<Guid> datasetIds, [Optional] Guid targetWorkspaceId)
        {
            // Note: This method is an example and is not consumed in this sample app

            PowerBIClient pbiClient = GetPowerBIClient();

            // Convert report Ids to required types
            var reports = reportIds.Select(reportId => new GenerateTokenRequestV2Report(reportId)).ToList();

            // Convert dataset Ids to required types
            var datasets = datasetIds.Select(datasetId => new GenerateTokenRequestV2Dataset(datasetId.ToString())).ToList();

            // Create a request for getting Embed token 
            // This method works only with new Power BI V2 workspace experience
            var tokenRequest = new GenerateTokenRequestV2(

                datasets: datasets,

                reports: reports,

                targetWorkspaces: targetWorkspaceId != Guid.Empty ? new List<GenerateTokenRequestV2TargetWorkspace>() { new GenerateTokenRequestV2TargetWorkspace(targetWorkspaceId) } : null
            );

            // Generate Embed token
            var embedToken = pbiClient.EmbedToken.GenerateToken(tokenRequest);

            return embedToken;
        }

        /// <summary>
        /// Get Embed token for multiple reports, datasets, and optional target workspaces
        /// </summary>
        /// <returns>Embed token</returns>
        public EmbedToken GetEmbedToken(IList<Guid> reportIds, IList<Guid> datasetIds, [Optional] IList<Guid> targetWorkspaceIds)
        {
            // Note: This method is an example and is not consumed in this sample app

            PowerBIClient pbiClient = GetPowerBIClient();

            // Convert report Ids to required types
            var reports = reportIds.Select(reportId => new GenerateTokenRequestV2Report(reportId)).ToList();

            // Convert dataset Ids to required types
            var datasets = datasetIds.Select(datasetId => new GenerateTokenRequestV2Dataset(datasetId.ToString())).ToList();

            // Convert target workspace Ids to required types
            IList<GenerateTokenRequestV2TargetWorkspace> targetWorkspaces = null;
            if (targetWorkspaceIds != null)
            {
                targetWorkspaces = targetWorkspaceIds.Select(targetWorkspaceId => new GenerateTokenRequestV2TargetWorkspace(targetWorkspaceId)).ToList();
            }

            // Create a request for getting Embed token 
            // This method works only with new Power BI V2 workspace experience
            var tokenRequest = new GenerateTokenRequestV2(

                datasets: datasets,

                reports: reports,

                targetWorkspaces: targetWorkspaceIds != null ? targetWorkspaces : null
            );

            // Generate Embed token
            var embedToken = pbiClient.EmbedToken.GenerateToken(tokenRequest);

            return embedToken;
        }

        public async Task<IEnumerable<EmbedReport>> GetReportsInGroupAsync(Guid workspaceId)
        {
            PowerBIClient client = GetPowerBIClient();
            var reports = await client.Reports.GetReportsInGroupAsync(workspaceId);
            var embedReports = reports.Value.Select(r => new EmbedReport
            {
                ReportId = r.Id,
                ReportName = r.Name,
                EmbedUrl = r.EmbedUrl
            }).ToArray();
            return embedReports;
        }

        public async Task<IEnumerable<EmbedReport>> GetDashboardsInGroupAsync(Guid workspaceId)
        {
            PowerBIClient client = GetPowerBIClient();
            var dashboards = await client.Dashboards.GetDashboardsInGroupAsync(workspaceId);
            var embedReports = dashboards.Value.Select(r => new EmbedReport
            {
                ReportId = r.Id,
                ReportName = r.DisplayName,
                EmbedUrl = r.EmbedUrl
            }).ToArray();
            return embedReports;
        }

        public async Task<IEnumerable<Microsoft.PowerBI.Api.Models.Group>> GetGroupsAsync()
        {
            PowerBIClient client = GetPowerBIClient();
            var groups = await client.Groups.GetGroupsAsAdminAsync(1000, expand: "dashboards,reports", filter: "isOnDedicatedCapacity eq true");
            var workspaces = groups.Value.ToList();
            return (IEnumerable<Microsoft.PowerBI.Api.Models.Group>)workspaces;
        }

        public async Task<IEnumerable<Models.Page>> GetPagesAsync(Guid groupId, Guid reportId)
        {
            PowerBIClient client = GetPowerBIClient();
            var pbiPages = await client.Reports.GetPagesInGroupAsync(Guid.Parse(_powerBI.Value.PbiServiceWorkspace), reportId);
            var pages = pbiPages.Value.Select(PageMapper.Map).ToArray();
            return pages;
        }

        public async Task<Stream> ExportReportAsync(string groupId, string reportId)
        {
            var powerBiClient = GetPowerBIClient();

            return await powerBiClient.Reports.ExportReportInGroupAsync(Guid.Parse(groupId), Guid.Parse(reportId));
        }

        //public async Task<List<AzureGroup>> GetAzureGroupsWithEmbedObjectsAsync(List<AzureGroup> azureGroups)
        //{
        //    var powerBiClient = GetPowerBIClient();
        //    var pbiGroups = (await powerBiClient.Groups.GetGroupsAsync()).Value.Where(x => x.IsOnDedicatedCapacity.HasValue && x.IsOnDedicatedCapacity.Value).ToList();
        //    var tasks = new List<Task>();
        //    foreach (var azureGroup in azureGroups.Where(x => pbiGroups.Exists(y => x.Id == y.Id.ToString())))
        //    {
        //        azureGroup.IsPremium = true;
        //        tasks.Add(GetAzureGroupWithReportsAsync(azureGroup));
        //        tasks.Add(GetAzureGroupWithDatasetsAsync(azureGroup));
        //        tasks.Add(GetAzureGroupWithDashboardsAsync(azureGroup));
        //    }
        //    await Task.WhenAll(tasks);
        //    return azureGroups;
        //}

        //private async Task<AzureGroup> GetAzureGroupWithReportsAsync(AzureGroup azureGroup)
        //{
        //    try
        //    {
        //        System.Net.ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12; // Fix for SocketException failure towards PowerBI. 
        //        var powerBiClient = GetPowerBIClient();
        //        var reports = await powerBiClient.Reports.GetReportsInGroupAsync(Guid.Parse(azureGroup.Id));
        //        azureGroup.Reports = reports?.Value.Select(EmbedObjectMapper.Map).ToList();
        //        return azureGroup;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}

        //private async Task<AzureGroup> GetAzureGroupWithDatasetsAsync(AzureGroup azureGroup)
        //{
        //    try
        //    {
        //        var powerBiClient = GetPowerBIClient();
        //        var datasets = await powerBiClient.Datasets.GetDatasetsInGroupAsync(Guid.Parse(azureGroup.Id));
        //        azureGroup.Datasets = datasets?.Value.Select(EmbedObjectMapper.Map).ToList();
        //        return azureGroup;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}

        //private async Task<AzureGroup> GetAzureGroupWithDashboardsAsync(AzureGroup azureGroup)
        //{
        //    try
        //    {
        //        var powerBiClient = GetPowerBIClient();
        //        var dash = await powerBiClient.Dashboards.GetDashboardsInGroupAsync(Guid.Parse(azureGroup.Id));
        //        azureGroup.Dashboards = dash?.Value.Select(EmbedObjectMapper.Map).ToList();
        //        return azureGroup;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e;
        //    }
        //}

        //public async Task<List<Microsoft.PowerBI.Api.Models.EffectiveIdentity>> GetEffectiveIdentitiesAsync(string datasetId, string groupId, string username, string userId, IEnumerable<Azure.Models.AzureGroup> userGroups)
        //{

        //    var client = GetPowerBIClient();
        //    var dataset = await client.Datasets.GetDatasetInGroupAsync(Guid.Parse(groupId), datasetId);

        //    if (dataset.IsEffectiveIdentityRequired.GetValueOrDefault())
        //    {
        //        var effectiveIdentity = new Microsoft.PowerBI.Api.Models.EffectiveIdentity
        //        {
        //            Datasets = new[] { datasetId },
        //            Username = username
        //        };

        //        var roles = await GetRolesFromDbAsync(userGroups, datasetId, userId);

        //        if (roles.Any())
        //        {
        //            effectiveIdentity.Roles = roles.ToArray();
        //        }

        //        return new List<Microsoft.PowerBI.Api.Models.EffectiveIdentity>
        //        {
        //            effectiveIdentity
        //        };

        //    }

        //    else

        //    {

        //        return null;

        //    }

        //}

        //public async Task<EmbedConfig> GetEmbedConfigQnaAsync(string groupId, EmbedObject embedObject, List<EffectiveIdentity> identities)
        //{
        //    var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: TokenAccessLevel.View, identities: identities);

        //    try
        //    {
        //        var powerBiClient = GetPowerBIClient();
        //        var tokenResponse = await powerBiClient.Datasets.GenerateTokenInGroupAsync(Guid.Parse(groupId), embedObject.Id, generateTokenRequestParameters);
        //        return new EmbedConfig()
        //        {
        //            EmbedToken = tokenResponse,
        //            EmbedUrl = https://app.powerbi.com/qnaEmbed?groupId= + groupId,
        //            Id = embedObject.Id,
        //            Name = embedObject.Name
        //        };
        //    }

        //    catch (Exception e)
        //    {
        //        throw;
        //    }

        //}
    }
}
