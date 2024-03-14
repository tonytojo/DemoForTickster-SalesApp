using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class Company
    {
        public Company()
        {
            CustomerGroups = new HashSet<CustomerGroup>();
            Customers = new HashSet<Customer>();
        }

        public string Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public string LogoPath { get; set; }
        public string Adress { get; set; }
        public string WorkspaceId { get; set; }
        public string ReportId { get; set; }
        public string SalesReportReportId { get; set; }
        public string SalesReport2ReportId { get; set; }
        public string StoreReportReportId { get; set; }

        public virtual ICollection<CustomerGroup> CustomerGroups { get; set; }
        public virtual ICollection<Customer> Customers { get; set; }
    }
}
