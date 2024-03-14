using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class Deal
    {
        public string DealId { get; set; }
        public int LaneId { get; set; }
        public string CompanyId { get; set; }
        public string UserId { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string ContactName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }
        public DateTime? TimestampCreated { get; set; }
        public DateTime? TimestampModified { get; set; }
    }
}
