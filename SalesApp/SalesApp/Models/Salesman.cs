using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class Salesman
    {
        public string Säljare { get; set; }
        public string Namn { get; set; }
        public string Säljargrupp { get; set; }
        public string Lagerid { get; set; }
        public string Email { get; set; }
        public string SäljareJn { get; set; }
        public string InköpareJn { get; set; }
        public string CompanyId { get; set; }
    }
}
