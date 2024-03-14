using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class Prospect
    {
        public string Id { get; set; }
        public string CompanyId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
