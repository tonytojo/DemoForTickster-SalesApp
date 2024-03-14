using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using SalesApp.Extensions;
using SalesApp.Models;
using SalesApp.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text;

namespace SalesApp.Controllers
{
    public class ProjectController : Controller
    {
        private GraphService _graphService;
        private DatabaseService _databaseService;
        private static readonly HttpClient httpClient = new HttpClient();


        public ProjectController(GraphService graphService, DatabaseService databaseService)
        {
            _graphService = graphService;
            _databaseService = databaseService;
        }

        public async Task<List<ProjectActivity>> GetProjects(string companyId, string customerId)
        {
            var projects = _databaseService.GetProjects(companyId, customerId);

            var users = await GetAdMembers();

            foreach (var project in projects)
            {
                var responsibleUser = users.Where(e => e.Id == project.CompanyResponsible).ToList();
                project.CompanyResponsible = responsibleUser.Count != 0 ? responsibleUser[0].Name : "Ingen vald";

                if (project.CompanyResponsible2 != "Ingen vald")
                {
                    try
                    {
                        var CompanyResponsible2 = users.Where(e => e.Id == project.CompanyResponsible2).ToList();
                        project.CompanyResponsible2 = CompanyResponsible2.Count != 0 ? responsibleUser[0].Name : "Ingen vald";
                    }
                    catch
                    {
                        project.CompanyResponsible2 = "Ingen vald"; // Kan inträffa om säljaren är borttagen från SäljAppen
                    }
                }
            }

            return projects.OrderByDescending(d => d.LastSaved).ToList();
        }

        public async Task<List<ProjectActivity>> GetProjectsFiltered(string companyId, string customerId, string fromDate, string toDate, string status)
        {
            var projects = _databaseService.GetProjectsFiltered(companyId, customerId, fromDate, toDate, status);

            var users = await GetAdMembers();

            foreach (var project in projects)
            {
                project.CompanyResponsible = users.Where(e => e.Id == project.CompanyResponsible).FirstOrDefault().Name;
                if (project.CompanyResponsible2 != "Ingen vald")
                {
                    try
                    {
                        project.CompanyResponsible2 = users.Where(e => e.Id == project.CompanyResponsible2).FirstOrDefault().Name;
                    }
                    catch
                    {
                        project.CompanyResponsible2 = "Ingen vald"; // Kan inträffa om säljaren är borttagen från SäljAppen
                    }
                }
            }

            return projects.OrderByDescending(d => d.LastSaved).ToList();
        }

        public async Task<List<ProjectActivity>> GetAllProjects(string companyId)
        {
            var projects = _databaseService.GetAllProjects(companyId);

            var users = await GetAdMembers();

            foreach (var project in projects)
            {
                project.CompanyResponsible = users.Where(e => e.Id == project.CompanyResponsible).FirstOrDefault().Name;
                if (project.CompanyResponsible2 != "Ingen vald")
                {
                    try
                    {
                        project.CompanyResponsible2 = users.Where(e => e.Id == project.CompanyResponsible2).FirstOrDefault().Name;
                    }
                    catch
                    {
                        project.CompanyResponsible2 = "Ingen vald";
                    }
                }
            }

            return projects.OrderByDescending(d => d.LastSaved).ToList();
        }

        public async Task<List<ProjectActivity>> GetAllProjectsFiltered(string companyId, string fromDate, string toDate, string status)
        {
            var projects = _databaseService.GetAllProjectsFiltered(companyId, fromDate, toDate, status);

            var users = await GetAdMembers();

            foreach (var project in projects)
            {
                 var responsibleUser = users.Where(e => e.Id == project.CompanyResponsible).ToList();
                 project.CompanyResponsible = responsibleUser.Count != 0 ? responsibleUser[0].Name : "Ingen vald";

                if (project.CompanyResponsible2 != "Ingen vald")
                {
                    try
                    {
                        project.CompanyResponsible2 = users.Where(e => e.Id == project.CompanyResponsible2).FirstOrDefault().Name;
                    }
                    catch
                    {
                        project.CompanyResponsible2 = "Ingen vald"; // Kan inträffa om säljaren är borttagen från SäljAppen
                    }
                }
            }

            return projects.OrderByDescending(d => d.LastSaved).ToList();
        }



        public async Task<List<ProjectActivity>> GetProjectsOfEntireCustomerGroup(string customerGroupId)
        {
            var projects = _databaseService.GetProjectsOfEntireCustomerGroup(customerGroupId);

            var users = await GetAdMembers();

            foreach (var project in projects)
            {
                project.CompanyResponsible = users.Where(e => e.Id == project.CompanyResponsible).FirstOrDefault().Name;
                if (project.CompanyResponsible2 != "Ingen vald")
                {
                    project.CompanyResponsible2 = users.Where(e => e.Id == project.CompanyResponsible2).FirstOrDefault().Name;
                }
            }

            return projects.OrderByDescending(d => d.LastSaved).ToList();
        }

        public ProjectActivity GetProject(string companyId, string customerId, string projectId)
        {
            var project = _databaseService.GetProject(companyId, customerId, projectId);

            return project;
        }

        public ProjectActivitiesResult GetProjectResult(string projectId)
        {
            return _databaseService.GetProjectResult(projectId);
        }

        public async Task<bool> SaveProject(ProjectActivity projectActivity, string chosenCustomerId, List<string> customerMeetingExtraCompanyResponsibles, ProjectActivitiesResult ProjectActivitiesResult)
        {
            if (chosenCustomerId != null)
            {
                projectActivity.CustomerId = chosenCustomerId;
            }

            DateTimeFormatInfo dfi = DateTimeFormatInfo.CurrentInfo;
            Calendar cal = dfi.Calendar;
            var week = cal.GetWeekOfYear(DateTime.Now, dfi.CalendarWeekRule, dfi.FirstDayOfWeek);
            projectActivity.WeekNumber = week;

            string hostHeader = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            if (!hostHeader.Contains("localhost"))
            {
                try
                {
                    var customer = _databaseService.GetCustomers(projectActivity.CompanyId).Where(e => e.Id == projectActivity.CustomerId).FirstOrDefault();
                    var salesmanToNotify = GetAdMembers().Result.Where(e => e.Id == projectActivity.CompanyResponsible2).FirstOrDefault();
                    var createdBySalesman = GetAdMembers().Result.Where(e => e.Id == projectActivity.CompanyResponsible).FirstOrDefault();
                    await _graphService.NotifySecondSalesman(projectActivity, salesmanToNotify, createdBySalesman, customer);
                }
                catch
                {

                }
            }

            //Send Email if we have set the projekt to Klart
            if (projectActivity.Status.ToLower() == "klart")
            {
                await PrepareToSendEmailOnKlart(projectActivity, ProjectActivitiesResult.Result);
            }

            return await _databaseService.SaveProject(projectActivity, customerMeetingExtraCompanyResponsibles, ProjectActivitiesResult);
        }

        [HttpPost]
        public bool SaveFiles(List<IFormFile> files)
        {
            return true;
        }

        public async Task<bool> EditProject(ProjectActivity projectActivity, List<ReactMultiSelectValue> projectActivityExtraCompanyResponsibles, ProjectActivitiesResult ProjectActivitiesResult)
        {
            DateTimeFormatInfo dfi = DateTimeFormatInfo.CurrentInfo;
            Calendar cal = dfi.Calendar;
            var week = cal.GetWeekOfYear(projectActivity.Date, dfi.CalendarWeekRule, dfi.FirstDayOfWeek);
            projectActivity.WeekNumber = week;

            if (projectActivity.CustomerName == null)
            {
                projectActivity.CustomerName = _databaseService.GetNameOfCustomerOrGroup(projectActivity.CompanyId, projectActivity.CustomerId);
            }

            string hostHeader = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            if (!hostHeader.Contains("localhost"))
            {
                try
                {
                    var customer = _databaseService.GetCustomers(projectActivity.CompanyId).Where(e => e.Id == projectActivity.CustomerId).FirstOrDefault();
                    var salesmanToNotify = GetAdMembers().Result.Where(e => e.Id == projectActivity.CompanyResponsible2).FirstOrDefault();
                    var createdBySalesman = GetAdMembers().Result.Where(e => e.Id == projectActivity.CompanyResponsible).FirstOrDefault();
                    await _graphService.NotifySecondSalesman(projectActivity, salesmanToNotify, createdBySalesman, customer);
                }
                catch
                {

                }
            }

            //Send Email if we have set the projekt to Klart
            if (projectActivity.Status.ToLower() == "klart")
            {
                await PrepareToSendEmailOnKlart(projectActivity, ProjectActivitiesResult.Result);
            }

            return _databaseService.EditProject(projectActivity, projectActivityExtraCompanyResponsibles, ProjectActivitiesResult);
        }

        private async Task PrepareToSendEmailOnKlart(ProjectActivity projectActivity, string resultat)
        {
            List<string> salesNameList = new List<string>();
            string body;

            //Get admins email for the specified organization t.ex. österbergs
            List<AdMember> emailList = await GetAdMembersMail(_databaseService.GetAdminUserForOrganisation(projectActivity.CompanyId));
            string customerName = string.Empty;
            //var id = Guid.NewGuid();
            Guid? id = Guid.TryParse(projectActivity.CustomerId, out var parsedId) ? parsedId : (Guid?)null;
            customerName = id.HasValue
                 ? _databaseService.GetNameOfCustomerGroup(id.ToString())
                 : _databaseService.GetCustomerNameByOrganisation(projectActivity.CustomerId, projectActivity.CompanyId);

            //if (Guid.TryParse(projectActivity.CustomerId, out id))
            //{
            //    customerName = _databaseService.GetNameOfCustomerGroup(id.ToString());
            //}
            //else
            //{
            //    customerName = _databaseService.GetCustomerNameByOrganisation(projectActivity.CustomerId, projectActivity.CompanyId);
            //}

            string projectName = projectActivity.Activity;

            //Get the name on salesperson responsible
            salesNameList.Add(await Task.Run(() => GetNameFromAdBasedOnId(projectActivity.CompanyResponsible)));

            //We might have more then one salesperson
            if (projectActivity.CompanyResponsible2 != "Ingen vald")
            {
                salesNameList.Add(await Task.Run(() => GetNameFromAdBasedOnId(projectActivity.CompanyResponsible2)));

                //If we have more then two salesperson we add them here.
                salesNameList.AddRange(_databaseService.GetSalesNameOnProjectId(projectActivity.ProjectId));
            }

            body = $"Projektet: {projectName} är Klart med resultat {resultat}. Kund/Kundgrupp: {customerName}. Projektet har följande säljare {string.Join(" ", salesNameList)}";

            var logicAppUrl = "https://prod2-03.swedencentral.logic.azure.com:443/workflows/2db54eb9baa84b2aa4620cb53d5c42cb/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RxIeNOhEjgUHqEAZ_3VzDIxRN8-ZNEAVUhO-FsJlk24";

            foreach (var email in emailList)
            {
                var serializeEmailData = JsonSerializer.Serialize(new DataForEmail { Email = email.Email, BodyContent = body, Title = "Notis från SäljAppen", CustomerName = customerName });
                var stringContent = new StringContent(serializeEmailData, Encoding.UTF8, "application/json");
                var response = await new HttpClient().PostAsync(logicAppUrl, stringContent);
            }
        }


        private async Task<string> GetNameFromAdBasedOnId(string Id)
        {
            var adGroups = await _graphService.GetGroupsByUserAsync(Guid.Parse(User.Id()));
            var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();
            var members = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());
            return members.Where(e => e.Id == Id).Select(e => e.Name).FirstOrDefault();
        }


        public async Task<List<AdMember>> GetAdMembersMail(List<string> admins)
        {
            var adGroups = await _graphService.GetGroupsByUserAsync(Guid.Parse(User.Id()));
            var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();
            var members = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());
            return members.Where(member => admins.Contains(member.Id)).ToList();
        }


        public async Task<List<AdMember>> GetAdMembers()
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

            members.Sort((x, y) => string.Compare(x.Name, y.Name));

            return members;
        }

        public async Task<List<ProjectActivity>> GetAllProjectsForSalesman(string companyId, string userId)
        {
            var projects = _databaseService.GetAllProjectsForSalesman(companyId, userId);

            var users = await GetAdMembers();

            foreach (var project in projects)
            {
                project.CompanyResponsible = users.Where(e => e.Id == project.CompanyResponsible).FirstOrDefault().Name;
                if (project.CompanyResponsible2 != "Ingen vald")
                {
                    try
                    {
                        project.CompanyResponsible2 = users.Where(e => e.Id == project.CompanyResponsible2).FirstOrDefault().Name;
                    }
                    catch
                    {
                        project.CompanyResponsible2 = "Ingen vald"; // Kan inträffa om säljaren är borttagen från SäljAppen
                    }
                }
            }

            return projects.OrderByDescending(d => d.LastSaved).ToList();
        }

        public async Task<List<ProjectWithMeetingsIncluded>> GetAllProjectsForSalesmanFiltered(string companyId, string userId, string fromDate, string toDate, string status)
        {
            var projects = _databaseService.GetAllProjectsForSalesmanFiltered(companyId, userId, fromDate, toDate, status);
            var customerMeetings = _databaseService.GetAllMeetings(companyId);

            var users = await GetAdMembers();

            var list = new List<ProjectWithMeetingsIncluded>();
            foreach (var project in projects)
            {
                project.CompanyResponsible = users.Where(e => e.Id == project.CompanyResponsible).FirstOrDefault().Name;
                if (project.CompanyResponsible2 != "Ingen vald")
                {
                    try
                    {
                        project.CompanyResponsible2 = users.Where(e => e.Id == project.CompanyResponsible2).FirstOrDefault().Name;
                    }
                    catch
                    {
                        project.CompanyResponsible2 = "Ingen vald"; // Kan inträffa om säljaren är borttagen från SäljAppen
                    }
                }

                list.Add(new ProjectWithMeetingsIncluded()
                {
                    CompanyId = project.CompanyId,
                    CustomerId = project.CustomerId,
                    Date = project.Date,
                    Activity = project.Activity,
                    Description = project.Description,
                    CompanyResponsible = project.CompanyResponsible,
                    CustomerContact = project.CustomerContact,
                    Status = project.Status,
                    NextStep = project.NextStep,
                    WeekNumber = project.WeekNumber,
                    CustomerName = project.CustomerName,
                    CompanyResponsible2 = project.CompanyResponsible2,
                    ProjectId = project.ProjectId,
                    LastSaved = project.LastSaved,
                    Priority = project.Priority,
                    CampaignId = project.CampaignId,
                    CustomerMeetings = customerMeetings.Where(e => e.ProjectId == project.ProjectId).ToList()
                });
            }

            return list.OrderByDescending(d => d.LastSaved).ToList();
        }

        public bool RemoveProject(string projectId)
        {
            return _databaseService.RemoveProject(projectId);
        }

        public List<ReactMultiSelectValue> GetSelectedCompanyResponsiblesForProject(string projectId)
        {
            var companyResponsibles = _databaseService.GetSelectedCompanyResponsiblesForProject(projectId);

            companyResponsibles.Sort((x, y) => string.Compare(x.ContactName, y.ContactName));

            var list = new List<ReactMultiSelectValue>();


            foreach (var mem in companyResponsibles)
            {

                list.Add(new ReactMultiSelectValue
                {
                    label = mem.ContactName,
                    value = mem.Id
                });
            }

            return list;
        }

        public class FileInfo
        {
            public int Id { get; set; }
            public string FileName { get; set; }
            public byte[] FileData { get; set; }
            public string FileType { get; set; }
            public DateTime UploadDate { get; set; }
        }
    }

    public class ProjectWithMeetingsIncluded : ProjectActivity
    {
        public List<CustomerMeeting> CustomerMeetings { get; set; }
    }
}
