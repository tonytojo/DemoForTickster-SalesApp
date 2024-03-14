using Microsoft.AspNetCore.Mvc;
using SalesApp.Models;
using SalesApp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Controllers
{
    public class MeetingController : Controller
    {
        private DatabaseService _databaseService { get; set; }
        public MeetingController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }
        
        public List<CustomerMeeting> GetMeetings(string companyId, string customerId)
        {
            var meetings = _databaseService.GetMeetings(companyId, customerId);

            meetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));

            return meetings;
        }

        public List<CustomerMeeting> GetMeetingsFiltered(string companyId, string customerId, string fromDate, string toDate, string status)
        {
            var meetings = _databaseService.GetMeetingsFiltered(companyId, customerId, fromDate, toDate, status);

            meetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));

            return meetings;
        }

        public List<CustomerMeeting> GetAllMeetings(string companyId)
        {
            var meetings = _databaseService.GetAllMeetings(companyId);

            meetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));

            return meetings;
        }

        public List<CustomerMeeting> GetAllMeetingsFiltered(string companyId, string fromDate, string toDate, string status)
        {
            var meetings = _databaseService.GetAllMeetingsFiltered(companyId, fromDate, toDate, status);

            meetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));

            return meetings;
        }

        public List<CustomerMeeting> GetAllMeetingsForSalesman(string companyId, string userId)
        {
            var meetings = _databaseService.GetMeetingsForSalesman(companyId, userId);

            meetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));

            return meetings;
        }

        public List<CustomerMeeting> GetAllMeetingsForSalesmanFiltered(string companyId, string userId, string fromDate, string toDate, string status)
        {
            var meetings = _databaseService.GetMeetingsForSalesmanFiltered(companyId, userId, fromDate, toDate, status);

            meetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));

            return meetings;
        }

        public List<CustomerMeeting> GetMeetingsOfEntireCustomerGroup(string customerGroupId)
        {
            var meetings = _databaseService.GetMeetingsOfEntireCustomerGroup(customerGroupId);
            meetings.Sort((x, y) => DateTime.Compare(y.Date, x.Date));

            return meetings;
        }

        public async Task<bool> Savemeeting(CustomerMeeting customerMeeting, string chosenCustomerId, List<string> customerMeetingExtraCustomerContacts, List<string> customerMeetingExtraCompanyResponsibles)
        {
            if(chosenCustomerId != null)
            {
                customerMeeting.CustomerId = chosenCustomerId;
            }

            if(customerMeeting.CustomerName == null)
            {
                customerMeeting.CustomerName = _databaseService.GetNameOfCustomerOrGroup(customerMeeting.CompanyId, customerMeeting.CustomerId);
            }

            return await _databaseService.SaveMeeting(customerMeeting, customerMeetingExtraCustomerContacts, customerMeetingExtraCompanyResponsibles);
        }

        public bool EditMeeting(CustomerMeeting customerMeeting, List<ReactMultiSelectValue> customerMeetingExtraCustomerContacts, List<ReactMultiSelectValue> customerMeetingExtraCompanyResponsibles)
        {
            return _databaseService.EditMeeting(customerMeeting, customerMeetingExtraCustomerContacts, customerMeetingExtraCompanyResponsibles);
        }

        public CustomerMeeting GetMeeting(string companyId, string customerId, string meetingId)
        {
            return _databaseService.GetMeeting(companyId, customerId, meetingId);
        }

        public List<string> GetMeetingParticipators(string companyId, string customerId, string meetingId)
        {
            var participators = _databaseService.GetMeetingParticipators(companyId, customerId, meetingId);

            var list = new List<string>();
            foreach(var part in participators)
            {
                list.Add(part.ContactName);
            }

            return list;
        }

        public bool RemoveMeeting(CustomerMeeting meeting)
        {
            return _databaseService.RemoveMeeting(meeting);
        }

    }
}
