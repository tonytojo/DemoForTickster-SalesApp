using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class FollowUp
    {
        public string CompanyId { get; set; }
        public string CustomerId { get; set; }
        public string ToEmail { get; set; }
        public string Comment { get; set; }
        public DateTime Date { get; set; }
    }
}
