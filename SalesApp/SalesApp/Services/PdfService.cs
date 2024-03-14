using IronXL;
using iTextSharp.text;
using iTextSharp.text.pdf;
using SalesApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Services
{
    public class PdfService
    {
        private readonly SalesAppContext _dbContext;

        public PdfService(SalesAppContext dbContext)
        {
            _dbContext = dbContext;
        }

        internal async Task<string> CreateMeetingsFile(List<CustomerMeeting> meetings, List<ProjectActivity> projects, Company company, string salesman, string type, string value, List<CustomerContact> contacts)
        {
            try
            {
                meetings.Sort((x, y) => y.Date.CompareTo(x.Date));
                var dateHeader = "";
                if(type == "Vecka")
                {
                    dateHeader = "Veckoprotokoll";
                }
                if (type == "Månad")
                {
                    dateHeader = "Månadsprotokoll";
                }
                if (type == "År")
                {
                    dateHeader = "Årsprotokoll";
                }
                var fileName = dateHeader + " " + company.Name + "_" + DateTime.Now.ToString("yyyy-MM-dd");
                FileStream fs = new FileStream("" +fileName+".pdf", FileMode.Create, FileAccess.Write, FileShare.None);
                BaseFont bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
                Font fontTitle = new Font(bf, 10, Font.BOLD);
                Font font = new Font(bf, 10, Font.NORMAL);
                Document doc = new Document();
                PdfWriter writer = PdfWriter.GetInstance(doc, fs);
                doc.Open();

                var pic = await GetLogo(company);
                doc.Add(pic);

                var title = await CreateParagraph(dateHeader, 32, Element.ALIGN_CENTER);
                doc.Add(title);

                var salesmanParagrapgh = await CreateParagraph(salesman, 16, Element.ALIGN_CENTER);
                doc.Add(salesmanParagrapgh);

                var salesmanParagrapghDate = await CreateParagraph (type+": " + value, 16, Element.ALIGN_LEFT);
                doc.Add(salesmanParagrapghDate);

                //var total = meetings.Sum(item => item.KilometersDriven);
                //var salesmanParagrapghKilometers = await CreateParagraph("Antal körda km: " + total, 16, Element.ALIGN_LEFT);
                //doc.Add(salesmanParagrapghKilometers);

                //if (type == "Vecka")
                //{
                //    if(total != null)
                //    {
                //        var avg = ((float)total / 7);
                //        var v = Math.Round(avg, 2);
                //        var salesmanParagraphAvgDay = await CreateParagraph("Medelsnitt km per dag: " + v, 16, Element.ALIGN_LEFT);
                //        doc.Add(salesmanParagraphAvgDay);
                //    }
                //}
                //if (type == "Månad")
                //{
                //    if (total != null)
                //    {
                //        var avgV = ((float)total / 4);
                //        var vV = Math.Round(avgV, 2);
                //        var salesmanParagraphAvgWeek = await CreateParagraph("Medelsnitt km per vecka: " + vV, 16, Element.ALIGN_LEFT);
                //        doc.Add(salesmanParagraphAvgWeek);

                //        var avg = ((float)total / 30);
                //        var v = Math.Round(avg, 2);
                //        var salesmanParagraphAvgDay = await CreateParagraph("Medelsnitt km per dag: " + v, 16, Element.ALIGN_LEFT);
                //        doc.Add(salesmanParagraphAvgDay);
                //    }
                //}
                //if (type == "År")
                //{
                //    if (total != null)
                //    {
                //        var avgM = ((float)total / 12);
                //        var vM = Math.Round(avgM, 2);
                //        var salesmanParagraphAvgMonth = await CreateParagraph("Medelsnitt km per månad: " + vM, 16, Element.ALIGN_LEFT);
                //        doc.Add(salesmanParagraphAvgMonth);

                //        var avgV = ((float)total / 52);
                //        var vV = Math.Round(avgV, 2);
                //        var salesmanParagraphAvgWeek = await CreateParagraph("Medelsnitt km per vecka: " + vV, 16, Element.ALIGN_LEFT);
                //        doc.Add(salesmanParagraphAvgWeek);

                //        var avg = ((float)total / 365);
                //        var v = Math.Round(avg, 2);
                //        var salesmanParagraphAvgDay = await CreateParagraph("Medelsnitt km per dag: " + v, 16, Element.ALIGN_LEFT);
                //        doc.Add(salesmanParagraphAvgDay);
                //    }
                //}

                var meetingsTable = CreateMeetingsTable(meetings, contacts);
                var meetingParagrapgh = await CreateParagraph("Kundaktiviteter", 16, Element.ALIGN_CENTER);
                doc.Add(meetingParagrapgh);
                doc.Add(meetingsTable);

                if(company.Id != "23c5b39f-6ea9-4e9b-b20a-27606982c79e")
                {
                    var projectsTable = CreateProjectsTable(projects, contacts);
                    var projectsParagrapgh = await CreateParagraph("Projektaktiviteter", 16, Element.ALIGN_CENTER);
                    doc.Add(projectsParagrapgh);
                    doc.Add(projectsTable);
                    doc.Close();
                }

                return fileName;
            }
            catch(Exception e)
            {
                return string.Empty;
            }
        }

        internal async Task<string> CreateOverviewFileForAllSalesmen(List<ProjectActivity> projects, List<CustomerMeeting> meetings, List<ProspectMeeting> prospectMeetings, Company company, List<AdMember> salesmen, List<CustomerContact> contacts, List<ProspectContact> prospectContacts)
        {
            var fileName = "Överblicksbild_" + company.Name + "_" + DateTime.Now.ToString("yyyy-MM-dd");
            FileStream fs = new FileStream("" + fileName + ".pdf", FileMode.Create, FileAccess.Write, FileShare.None);
            Document doc = new Document();
            PdfWriter writer = PdfWriter.GetInstance(doc, fs);
            doc.Open();

            var pic = await GetLogo(company);
            doc.Add(pic);

            var title = await CreateParagraph("Överblick", 32, Element.ALIGN_CENTER);
            doc.Add(title);

            if (company.Id != "23c5b39f-6ea9-4e9b-b20a-27606982c79e")
            {
                var projectsParagraph = await CreateParagraph("Projektaktiviteter", 20, Element.ALIGN_CENTER);
                doc.Add(projectsParagraph);
                projects.Sort((x, y) => DateTime.Compare(y.Date, x.Date));
                var projectsTable = CreateProjectsTableAllSalesmen(projects, contacts, salesmen);
                doc.Add(projectsTable);
            }

            var meetingsParagraph = await CreateParagraph("Aktiviteter", 20, Element.ALIGN_CENTER);
            doc.Add(meetingsParagraph);
            meetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));
            var meetingsTable = CreateMeetingsTableAllSalesmen(meetings, contacts, salesmen);
            doc.Add(meetingsTable);

            var meetingsProspectParagraph = await CreateParagraph("Prospekt-aktiviteter", 20, Element.ALIGN_CENTER);
            doc.Add(meetingsProspectParagraph);
            prospectMeetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));
            var meetingsProspectTable = CreateProspectMeetingsTableAllSalesmen(prospectMeetings, prospectContacts, salesmen);
            doc.Add(meetingsProspectTable);

            doc.Close();

            return fileName;
        }

        private PdfPTable CreateMeetingsTableAllSalesmen(List<CustomerMeeting> meetings, List<CustomerContact> contacts, List<AdMember> salesmen)
        {
            BaseFont bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            Font fontTitle = new Font(bf, 9, iTextSharp.text.Font.BOLD);
            Font font = new Font(bf, 7, iTextSharp.text.Font.NORMAL);

            PdfPTable table = new PdfPTable(6);
            table.SpacingBefore = 20f;

            PdfPCell cellTitle = new PdfPCell(new Phrase("Datum", fontTitle));
            table.AddCell(cellTitle);

            PdfPCell cellCTitle = new PdfPCell(new Phrase("Kund", fontTitle));
            table.AddCell(cellCTitle);

            PdfPCell cell2Title = new PdfPCell(new Phrase("Kontakt", fontTitle));
            table.AddCell(cell2Title);

            PdfPCell cell3Title = new PdfPCell(new Phrase("Typ", fontTitle));
            table.AddCell(cell3Title);

            PdfPCell cell4Title = new PdfPCell(new Phrase("Resultat", fontTitle));
            table.AddCell(cell4Title);

            //PdfPCell cell5Title = new PdfPCell(new Phrase("Kommentar", fontTitle));
            //table.AddCell(cell5Title);

            PdfPCell cell6Title = new PdfPCell(new Phrase("Säljare", fontTitle));
            table.AddCell(cell6Title);

            foreach (var meeting in meetings)
            {
                PdfPCell cell = new PdfPCell(new Phrase(meeting.Date.ToString("yyyy-MM-dd"), font));
                table.AddCell(cell);

                PdfPCell cellC = new PdfPCell(new Phrase(meeting.CustomerName, font));
                table.AddCell(cellC);

                try
                {
                    if (meeting.ContactName == "Leverantör/Partner")
                    {
                        PdfPCell cell2 = new PdfPCell(new Phrase("Leverantör/Partner", font));
                        table.AddCell(cell2);
                    }
                    else if (meeting.ContactName == "Ingen vald")
                    {
                        PdfPCell cell2 = new PdfPCell(new Phrase("Ingen vald", font));
                        table.AddCell(cell2);
                    }
                    else
                    {
                        PdfPCell cell2 = new PdfPCell(new Phrase(contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().LastName, font));
                        table.AddCell(cell2);
                    }
                }
                catch
                {
                    PdfPCell cell2 = new PdfPCell(new Phrase("Kontakt borttagen", font));
                    table.AddCell(cell2);
                }

                PdfPCell cell3 = new PdfPCell(new Phrase(meeting.TypeOfMeeting, font));
                table.AddCell(cell3);

                PdfPCell cell4 = new PdfPCell(new Phrase(meeting.ResultOfMeeting, font));
                table.AddCell(cell4);

                //PdfPCell cell5 = new PdfPCell(new Phrase(meeting.Comments, font));
                //table.AddCell(cell5);

                PdfPCell cell6 = new PdfPCell(new Phrase(salesmen.Where(e => e.Id == meeting.CompanyResponsible).FirstOrDefault().Name, font));
                table.AddCell(cell6);
            }

            return table;
        }

        private PdfPTable CreateProspectMeetingsTableAllSalesmen(List<ProspectMeeting> meetings, List<ProspectContact> contacts, List<AdMember> salesmen)
        {
            BaseFont bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            Font fontTitle = new Font(bf, 9, iTextSharp.text.Font.BOLD);
            Font font = new Font(bf, 7, iTextSharp.text.Font.NORMAL);

            PdfPTable table = new PdfPTable(6);
            table.SpacingBefore = 20f;

            PdfPCell cellTitle = new PdfPCell(new Phrase("Datum", fontTitle));
            table.AddCell(cellTitle);

            PdfPCell cellCTitle = new PdfPCell(new Phrase("Prospekt", fontTitle));
            table.AddCell(cellCTitle);

            PdfPCell cell2Title = new PdfPCell(new Phrase("Kontakt", fontTitle));
            table.AddCell(cell2Title);

            PdfPCell cell3Title = new PdfPCell(new Phrase("Typ", fontTitle));
            table.AddCell(cell3Title);

            PdfPCell cell4Title = new PdfPCell(new Phrase("Resultat", fontTitle));
            table.AddCell(cell4Title);

            //PdfPCell cell5Title = new PdfPCell(new Phrase("Kommentar", fontTitle));
            //table.AddCell(cell5Title);

            PdfPCell cell6Title = new PdfPCell(new Phrase("Säljare", fontTitle));
            table.AddCell(cell6Title);

            foreach (var meeting in meetings)
            {
                PdfPCell cell = new PdfPCell(new Phrase(meeting.Date.ToString("yyyy-MM-dd"), font));
                table.AddCell(cell);

                PdfPCell cellC = new PdfPCell(new Phrase(meeting.ProspectName, font));
                table.AddCell(cellC);

                if (meeting.ContactName == "Leverantör/Partner")
                {
                    PdfPCell cell2 = new PdfPCell(new Phrase("Leverantör/Partner", font));
                    table.AddCell(cell2);
                }
                else if (meeting.ContactName == "Ingen vald")
                {
                    PdfPCell cell2 = new PdfPCell(new Phrase("Ingen vald", font));
                    table.AddCell(cell2);
                }
                else
                {
                    PdfPCell cell2 = new PdfPCell(new Phrase(contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().LastName, font));
                    table.AddCell(cell2);
                }

                PdfPCell cell3 = new PdfPCell(new Phrase(meeting.TypeOfMeeting, font));
                table.AddCell(cell3);

                PdfPCell cell4 = new PdfPCell(new Phrase(meeting.ResultOfMeeting, font));
                table.AddCell(cell4);

                //PdfPCell cell5 = new PdfPCell(new Phrase(meeting.Comments, font));
                //table.AddCell(cell5);

                PdfPCell cell6 = new PdfPCell(new Phrase(salesmen.Where(e => e.Id == meeting.CompanyResponsible).FirstOrDefault().Name, font));
                table.AddCell(cell6);
            }

            return table;
        }

        private PdfPTable CreateProjectsTableAllSalesmen(List<ProjectActivity> projects, List<CustomerContact> contacts, List<AdMember> salesmen)
        {
            BaseFont bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            Font fontTitle = new Font(bf, 9, Font.BOLD);
            Font font = new Font(bf, 7, Font.NORMAL);

            PdfPTable table = new PdfPTable(7);
            table.SpacingBefore = 20f;

            PdfPCell cellTitle = new PdfPCell(new Phrase("Datum", fontTitle));
            table.AddCell(cellTitle);

            PdfPCell cellTitleC = new PdfPCell(new Phrase("Kund", fontTitle));
            table.AddCell(cellTitleC);

            PdfPCell cell2Title = new PdfPCell(new Phrase("Aktivitet", fontTitle));
            table.AddCell(cell2Title);

            //PdfPCell cell3Title = new PdfPCell(new Phrase("Beskrivning", fontTitle));
            //table.AddCell(cell3Title);

            PdfPCell cell4Title = new PdfPCell(new Phrase("Kontakt", fontTitle));
            table.AddCell(cell4Title);

            PdfPCell cell5Title = new PdfPCell(new Phrase("Status", fontTitle));
            table.AddCell(cell5Title);

            PdfPCell cell6Title = new PdfPCell(new Phrase("Nästa steg", fontTitle));
            table.AddCell(cell6Title);

            PdfPCell cell7Title = new PdfPCell(new Phrase("Säljare", fontTitle));
            table.AddCell(cell7Title);

            foreach (var project in projects)
            {
                PdfPCell cell = new PdfPCell(new Phrase(project.Date.ToString("yyyy-MM-dd"), font));
                table.AddCell(cell);

                PdfPCell cell2C = new PdfPCell(new Phrase(project.CustomerName, font));
                table.AddCell(cell2C);

                PdfPCell cell2 = new PdfPCell(new Phrase(project.Activity, font));
                table.AddCell(cell2);

                //PdfPCell cell3 = new PdfPCell(new Phrase(project.Description, font));
                //table.AddCell(cell3);

                PdfPCell cell4 = new PdfPCell(new Phrase(contacts.Where(e => e.Id == project.CustomerContact).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == project.CustomerContact).FirstOrDefault().LastName, font));
                table.AddCell(cell4);

                PdfPCell cell5 = new PdfPCell(new Phrase(project.Status, font));
                table.AddCell(cell5);

                PdfPCell cell6 = new PdfPCell(new Phrase(project.NextStep, font));
                table.AddCell(cell6);

                PdfPCell cell7 = new PdfPCell(new Phrase(salesmen.Where(e => e.Id == project.CompanyResponsible).FirstOrDefault().Name, font));
                table.AddCell(cell7);
            }

            return table;
        }

        internal async Task<string> CreateOverviewFile(List<ProjectActivity> projects, List<CustomerMeeting> meetings, List<ProspectMeeting> prospectMeetings, Company company, string salesman, List<CustomerContact> contacts, List<ProspectContact> prospectContacts)
        {
            var fileName = "Överblicksbild_" + company.Name + "_" + DateTime.Now.ToString("yyyy-MM-dd");
            FileStream fs = new FileStream("" + fileName + ".pdf", FileMode.Create, FileAccess.Write, FileShare.None);
            Document doc = new Document();
            PdfWriter writer = PdfWriter.GetInstance(doc, fs);
            doc.Open();

            var pic = await GetLogo(company);
            doc.Add(pic);

            var title = await CreateParagraph("Överblick", 32, Element.ALIGN_CENTER);
            doc.Add(title);

            var salesmanParagrapgh = await CreateParagraph(salesman, 16, Element.ALIGN_CENTER);
            doc.Add(salesmanParagrapgh);

            if (company.Id != "23c5b39f-6ea9-4e9b-b20a-27606982c79e")
            {
                var projectsParagraph = await CreateParagraph("Projektaktiviteter", 20, Element.ALIGN_CENTER);
                doc.Add(projectsParagraph);
                var projectsTable = CreateProjectsTable(projects, contacts);
                doc.Add(projectsTable);
            }

            var meetingsParagraph = await CreateParagraph("Aktiviteter", 20, Element.ALIGN_CENTER);
            doc.Add(meetingsParagraph);
            var meetingsTable = CreateMeetingsTable(meetings, contacts);
            doc.Add(meetingsTable);

            var meetingsProspectParagraph = await CreateParagraph("Prospekt-aktiviteter", 20, Element.ALIGN_CENTER);
            doc.Add(meetingsProspectParagraph);
            var meetingsProspectTable = CreateProspectMeetingsTable(prospectMeetings, prospectContacts);
            doc.Add(meetingsProspectTable);

            doc.Close();

            return fileName;
        }

        private PdfPTable CreateMeetingsTable(List<CustomerMeeting> meetings, List<CustomerContact> contacts)
        {
            BaseFont bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            Font fontTitle = new Font(bf, 9, iTextSharp.text.Font.BOLD);
            Font font = new Font(bf, 7, iTextSharp.text.Font.NORMAL);

            PdfPTable table = new PdfPTable(6);
            table.SpacingBefore = 20f;

            PdfPCell cellTitle = new PdfPCell(new Phrase("Datum", fontTitle));
            table.AddCell(cellTitle);

            PdfPCell cellCTitle = new PdfPCell(new Phrase("Kund", fontTitle));
            table.AddCell(cellCTitle);

            PdfPCell cell2Title = new PdfPCell(new Phrase("Kontakt", fontTitle));
            table.AddCell(cell2Title);

            PdfPCell cell3Title = new PdfPCell(new Phrase("Typ", fontTitle));
            table.AddCell(cell3Title);

            PdfPCell cell4Title = new PdfPCell(new Phrase("Resultat", fontTitle));
            table.AddCell(cell4Title);

            PdfPCell cell5Title = new PdfPCell(new Phrase("Kommentar", fontTitle));
            table.AddCell(cell5Title);

            //PdfPCell cell6Title = new PdfPCell(new Phrase("Kilometer", fontTitle));
            //table.AddCell(cell6Title);

            foreach (var meeting in meetings)
            {
                PdfPCell cell = new PdfPCell(new Phrase(meeting.Date.ToString("yyyy-MM-dd"), font));
                table.AddCell(cell);

                PdfPCell cellC = new PdfPCell(new Phrase(meeting.CustomerName, font));
                table.AddCell(cellC);

                try
                {
                    PdfPCell cell2 = new PdfPCell(new Phrase(contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().LastName, font));
                    table.AddCell(cell2);
                }
                catch
                {
                    PdfPCell cell2 = new PdfPCell(new Phrase("", font));
                    table.AddCell(cell2);
                }

                PdfPCell cell3 = new PdfPCell(new Phrase(meeting.TypeOfMeeting, font));
                table.AddCell(cell3);

                PdfPCell cell4 = new PdfPCell(new Phrase(meeting.ResultOfMeeting, font));
                table.AddCell(cell4);

                PdfPCell cell5 = new PdfPCell(new Phrase(meeting.Comments, font));
                table.AddCell(cell5);

                //PdfPCell cell6 = new PdfPCell(new Phrase(meeting.KilometersDriven.ToString(), font));
                //table.AddCell(cell6);
            }

            return table;
        }

        private PdfPTable CreateProspectMeetingsTable(List<ProspectMeeting> meetings, List<ProspectContact> contacts)
        {
            BaseFont bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            Font fontTitle = new Font(bf, 9, iTextSharp.text.Font.BOLD);
            Font font = new Font(bf, 7, iTextSharp.text.Font.NORMAL);

            PdfPTable table = new PdfPTable(6);
            table.SpacingBefore = 20f;

            PdfPCell cellTitle = new PdfPCell(new Phrase("Datum", fontTitle));
            table.AddCell(cellTitle);

            PdfPCell cellCTitle = new PdfPCell(new Phrase("Prospekt", fontTitle));
            table.AddCell(cellCTitle);

            PdfPCell cell2Title = new PdfPCell(new Phrase("Kontakt", fontTitle));
            table.AddCell(cell2Title);

            PdfPCell cell3Title = new PdfPCell(new Phrase("Typ", fontTitle));
            table.AddCell(cell3Title);

            PdfPCell cell4Title = new PdfPCell(new Phrase("Resultat", fontTitle));
            table.AddCell(cell4Title);

            PdfPCell cell5Title = new PdfPCell(new Phrase("Kommentar", fontTitle));
            table.AddCell(cell5Title);

            //PdfPCell cell6Title = new PdfPCell(new Phrase("Kilometer", fontTitle));
            //table.AddCell(cell6Title);

            foreach (var meeting in meetings)
            {
                PdfPCell cell = new PdfPCell(new Phrase(meeting.Date.ToString("yyyy-MM-dd"), font));
                table.AddCell(cell);

                PdfPCell cellC = new PdfPCell(new Phrase(meeting.ProspectName, font));
                table.AddCell(cellC);

                try
                {
                    PdfPCell cell2 = new PdfPCell(new Phrase(contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == meeting.ContactName).FirstOrDefault().LastName, font));
                    table.AddCell(cell2);
                }
                catch
                {
                    PdfPCell cell2 = new PdfPCell(new Phrase("", font));
                    table.AddCell(cell2);
                }

                PdfPCell cell3 = new PdfPCell(new Phrase(meeting.TypeOfMeeting, font));
                table.AddCell(cell3);

                PdfPCell cell4 = new PdfPCell(new Phrase(meeting.ResultOfMeeting, font));
                table.AddCell(cell4);

                PdfPCell cell5 = new PdfPCell(new Phrase(meeting.Comments, font));
                table.AddCell(cell5);

                //PdfPCell cell6 = new PdfPCell(new Phrase(meeting.KilometersDriven.ToString(), font));
                //table.AddCell(cell6);
            }

            return table;
        }

        private PdfPTable CreateProjectsTable(List<ProjectActivity> projects, List<CustomerContact> contacts)
        {
            BaseFont bf = BaseFont.CreateFont(BaseFont.TIMES_ROMAN, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            Font fontTitle = new Font(bf, 9, Font.BOLD);
            Font font = new Font(bf, 7, Font.NORMAL);

            PdfPTable table = new PdfPTable(7);
            table.SpacingBefore = 20f;

            PdfPCell cellTitle = new PdfPCell(new Phrase("Datum", fontTitle));
            table.AddCell(cellTitle);

            PdfPCell cellTitleC = new PdfPCell(new Phrase("Kund", fontTitle));
            table.AddCell(cellTitleC);

            PdfPCell cell2Title = new PdfPCell(new Phrase("Aktivitet", fontTitle));
            table.AddCell(cell2Title);

            PdfPCell cell3Title = new PdfPCell(new Phrase("Beskrivning", fontTitle));
            table.AddCell(cell3Title);

            PdfPCell cell4Title = new PdfPCell(new Phrase("Kontakt", fontTitle));
            table.AddCell(cell4Title);

            PdfPCell cell5Title = new PdfPCell(new Phrase("Status", fontTitle));
            table.AddCell(cell5Title);

            PdfPCell cell6Title = new PdfPCell(new Phrase("Nästa steg", fontTitle));
            table.AddCell(cell6Title);

            foreach (var project in projects)
            {
                PdfPCell cell = new PdfPCell(new Phrase(project.Date.ToString("yyyy-MM-dd"), font));
                table.AddCell(cell);

                PdfPCell cell2C = new PdfPCell(new Phrase(project.CustomerName, font));
                table.AddCell(cell2C);

                PdfPCell cell2 = new PdfPCell(new Phrase(project.Activity, font));
                table.AddCell(cell2);

                PdfPCell cell3 = new PdfPCell(new Phrase(project.Description, font));
                table.AddCell(cell3);

                try
                {
                    PdfPCell cell4 = new PdfPCell(new Phrase(contacts.Where(e => e.Id == project.CustomerContact).FirstOrDefault().FirstName + " " + contacts.Where(e => e.Id == project.CustomerContact).FirstOrDefault().LastName, font));
                    table.AddCell(cell4);
                }
                catch
                {
                    PdfPCell cell4 = new PdfPCell(new Phrase("", font));
                    table.AddCell(cell4);
                }

                PdfPCell cell5 = new PdfPCell(new Phrase(project.Status, font));
                table.AddCell(cell5);

                PdfPCell cell6 = new PdfPCell(new Phrase(project.NextStep, font));
                table.AddCell(cell6);
            }

            return table;
        }

        internal async Task<Image> GetLogo(Company company)
        {
            var imageName = company.LogoPath.Substring(company.LogoPath.LastIndexOf('/') + 1);
            var path = Path.Combine(
                   Directory.GetCurrentDirectory(),
                   "wwwroot/media/logos", imageName);

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;

            var image = System.Drawing.Image.FromStream(memory);

            iTextSharp.text.Image pic = iTextSharp.text.Image.GetInstance(image, System.Drawing.Imaging.ImageFormat.Jpeg);
            pic.ScaleAbsolute(250f, 50f);

            return pic;
        }

        internal async Task<Paragraph> CreateParagraph(string text, int fontSize, int alignment)
        {
            Font titleFont = FontFactory.GetFont("Times-Roman", fontSize);
            Paragraph title;
            title = new Paragraph(text, titleFont);
            title.Alignment = alignment;

            return title;
        }
    }
}
