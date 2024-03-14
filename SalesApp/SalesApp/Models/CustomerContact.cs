using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class CustomerContact
    {
        public string Id { get; set; }
        public string CustomerId { get; set; }
        public string CompanyId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Telephone { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string CreatedBy { get; set; }
    }
}
