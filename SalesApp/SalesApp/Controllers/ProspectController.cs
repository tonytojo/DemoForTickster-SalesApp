using Microsoft.AspNetCore.Mvc;
using SalesApp.Extensions;
using SalesApp.Models;
using SalesApp.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Controllers
{
    public class ProspectController : Controller
    {
        private DatabaseService _databaseService { get; set; }
        private GraphService _graphService;
        public ProspectController(DatabaseService databaseService, GraphService graphService)
        {
            _databaseService = databaseService;
            _graphService = graphService;
        }

        public List<Prospect> GetAllProspects(string companyId)
        {
            return _databaseService.GetAllProspects(companyId);
        }

        public ProspectCard GetProspect(string companyId, string prospectId)
        {
            return _databaseService.GetProspect(companyId, prospectId);
        }

        public bool SaveProspect(Prospect prospect)
        {
            prospect.Id = Guid.NewGuid().ToString();
            
            return _databaseService.SaveProspect(prospect);
        }

        public bool SaveProspectContact(ProspectContact prospectContact)
        {
            prospectContact.Id = Guid.NewGuid().ToString();

            TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;
            prospectContact.FirstName = textInfo.ToTitleCase(prospectContact.FirstName);
            prospectContact.LastName = textInfo.ToTitleCase(prospectContact.LastName);

            //if (customerContact.CompanyId == "5eb7b09b-105a-4160-96b5-95b0353efcee")
            //{
            //    if (customerContact.Role == "Inget av alternativen passar")
            //    {
            //        await _graphService.SendEmailToOsterbergs(User.Name(), customerContact);
            //    }
            //}

            prospectContact.CreatedBy = User.UserName();

            return _databaseService.SaveProspectContact(prospectContact);
        }
      
        public List<ReactMultiSelectValue> GetProspectContactsSelect(string companyId, string prospectId)
        {
            var contacts = _databaseService.GetProspectContacts(companyId, prospectId);

            contacts.Sort((x, y) => string.Compare(x.FirstName, y.FirstName));

            var list = new List<ReactMultiSelectValue>();

            list.Add(new ReactMultiSelectValue
            {
                label = "Leverantör/Partner",
                value = "Leverantör/Partner"
            });

            foreach (var mem in contacts)
            {
                list.Add(new ReactMultiSelectValue
                {
                    label = mem.FirstName + " " + mem.LastName + "-" + mem.Role,
                    value = mem.Id
                });
            }

            return list;
        }

        public async Task<bool> SaveMeeting(ProspectMeeting prospectMeeting, List<string> prospectMeetingExtraCustomerContacts, List<string> customerMeetingExtraCompanyResponsibles)
        {

            if (prospectMeeting.ProspectName == null)
            {
                prospectMeeting.ProspectName = _databaseService.GetNameOfProspect(prospectMeeting.CompanyId, prospectMeeting.ProspectId);
            }

            return await _databaseService.SaveProspectMeeting(prospectMeeting, prospectMeetingExtraCustomerContacts, customerMeetingExtraCompanyResponsibles);
        }

        public bool RemoveMeeting(ProspectMeeting meeting)
        {
            return _databaseService.RemoveProspectMeeting(meeting);
        }

        public ProspectMeeting GetMeeting(string companyId, string prospectId, string meetingId)
        {
            return _databaseService.GetProspectMeeting(companyId, prospectId, meetingId);
        }

        public List<ProspectContact> GetProspectContacts(string companyId, string prospectId)
        {
            var contacts = _databaseService.GetProspectContacts(companyId, prospectId);

            contacts.Sort((x, y) => string.Compare(x.FirstName, y.FirstName));

            return contacts;
        }

        public List<string> GetProspectMeetingParticipators(string companyId, string prospectId, string meetingId)
        {
            var participators = _databaseService.GetProspectMeetingParticipators(companyId, prospectId, meetingId);

            var list = new List<string>();
            foreach (var part in participators)
            {
                list.Add(part.ContactName);
            }

            return list;
        }

        public List<ReactMultiSelectValue> GetSelectedProspectContactsForMeeting(string meetingId)
        {
            var contacts = _databaseService.GetSelectedProspectContactsForMeeting(meetingId);
            var cus = _databaseService.GetProspectContacts(contacts[0].CompanyId, contacts[0].ProspectId);

            contacts.Sort((x, y) => string.Compare(x.ContactName, y.ContactName));

            var list = new List<ReactMultiSelectValue>();

            foreach (var mem in contacts)
            {
                if (mem.ContactName == "Leverantör/Partner")
                {
                    list.Add(new ReactMultiSelectValue
                    {
                        label = mem.ContactName,
                        value = mem.Id
                    });
                }
                else
                {
                    list.Add(new ReactMultiSelectValue
                    {
                        label = mem.ContactName + "-" + cus.Where(e => e.Id == mem.Id).FirstOrDefault().Role,
                        value = mem.Id
                    });
                }
            }

            return list;

        }

        public bool EditMeeting(ProspectMeeting prospectMeeting, List<ReactMultiSelectValue> prospectMeetingExtraCustomerContacts, List<ReactMultiSelectValue> prospectMeetingExtraCompanyResponsibles)
        {
            return _databaseService.EditProspectMeeting(prospectMeeting, prospectMeetingExtraCustomerContacts, prospectMeetingExtraCompanyResponsibles);
        }

        public ProspectContact GetProspectContact(string companyId, string prospectId, string id)
        {
            return _databaseService.GetProspectContact(companyId, prospectId, id);
        }

        public bool EditProspectContact(string prospectId, string companyId, ProspectContact prospectContact)
        {
            TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;
            prospectContact.FirstName = textInfo.ToTitleCase(prospectContact.FirstName);
            prospectContact.LastName = textInfo.ToTitleCase(prospectContact.LastName);

            return _databaseService.EditProspectContact(prospectId, companyId, prospectContact);
        }

        public bool ConvertToCustomer(string companyId, string prospectId, string customerId)
        {
            return _databaseService.ConvertToCustomer(prospectId, companyId, customerId);           
        }

        public List<ProspectMeeting> GetAllProspectMeetingsForCompanyFiltered(string companyId, string fromDate, string toDate, string status)
        {
            return _databaseService.GetAllProspectMeetingsForCompanyFiltered(companyId, fromDate, toDate, status);
        }

        public List<ProspectMeeting> GetAllMeetingsForSalesman(string companyId, string userId)
        {
            var meetings = _databaseService.GetProspectMeetingsForSalesman(companyId, userId);

            meetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));

            return meetings;
        }

        public List<ProspectMeeting> GetAllMeetingsForSalesmanFiltered(string companyId, string userId, string fromDate, string toDate, string status)
        {
            var meetings = _databaseService.GetProspectMeetingsForSalesmanFiltered(companyId, userId, fromDate, toDate, status);

            meetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));

            return meetings;
        }

    }

    public class ProspectCard
    {
        public Prospect Info { get; set; }
        public List<ProspectContact> Contacts { get; set; }
        public List<ProspectMeeting> Meetings { get; set; }
    }
}
