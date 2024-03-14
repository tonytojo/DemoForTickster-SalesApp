using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class KilometersDriven
    {
        public string CompanyId { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public string Kilometers { get; set; }
    }
}
