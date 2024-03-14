using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class CustomerValue
    {
        public string CustomerId { get; set; }
        public string CompanyId { get; set; }
        public int PotentialRevenue { get; set; }
        public int Loyalty { get; set; }
        public int Sortiment { get; set; }
        public int Revenue { get; set; }
        public int BrandValue { get; set; }
        public int MarketLeading { get; set; }
        public int Economy { get; set; }
        public int OwnerShip { get; set; }
        public string Classification { get; set; }
        public string Name { get; set; }
        public string CustomerGroup { get; set; }
    }
}
