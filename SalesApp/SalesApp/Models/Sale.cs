using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class Sale
    {
        public string CompanyId { get; set; }
        public string CustomerId { get; set; }
        public string Id { get; set; }
        public int? Amount { get; set; }
        public string Currency { get; set; }
        public DateTime? Date { get; set; }
        public string SäljareId { get; set; }
    }
}
