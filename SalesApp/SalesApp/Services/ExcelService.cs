using SalesApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using OfficeOpenXml;
using ClosedXML.Excel;

namespace SalesApp.Services
{
    public class ExcelService
    {
        private readonly SalesAppContext _dbContext;

        public ExcelService(SalesAppContext dbContext)
        {
            _dbContext = dbContext;
        }

        internal string CreateMeetingsFile(List<CustomerMeeting> meetings, List<ProjectActivity> projects, string type, string value, string companyId)
        {
            try
            {
                meetings.Sort((x, y) => y.Date.CompareTo(x.Date));
                var company = _dbContext.Companies.FirstOrDefault(e => e.Id == companyId);

                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add("Aktiviteter");

                    worksheet.Cell("A1").Value = "Översikt kundaktivitet";
                    worksheet.Cell("B1").Value = type + ":" + value;

                    worksheet.Cell("A2").Value = "Datum";
                    worksheet.Cell("B2").Value = "Deltagare";
                    worksheet.Cell("C2").Value = "Typ";
                    worksheet.Cell("D2").Value = "Resultat";
                    worksheet.Cell("E2").Value = "Kommentar";
                    worksheet.Cell("F2").Value = "Övrig kommentar";
                    worksheet.Cell("G2").Value = "Kund";

                    int i = 3;
                    foreach (var meeting in meetings)
                    {
                        worksheet.Cell("A" + i).Value = meeting.Date.ToString("yyyy-MM-dd");
                        worksheet.Cell("B" + i).Value = meeting.ContactName;
                        worksheet.Cell("C" + i).Value = meeting.TypeOfMeeting;
                        worksheet.Cell("D" + i).Value = meeting.ResultOfMeeting;
                        worksheet.Cell("E" + i).Value = meeting.Comments;
                        worksheet.Cell("F" + i).Value = meeting.MiscExplanation;
                        worksheet.Cell("G" + i).Value = meeting.CustomerName;

                        i++;
                    }

                    if (company.Id != "23c5b39f-6ea9-4e9b-b20a-27606982c79e")
                    {
                        var worksheetProjects = workbook.Worksheets.Add("Projekt");

                        worksheetProjects.Cell("A1").Value = "Översikt projekt";
                        worksheetProjects.Cell("B1").Value = type + ":" + value;

                        worksheetProjects.Cell("A2").Value = "Datum";
                        worksheetProjects.Cell("B2").Value = "ProjektNamn";
                        worksheetProjects.Cell("C2").Value = "Beskrivning";
                        worksheetProjects.Cell("D2").Value = "Kontakt";
                        worksheetProjects.Cell("E2").Value = "Status";
                        worksheetProjects.Cell("F2").Value = "Nästa steg";
                        worksheetProjects.Cell("G2").Value = "Kund";

                        int x = 3;
                        foreach (var project in projects)
                        {
                            worksheetProjects.Cell("A" + x).Value = project.Date.ToString("yyyy-MM-dd");
                            worksheetProjects.Cell("B" + x).Value = project.Activity;
                            worksheetProjects.Cell("C" + x).Value = project.Description;
                            worksheetProjects.Cell("D" + x).Value = project.CustomerContact;
                            worksheetProjects.Cell("E" + x).Value = project.Status;
                            worksheetProjects.Cell("F" + x).Value = project.NextStep;
                            worksheetProjects.Cell("G" + x).Value = project.CustomerName;

                            x++;
                        }
                    }

                    var fileName = "Protokoll__" + company.Name + "_" + DateTime.Now.ToString("yyyy-MM-dd") + ".xlsx";
                    workbook.SaveAs(fileName);

                    return fileName;
                }
            }
            catch (Exception e)
            {
                return string.Empty;
            }

        }

        internal async Task<string> CreateOverviewFileForAllSalesmen(List<ProjectActivity> projects, List<CustomerMeeting> meetings, List<ProspectMeeting> prospectMeetings, Company company, List<AdMember> salesmen, List<CustomerContact> contacts, List<ProspectContact> prospectContacts)
        {
            try
            {
                projects.Sort((x, y) => y.Date.CompareTo(x.Date));

                using (var workbook = new XLWorkbook())
                {
                    var sheet = workbook.Worksheets.Add("Aktiviteter");

                    var range = sheet.Range("A1:G1");
                    range.Style.Font.Bold = true;

                    sheet.Cell("A1").Value = "Datum";
                    sheet.Cell("B1").Value = "Deltagare";
                    sheet.Cell("C1").Value = "Typ";
                    sheet.Cell("D1").Value = "Resultat";
                    sheet.Cell("E1").Value = "Kommentar";
                    sheet.Cell("F1").Value = "Säljare";
                    sheet.Cell("G1").Value = "Kund";

                    int i = 2;
                    foreach (var meeting in meetings)
                    {
                        sheet.Cell("A" + i).Value = meeting.Date.ToString("yyyy-MM-dd");
                        try
                        {
                            if (meeting.ContactName == "Leverantör/Partner")
                            {
                                sheet.Cell("B" + i).Value = "Leverantör/Partner";
                            }
                            else if (meeting.ContactName == "Ingen vald")
                            {
                                sheet.Cell("B" + i).Value = "Ingen vald";
                            }
                            else
                            {
                                sheet.Cell("B" + i).Value = contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().LastName;
                            }
                        }
                        catch
                        {
                            sheet.Cell("B" + i).Value = "Kontakt borttagen";
                        }

                        sheet.Cell("C" + i).Value = meeting.TypeOfMeeting;
                        sheet.Cell("D" + i).Value = meeting.ResultOfMeeting;
                        sheet.Cell("E" + i).Value = meeting.Comments;
                        sheet.Cell("F" + i).Value = salesmen.Where(e => e.Id == meeting.CompanyResponsible).FirstOrDefault().Name;
                        sheet.Cell("G" + i).Value = meeting.CustomerName;

                        i++;
                    }

                    var sheetProspect = workbook.Worksheets.Add("Prospekt-aktiviteter");

                    var rangeProspect = sheetProspect.Range("A1:G1");
                    rangeProspect.Style.Font.Bold = true;

                    sheetProspect.Cell("A1").Value = "Datum";
                    sheetProspect.Cell("B1").Value = "Deltagare";
                    sheetProspect.Cell("C1").Value = "Typ";
                    sheetProspect.Cell("D1").Value = "Resultat";
                    sheetProspect.Cell("E1").Value = "Kommentar";
                    sheetProspect.Cell("F1").Value = "Säljare";
                    sheetProspect.Cell("G1").Value = "Prospekt";

                    int iProspect = 2;
                    foreach (var meeting in prospectMeetings)
                    {
                        sheetProspect.Cell("A" + iProspect).Value = meeting.Date.ToString("yyyy-MM-dd");
                        try
                        {
                            if (meeting.ContactName == "Leverantör/Partner")
                            {
                                sheetProspect.Cell("B" + iProspect).Value = "Leverantör/Partner";
                            }
                            else
                            {
                                sheetProspect.Cell("B" + iProspect).Value = prospectContacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().FirstName + " " + prospectContacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().LastName;
                            }
                        }
                        catch
                        {
                            sheetProspect.Cell("B" + iProspect).Value = "Kontakt borttagen";
                        }

                        sheetProspect.Cell("C" + iProspect).Value = meeting.TypeOfMeeting;
                        sheetProspect.Cell("D" + iProspect).Value = meeting.ResultOfMeeting;
                        sheetProspect.Cell("E" + iProspect).Value = meeting.Comments;
                        sheetProspect.Cell("F" + iProspect).Value = salesmen.Where(e => e.Id == meeting.CompanyResponsible).FirstOrDefault().Name;
                        sheetProspect.Cell("G" + iProspect).Value = meeting.ProspectName;

                        iProspect++;
                    }

                    if (company.Id != "23c5b39f-6ea9-4e9b-b20a-27606982c79e")
                    {
                        var projectSheet = workbook.Worksheets.Add("Projektaktiviteter");

                        var r = projectSheet.Range("A1:H1");
                        r.Style.Font.Bold = true;

                        projectSheet.Cell("A1").Value = "Datum";
                        projectSheet.Cell("B1").Value = "Aktivitet";
                        projectSheet.Cell("C1").Value = "Beskrivning";
                        projectSheet.Cell("D1").Value = "Kontakt";
                        projectSheet.Cell("E1").Value = "Status";
                        projectSheet.Cell("F1").Value = "Nästa steg";
                        projectSheet.Cell("G1").Value = "Säljare";
                        projectSheet.Cell("H1").Value = "Kund";

                        int x = 2;
                        foreach (var project in projects)
                        {
                            projectSheet.Cell("A" + x).Value = project.Date.ToString("yyyy-MM-dd");
                            projectSheet.Cell("B" + x).Value = project.Activity;
                            projectSheet.Cell("C" + x).Value = project.Description;
                            try
                            {
                                projectSheet.Cell("D" + x).Value = contacts.Where(e => e.Id == project.CustomerContact).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == project.CustomerContact).FirstOrDefault().LastName;
                            }
                            catch
                            {
                                projectSheet.Cell("D" + x).Value = "Kontakt borttagen";
                            }
                            projectSheet.Cell("E" + x).Value = project.Status;
                            projectSheet.Cell("F" + x).Value = project.NextStep;
                            try
                            {
                                projectSheet.Cell("G" + x).Value = salesmen.Where(e => e.Id == project.CompanyResponsible).FirstOrDefault().Name;
                            }
                            catch
                            {
                                projectSheet.Cell("G" + x).Value = "Säljare borttagen";
                            }
                            projectSheet.Cell("H" + x).Value = project.CustomerName;

                            x++;
                        }
                    }

                    if(company.Id == "23c5b39f-6ea9-4e9b-b20a-27606982c79e")
                    {
                        foreach(var salesman in salesmen)
                        {
                            var salesmanSheet = workbook.Worksheets.Add(salesman.Name);

                            var ran = salesmanSheet.Range("A1:G1");
                            ran.Style.Font.Bold = true;

                            salesmanSheet.Cell("A1").Value = "Datum";
                            salesmanSheet.Cell("B1").Value = "Deltagare";
                            salesmanSheet.Cell("C1").Value = "Typ";
                            salesmanSheet.Cell("D1").Value = "Resultat";
                            salesmanSheet.Cell("E1").Value = "Kommentar";
                            salesmanSheet.Cell("F1").Value = "Säljare";
                            salesmanSheet.Cell("G1").Value = "Kund";

                            int index = 2;
                            var salesmanMeetings = meetings.Where(e => e.CompanyResponsible == salesman.Id).ToList();
                            foreach (var meeting in salesmanMeetings)
                            {
                                salesmanSheet.Cell("A" + index).Value = meeting.Date.ToString("yyyy-MM-dd");
                                if(meeting.ContactName == "Leverantör/Partner")
                                {
                                    salesmanSheet.Cell("B" + index).Value = meeting.ContactName;
                                }
                                else
                                {
                                    salesmanSheet.Cell("B" + index).Value = contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().LastName;
                                }
                                salesmanSheet.Cell("C" + index).Value = meeting.TypeOfMeeting;
                                salesmanSheet.Cell("D" + index).Value = meeting.ResultOfMeeting;
                                salesmanSheet.Cell("E" + index).Value = meeting.Comments;
                                salesmanSheet.Cell("F" + index).Value = salesmen.Where(e => e.Id == meeting.CompanyResponsible).FirstOrDefault().Name;
                                salesmanSheet.Cell("G" + index).Value = meeting.CustomerName;

                                index++;
                            }
                        }
                    }

                    var fileName = "Överblicksbild_" + company.Name + "_" + DateTime.Now.ToString("yyyy-MM-dd");
                    workbook.SaveAs(fileName + ".xlsx");

                    return fileName;
                }
            }
            catch
            {
                return string.Empty;
            }
        }

        internal async Task<string> CreateOverviewFile(List<ProjectActivity> projects, List<CustomerMeeting> meetings, List<ProspectMeeting> prospectMeetings, Company company, string salesman, List<AdMember> salesmen, List<CustomerContact> contacts, List<ProspectContact> prospectContacts)
        {
            try
            {
                projects.Sort((x, y) => y.Date.CompareTo(x.Date));

                using (var workbook = new XLWorkbook())
                {
                    var sheet = workbook.Worksheets.Add("Aktiviteter");

                    var range = sheet.Range("A1:G1");
                    range.Style.Font.Bold = true;

                    sheet.Cell("A1").Value = "Datum";
                    sheet.Cell("B1").Value = "Deltagare";
                    sheet.Cell("C1").Value = "Typ";
                    sheet.Cell("D1").Value = "Resultat";
                    sheet.Cell("E1").Value = "Kommentar";
                    sheet.Cell("F1").Value = "Övrig kommentar";
                    sheet.Cell("G1").Value = "Kund";

                    int i = 2;
                    foreach (var meeting in meetings)
                    {
                        sheet.Cell("A" + i).Value = meeting.Date.ToString("yyyy-MM-dd");
                        try
                        {
                            if (meeting.ContactName == "Leverantör/Partner")
                            {
                                sheet.Cell("B" + i).Value = "Leverantör/Partner";
                            }
                            else if (meeting.ContactName == "Ingen vald")
                            {
                                sheet.Cell("B" + i).Value = "Ingen vald";
                            }
                            else
                            {
                                sheet.Cell("B" + i).Value = contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().LastName;
                            }
                        }
                        catch
                        {
                            sheet.Cell("B" + i).Value = "Kontakt borttagen";
                        }
                        sheet.Cell("C" + i).Value = meeting.TypeOfMeeting;
                        sheet.Cell("D" + i).Value = meeting.ResultOfMeeting;
                        sheet.Cell("E" + i).Value = meeting.Comments;
                        sheet.Cell("F" + i).Value = meeting.MiscExplanation;
                        sheet.Cell("G" + i).Value = meeting.CustomerName;

                        i++;
                    }

                    var sheetProspect = workbook.Worksheets.Add("Prospekt-aktiviteter");

                    var rangeProspect = sheetProspect.Range("A1:G1");
                    rangeProspect.Style.Font.Bold = true;

                    sheetProspect.Cell("A1").Value = "Datum";
                    sheetProspect.Cell("B1").Value = "Deltagare";
                    sheetProspect.Cell("C1").Value = "Typ";
                    sheetProspect.Cell("D1").Value = "Resultat";
                    sheetProspect.Cell("E1").Value = "Kommentar";
                    sheetProspect.Cell("F1").Value = "Prospekt";

                    int iProspect = 2;
                    foreach (var meeting in prospectMeetings)
                    {
                        sheetProspect.Cell("A" + iProspect).Value = meeting.Date.ToString("yyyy-MM-dd");
                        try
                        {
                            if (meeting.ContactName == "Leverantör/Partner")
                            {
                                sheetProspect.Cell("B" + iProspect).Value = "Leverantör/Partner";
                            }
                            else
                            {
                                sheetProspect.Cell("B" + iProspect).Value = prospectContacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().FirstName + " " + prospectContacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().LastName;
                            }
                        }
                        catch
                        {
                            sheetProspect.Cell("B" + iProspect).Value = "Kontakt borttagen";
                        }
                        sheetProspect.Cell("C" + iProspect).Value = meeting.TypeOfMeeting;
                        sheetProspect.Cell("D" + iProspect).Value = meeting.ResultOfMeeting;
                        sheetProspect.Cell("E" + iProspect).Value = meeting.Comments;
                        sheetProspect.Cell("F" + iProspect).Value = meeting.ProspectName;

                        iProspect++;
                    }

                    if (company.Id != "23c5b39f-6ea9-4e9b-b20a-27606982c79e")
                    {
                        var projectSheet = workbook.Worksheets.Add("Projektaktiviteter");

                        var r = projectSheet.Range("A1:H1");
                        r.Style.Font.Bold = true;

                        projectSheet.Cell("A1").Value = "Datum";
                        projectSheet.Cell("B1").Value = "Aktivitet";
                        projectSheet.Cell("C1").Value = "Beskrivning";
                        projectSheet.Cell("D1").Value = "Kontakt";
                        projectSheet.Cell("E1").Value = "Status";
                        projectSheet.Cell("F1").Value = "Nästa steg";
                        projectSheet.Cell("G1").Value = "Kund";

                        int x = 2;
                        foreach (var project in projects)
                        {
                            projectSheet.Cell("A" + x).Value = project.Date.ToString("yyyy-MM-dd");
                            projectSheet.Cell("B" + x).Value = project.Activity;
                            projectSheet.Cell("C" + x).Value = project.Description;
                            try
                            {
                                projectSheet.Cell("D" + x).Value = contacts.Where(e => e.Id == project.CustomerContact).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == project.CustomerContact).FirstOrDefault().LastName;
                            }
                            catch
                            {
                                projectSheet.Cell("D" + x).Value = "Kontakt borttagen";
                            }
                            projectSheet.Cell("E" + x).Value = project.Status;
                            projectSheet.Cell("F" + x).Value = project.NextStep;
                            projectSheet.Cell("G" + x).Value = project.CustomerName;

                            x++;
                        }
                    }

                    var fileName = "Överblicksbild_" + company.Name + "_" + DateTime.Now.ToString("yyyy-MM-dd");
                    workbook.SaveAs(fileName + ".xlsx");

                    return fileName;
                }
            }
            catch
            {
                return string.Empty;
            }

        }
    }
}
