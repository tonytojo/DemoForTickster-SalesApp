using IronXL;
using Microsoft.AspNetCore.Mvc;
using SalesApp.Extensions;
using SalesApp.Models;
using SalesApp.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Controllers
{
    public class ExcelController : Controller
    {
        private DatabaseService _databaseService { get; set; }
        private ExcelService _excelService { get; set; }
        private GraphService _graphService;

        public ExcelController(DatabaseService databaseService, ExcelService excelService, GraphService graphService)
        {
            _databaseService = databaseService;
            _excelService = excelService;
            _graphService = graphService;
        }

        public string CreateAndDownloadMeetingsFile(string companyId, string type, string value)
        {
            var meetings = _databaseService.GetMeetingsForSalesman(User.Id(), type, value);
            var projects = _databaseService.GetProjectsForSalesmanAndWeek(User.Id(), type, value, companyId);

            if (meetings.Count > 0 || projects.Count > 0)
            {
                return _excelService.CreateMeetingsFile(meetings, projects, type, value, companyId);
            }
            else
            {
                return string.Empty;
            }
        }

        public async Task<string> CreateOverviewFile(string companyId, string salesman, string dateFrom, string dateTo, string meetingResult, string projectStatus)
        {
            var salesmen = await GetAdMembers();
            var contacts = _databaseService.GetAllContacts(companyId);
            var prospectContacts = _databaseService.GetAllProspectContacts(companyId);

            DateTime? fromDate = !string.IsNullOrEmpty(dateFrom) ? DateTime.Parse(dateFrom) : (DateTime?)null;
            DateTime? toDate = !string.IsNullOrEmpty(dateTo) ? DateTime.Parse(dateTo) : (DateTime?)null;

            if (salesman == "Alla")
            {
                var projects = _databaseService.GetAllProjects(companyId);
                var meetings = _databaseService.GetAllMeetings(companyId);
                var prospectMeetings = _databaseService.GetAllProspectMeetingsForCompany(companyId);

                var filteredProjects = projects.Where(p => !fromDate.HasValue || p.Date >= fromDate.Value)
                                              .Where(p => !toDate.HasValue || p.Date <= toDate.Value)
                                              .ToList();

                var filteredMeetings = meetings.Where(m => !fromDate.HasValue || m.Date >= fromDate.Value)
                                              .Where(m => !toDate.HasValue || m.Date <= toDate.Value)
                                              .ToList();

                var filteredProspectMeetings = prospectMeetings.Where(m => !fromDate.HasValue || m.Date >= fromDate.Value)
                                                .Where(m => !toDate.HasValue || m.Date <= toDate.Value)
                                                .ToList();

                if (projectStatus != "Alla")
                {
                    filteredProjects = filteredProjects.Where(e => e.Status == projectStatus).ToList();
                }

                if (meetingResult != "Alla")
                {
                    filteredMeetings = filteredMeetings.Where(e => e.ResultOfMeeting == meetingResult).ToList();
                    filteredProspectMeetings = filteredProspectMeetings.Where(e => e.ResultOfMeeting == meetingResult).ToList();
                }

                if (filteredProjects.Count > 0 || filteredMeetings.Count > 0)
                {
                    var company = _databaseService.GetCompanyById(companyId);
                    return await _excelService.CreateOverviewFileForAllSalesmen(filteredProjects, filteredMeetings, filteredProspectMeetings, company, salesmen, contacts, prospectContacts);
                }
                else
                {
                    return string.Empty;
                }
            }
            else
            {
                var salesmanName = salesmen.FirstOrDefault(e => e.Id == salesman)?.Name;
                var projects = _databaseService.GetProjectsForSalesman(companyId, salesman)
                                               .Where(p => !fromDate.HasValue || p.Date >= fromDate.Value)
                                               .Where(p => !toDate.HasValue || p.Date <= toDate.Value)
                                               .OrderBy(o => o.Date)
                                               .ToList();

                var meetings = _databaseService.GetMeetingsForSalesman(companyId, salesman)
                                               .Where(m => !fromDate.HasValue || m.Date >= fromDate.Value)
                                               .Where(m => !toDate.HasValue || m.Date <= toDate.Value)
                                               .OrderBy(o => o.Date)
                                               .ToList();

                var prospectMeetings = _databaseService.GetProspectMeetingsForSalesman(companyId, salesman)
                                           .Where(m => !fromDate.HasValue || m.Date >= fromDate.Value)
                                           .Where(m => !toDate.HasValue || m.Date <= toDate.Value)
                                           .OrderBy(o => o.Date)
                                           .ToList();

                if (projectStatus != "Alla")
                {
                    projects = projects.Where(e => e.Status == projectStatus).ToList();
                }

                if (meetingResult != "Alla")
                {
                    meetings = meetings.Where(e => e.ResultOfMeeting == meetingResult).ToList();
                    prospectMeetings = prospectMeetings.Where(e => e.ResultOfMeeting == meetingResult).ToList();
                }

                if (projects.Count > 0 || meetings.Count > 0)
                {
                    var company = _databaseService.GetCompanyById(companyId);
                    return await _excelService.CreateOverviewFile(projects, meetings, prospectMeetings, company, salesmanName, salesmen, contacts, prospectContacts);
                }
                else
                {
                    return string.Empty;
                }
            }
        }

        public async Task<List<AdMember>> GetAdMembers()
        {
            var currentUserId = Guid.Parse(User.Id());
            var adGroups = await _graphService.GetGroupsByUserAsync(currentUserId);

            var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault(); // Byt till företags specifik

            var members = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());

            string hostHeader = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            if (!hostHeader.Contains("localhost"))
            {
                members.RemoveAll(s => /*s.Name == "Tommie Karlsson" ||*/ s.Name == "Niklas Forsberg" || s.Name == "Daniel Rönning" || s.Name == "Anton Eriksson" || s.Name == "QBIM Admin" || s.Name == "Niklas Lindberg" || s.Name == "Åsa Säfström");
            }

            members.Sort((x, y) => string.Compare(x.Name, y.Name));

            return members;
        }

        public async Task<IActionResult> Download(string filename)
        {
            if (filename == null)
                return Content("filename not present");

            var path = Path.Combine(
                           Directory.GetCurrentDirectory(),
                           "", filename);

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(path), Path.GetFileName(path));
        }

        public async Task<bool> DeleteFile(string filename)
        {
            try
            {
                string fileName = ("" + filename + ".xlsx");

                if (fileName != null || fileName != string.Empty)
                {
                    if ((System.IO.File.Exists(fileName)))
                    {
                        System.IO.File.Delete(fileName);

                        return true;
                    }
                    return false;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }

        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
        {
            {".txt", "text/plain"},
            {".pdf", "application/pdf"},
            {".doc", "application/vnd.ms-word"},
            {".docx", "application/vnd.ms-word"},
            {".xls", "application/vnd.ms-excel"},
            {".xlsx", "application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet"},  
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
    }
}
