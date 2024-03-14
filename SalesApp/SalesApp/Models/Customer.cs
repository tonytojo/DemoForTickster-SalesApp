using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class Customer
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string RevenueLast12MonthSek { get; set; }
        public string CompanyId { get; set; }
        public string SalesmanResponsible { get; set; }
        public string ProduktsäljSlip { get; set; }
        public string ProduktsäljSkärande { get; set; }
        public string ProduktsäljTillsatsmat { get; set; }
        public string ProduktsäljTryckluft { get; set; }
        public string ProduktsäljSkydd { get; set; }
        public string ProduktsäljHydraulik { get; set; }
        public string ProduktsäljTransmission { get; set; }
        public string Status { get; set; }

        public virtual Company Company { get; set; }
    }
}
