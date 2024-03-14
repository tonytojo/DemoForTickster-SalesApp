using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Models
{
    public class Graph
    {
        public string[] Scope { get; set; }

        public string RedirectUri { get; set; }

        public string AuthorityUri { get; set; }

        public string ClientId { get; set; }

        public string Domain { get; set; }

        public string TenantId { get; set; }

        public string ClientSecret { get; set; }
    }
}
