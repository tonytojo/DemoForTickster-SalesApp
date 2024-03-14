using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SalesApp.Extensions;
using SalesApp.Services;

namespace SalesApp.Controllers
{
    public class ReportsController : Controller
    {
        private readonly PbiEmbedService _pbiEmbedService;
        private GraphService _graphService;
        private DatabaseService _databaseService;
        public ReportsController(PbiEmbedService pbiEmbedService, GraphService graphService, DatabaseService databaseService)
        {
            _pbiEmbedService = pbiEmbedService;
            _graphService = graphService;
            _databaseService = databaseService;
        }

        public async Task<IActionResult> Index(Guid workspaceId, Guid reportId, string pageName, string filters)
        {
            var currentUserId = Guid.Parse(User.Id());
            var adGroups = await _graphService.GetGroupsByUserAsync(currentUserId);

            var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();
            var company = _databaseService.GetCompanyByName(salesAppGroup.Name.Substring(salesAppGroup.Name.LastIndexOf('_') + 1));

            ViewBag.UserName = HttpContext.User.Identity.Name;
            ViewBag.CompanyId = company.Id;
            ViewBag.Logo = company.LogoPath;
            ViewBag.Color = company.Color;
            ViewBag.Company = company.Name;
            ViewBag.Adress = company.Adress;

            ViewBag.GroupId = workspaceId;

            var embedParams = await _pbiEmbedService.GetEmbedParamsForReportV1Async(workspaceId, reportId);
            embedParams.PageName = pageName;
            //if (filters != null) embedParams.Filters = _reportsService.GetFilters(filters);

            return View(embedParams);
        }
    }
}
