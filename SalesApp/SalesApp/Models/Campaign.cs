using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class Campaign
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string CompanyId { get; set; }
    }
}
