
namespace SalesApp.Models
{
    using Microsoft.PowerBI.Api.Models;
    using System.Collections.Generic;

    public class EmbedParams
    {
        public string Type { get; set; }
        public List<EmbedReport> EmbedReport { get; set; }
        public EmbedToken EmbedToken { get; set; }
        public Filters Filters { get; set; }
        public string PageName { get; set; }
    }
}
