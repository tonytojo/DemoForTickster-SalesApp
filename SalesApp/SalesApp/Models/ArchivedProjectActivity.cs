using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class ArchivedProjectActivity
    {
        public string CompanyId { get; set; }
        public string CustomerId { get; set; }
        public DateTime Date { get; set; }
        public string Activity { get; set; }
        public string Description { get; set; }
        public string CompanyResponsible { get; set; }
        public string CustomerContact { get; set; }
        public string Status { get; set; }
        public string NextStep { get; set; }
        public int? WeekNumber { get; set; }
        public string CustomerName { get; set; }
        public string CompanyResponsible2 { get; set; }
        public string ProjectId { get; set; }
        public DateTime? LastSaved { get; set; }
        public string Priority { get; set; }
        public string CampaignId { get; set; }
    }
}
