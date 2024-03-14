using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SalesApp.Extensions;
using SalesApp.Models;
using SalesApp.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private GraphService _graphService;
        private DatabaseService _databaseService;

        public HomeController(ILogger<HomeController> logger, GraphService graphService, DatabaseService databaseService)
        {
            _logger = logger;
            _graphService = graphService;
            _databaseService = databaseService;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var currentUserId = Guid.Parse(User.Id());
                var adGroups = await _graphService.GetGroupsByUserAsync(currentUserId);

                var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();
                var company = _databaseService.GetCompanyByName(salesAppGroup.Name.Substring(salesAppGroup.Name.LastIndexOf('_') + 1));

                ViewBag.UserName = HttpContext.User.Identity.Name;
                ViewBag.Name = User.Name();
                ViewBag.UserId = User.Id();
                ViewBag.CompanyId = company.Id;
                ViewBag.Logo = company.LogoPath;
                ViewBag.Color = company.Color;
                ViewBag.Company = company.Name;
                ViewBag.Adress = company.Adress;
                ViewBag.WorkspaceId = company.WorkspaceId;
                ViewBag.ReportId = company.ReportId;
                ViewBag.SalesReportId = company.SalesReportReportId;
                ViewBag.SalesReportId2 = company.SalesReport2ReportId;
                ViewBag.StoreReportId = company.StoreReportReportId;
                ViewBag.IsAdmin = _databaseService.CheckAdmin(company.Id, currentUserId).ToString();
                ViewBag.IsSuperUser = _databaseService.CheckSuperUser(company.Id, currentUserId).ToString();
                ViewBag.IsLightUser = _databaseService.CheckLightUser(company.Id, currentUserId).ToString();
                ViewBag.IsStoreUser = _databaseService.CheckStoreUser(company.Id, currentUserId).ToString();
                ViewBag.IsKilometersObliged = _databaseService.CheckKilometersObliged(company.Id, currentUserId).ToString();

                _databaseService.SaveLogin(company.Id, company.Name, currentUserId.ToString(), User.Name());

                return View();
            }
            catch
            {
                return View("NoAccess");
            }
        }

        public async Task<IActionResult> QuickRegister()
        {
            try
            {
                var currentUserId = Guid.Parse(User.Id());
                var adGroups = await _graphService.GetGroupsByUserAsync(currentUserId);

                var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();
                var company = _databaseService.GetCompanyByName(salesAppGroup.Name.Substring(salesAppGroup.Name.LastIndexOf('_') + 1));

                ViewBag.UserName = HttpContext.User.Identity.Name;
                ViewBag.Name = User.Name();
                ViewBag.UserId = User.Id();
                ViewBag.CompanyId = company.Id;
                ViewBag.Logo = company.LogoPath;
                ViewBag.Color = company.Color;
                ViewBag.Company = company.Name;
                ViewBag.Adress = company.Adress;
                ViewBag.WorkspaceId = company.WorkspaceId;
                ViewBag.ReportId = company.ReportId;
                ViewBag.SalesReportId = company.SalesReportReportId;
                ViewBag.IsAdmin = _databaseService.CheckAdmin(company.Id, currentUserId).ToString();
                ViewBag.IsSuperUser = _databaseService.CheckSuperUser(company.Id, currentUserId).ToString();

                //_databaseService.SaveLogin(company.Id, company.Name, currentUserId.ToString(), User.Name());

                return View();
            }
            catch
            {
                return View("NoAccess");
            }
        }

        public async  Task<List<AdMember>> GetAdMembers()
        {
            var currentUserId = Guid.Parse(User.Id());
            var adGroups = await _graphService.GetGroupsByUserAsync(currentUserId);

            var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();

            var members = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());

            string hostHeader =  $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            if (!hostHeader.Contains("localhost"))
            {
                members.RemoveAll(s => /*s.Name == "Tommie Karlsson" ||*/ s.Name == "Niklas Forsberg" || s.Name == "Daniel Rönning" || s.Name == "Anton Eriksson" || s.Name == "QBIM Admin" || s.Name == "Niklas Lindberg" || s.Name == "Åsa Säfströmer");
            }

            members.RemoveAll(s => s.Name.Contains("#"));

            members.Sort((x, y) => string.Compare(x.Name, y.Name));

            return members;
        }

        public async Task<List<AdMember>> GetAdMembersWithoutLightUsers()
        {
            var currentUserId = Guid.Parse(User.Id());
            var adGroups = await _graphService.GetGroupsByUserAsync(currentUserId);

            var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();

            var members = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());

            string hostHeader = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}"; 
            if (!hostHeader.Contains("localhost"))
            {
                members.RemoveAll(s => /*s.Name == "Tommie Karlsson" ||*/ s.Name == "Niklas Forsberg" || s.Name == "Daniel Rönning" || s.Name == "Anton Eriksson" || s.Name == "QBIM Admin" || s.Name == "Niklas Lindberg" || s.Name == "Åsa Säfström");
            }

            members.RemoveAll(s => s.Name.Contains("#"));

            var lightUsers = _databaseService.GetLightUsers();
            var filteredMembers = members
                .Where(member => lightUsers.Any(lightUser => lightUser.UserId != member.Id))
                .ToList();

            filteredMembers.Sort((x, y) => string.Compare(x.Name, y.Name));

            return filteredMembers;
        }

        public async Task<List<Models.ActivitySalesman>> GetActivitiesCurrentMonth(string companyId, string fromDate, string toDate)
        {
            var members = await GetAdMembers();

            return _databaseService.GetActivitiesCurrentMonth(companyId, members, DateTime.Parse(fromDate), DateTime.Parse(toDate));
        }

        public async Task<List<ReactMultiSelectValue>> GetAdMembersSelect()
        {
            var currentUserId = Guid.Parse(User.Id());
            var adGroups = await _graphService.GetGroupsByUserAsync(currentUserId);

            var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();

            var members = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());

            members.RemoveAll(s => /*s.Name == "Tommie Karlsson" ||*/ s.Name == "Niklas Forsberg" || s.Name == "Daniel Rönning" || s.Name == "Anton Eriksson" || s.Name == "QBIM Admin" || s.Name == "Niklas Lindberg" || s.Name == "Åsa Säfström");
            members.RemoveAll(s => s.Name.Contains("#"));

            members.Sort((x, y) => string.Compare(x.Name, y.Name));

            var list = new List<ReactMultiSelectValue>();

            foreach(var mem in members)
            {
                list.Add(new ReactMultiSelectValue
                {
                    label = mem.Name,
                    value = mem.Id
                });
            }

            return list;
        }

        public async Task<bool> RemoveGroupMember(string userId)
        {
            var currentUserId = Guid.Parse(User.Id());
            var adGroups = await _graphService.GetGroupsByUserAsync(currentUserId);

            var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();

            return await _graphService.RemoveGroupMember(salesAppGroup.Id.ToString(), userId);
        }

        public async Task<bool> ContactUs(string contactTitle, string contactDescription)
        {
            var email = User.UserName();

            return await _graphService.ContactUs(email, contactTitle, contactDescription);
        }

        public List<StatusOption> GetOptions(string companyId)
        {
            return _databaseService.GetOptions(companyId);
        }

        public bool SaveOption(string companyId, string option)
        {
            return _databaseService.SaveOption(companyId, option);
        }

        public bool RemoveOption(string companyId, string option)
        {
            return _databaseService.RemoveOption(companyId, option);
        }

        public List<CustomerMeeting> GetKmUnregisteredMeetingsForSalesman(string companyId, string salesmanId)
        {
            return _databaseService.GetKmUnregisteredMeetingsForSalesman(companyId, salesmanId);
        }

        public List<ProspectMeeting> GetKmUnregisteredProspectMeetingsForSalesman(string companyId, string salesmanId)
        {
            return _databaseService.GetKmUnregisteredProspectMeetingsForSalesman(companyId, salesmanId);
        }

        public List<SupplierTravel> GetSupplierTravelsForSalesman(string companyId, string salesmanId)
        {
            return _databaseService.GetSupplierTravelsForSalesman(companyId, salesmanId);
        }

        public List<KmRegisteredObject> GetRegisteredObjectForSalesman(string companyId, string salesmanId)
        {
            var supplierTravels = _databaseService.GetSupplierTravelsForSalesman(companyId, salesmanId);
            var meetings = _databaseService.GetKmRegisteredMeetingsForSalesman(companyId, salesmanId);
            var prospectMeetings = _databaseService.GetKmRegisteredProspectMeetingsForSalesman(companyId, salesmanId);

            var customers = _databaseService.GetCustomers(companyId);
            var prospects = _databaseService.GetAllProspects(companyId);

            var list = new List<KmRegisteredObject>();

            foreach(var item in supplierTravels)
            {
                list.Add(new KmRegisteredObject()
                {
                    Id = item.Id,
                    CompanyId = item.CompanyId,
                    UserId = item.UserId,
                    Date = item.Date,
                    Name = item.SupplierName,
                    Type = "Leverantörsbesök",
                    KilometersDriven = item.KilometersDriven
                });
            }

            foreach (var item in meetings)
            {
                list.Add(new KmRegisteredObject()
                {
                    Id = item.MeetingId,
                    CompanyId = item.CompanyId,
                    UserId = item.CompanyResponsible,
                    Date = item.Date,
                    Name = customers.Where(e => e.Id == item.CustomerId).FirstOrDefault().Name,
                    Type = "Kundaktivitet",
                    KilometersDriven = item.KilometersDriven
                });
            }

            foreach (var item in prospectMeetings)
            {
                list.Add(new KmRegisteredObject()
                {
                    Id = item.MeetingId,
                    CompanyId = item.CompanyId,
                    UserId = item.CompanyResponsible,
                    Date = item.Date,
                    Name = prospects.Where(e => e.Id == item.ProspectId).FirstOrDefault().Name,
                    Type = "Prospektaktivitet",
                    KilometersDriven = item.KilometersDriven
                });
            }

            return list;
        }

        public bool RegisterKilometers(string companyId, string meetingId, string kilometers)
        {
            return _databaseService.RegisterKilometers(companyId, meetingId, kilometers);
        }

        public bool RegisterProspectKilometers(string companyId, string meetingId, string kilometers)
        {
            return _databaseService.RegisterProspectKilometers(companyId, meetingId, kilometers);
        }

        public bool RegisterSupplierTravel(SupplierTravel supplierTravel)
        {
            supplierTravel.Id = Guid.NewGuid().ToString()
                ;
            return _databaseService.RegisterSupplierTravel(supplierTravel);
        }

        public IActionResult NoAccess()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }

    public class KmRegisteredObject
    {
        public string Id { get; set; }
        public string CompanyId { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int? KilometersDriven { get; set; }
    }
}
