using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class SupplierTravel
    {
        public string Id { get; set; }
        public string CompanyId { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public string SupplierName { get; set; }
        public string Comments { get; set; }
        public int? KilometersDriven { get; set; }
    }
}
