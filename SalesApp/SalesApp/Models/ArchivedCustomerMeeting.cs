using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class ArchivedCustomerMeeting
    {
        public string MeetingId { get; set; }
        public string ProjectId { get; set; }
        public string CompanyId { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public DateTime Date { get; set; }
        public string ContactName { get; set; }
        public string ContactTelephone { get; set; }
        public string TypeOfMeeting { get; set; }
        public string ResultOfMeeting { get; set; }
        public string MiscExplanation { get; set; }
        public string Comments { get; set; }
        public string CompanyResponsible { get; set; }
        public int? WeekNumber { get; set; }
        public string LocationType { get; set; }
        public string CampaignId { get; set; }
        public int? KilometersDriven { get; set; }
    }
}
