using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Models
{
    public class ValueObject : CustomerValue
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Classification { get; set; } 
    }
}
