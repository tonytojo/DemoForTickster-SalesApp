using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class ArchivedCustomerMeetingExtraCompanyResponsible
    {
        public string Id { get; set; }
        public string CompanyId { get; set; }
        public string CustomerId { get; set; }
        public DateTime Date { get; set; }
        public string TypeOfMeeting { get; set; }
        public string ResultOfMeeting { get; set; }
        public string ContactName { get; set; }
        public string MeetingId { get; set; }
    }
}
