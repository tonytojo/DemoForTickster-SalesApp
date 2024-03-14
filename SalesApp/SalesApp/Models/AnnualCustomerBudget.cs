using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class AnnualCustomerBudget
    {
        public string Year { get; set; }
        public string CompanyId { get; set; }
        public string CustomerId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public int AnnualBudget { get; set; }
        public decimal JanBudget { get; set; }
        public decimal FebBudget { get; set; }
        public decimal MarsBudget { get; set; }
        public decimal AprilBudget { get; set; }
        public decimal MayBudget { get; set; }
        public decimal JuneBudget { get; set; }
        public decimal JulyBudget { get; set; }
        public decimal AugBudget { get; set; }
        public decimal SeptBudget { get; set; }
        public decimal OctBudget { get; set; }
        public decimal NovBudget { get; set; }
        public decimal DecBudget { get; set; }
    }
}
