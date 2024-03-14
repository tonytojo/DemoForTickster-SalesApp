using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class CustomerGroup
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string CompanyId { get; set; }
        public int IncrementId { get; set; }

        public virtual Company Company { get; set; }
    }
}
