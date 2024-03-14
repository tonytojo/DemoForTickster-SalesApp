using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Models
{
    public class DataForEmail
    {
        public string Email { get; set; }
        public string BodyContent { get; set; }
        public string Title { get; set; }
        public string CustomerName { get; set; }
    }
}
