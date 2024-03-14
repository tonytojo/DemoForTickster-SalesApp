using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class Login
    {
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
