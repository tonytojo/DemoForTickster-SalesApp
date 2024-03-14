using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Models
{
    public class ActivitySalesman
    {
        public string UserId { get; set; }
        public string SalesmanName { get; set; }
        public int NoOfLogins { get; set; }
        public int NoOfProjects { get; set; }
        public int NoOfActivities { get; set; }
        public int NoOfKilometers { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsSuperUser { get; set; }
        public bool IsStoreUser { get; set; }
    }
}
