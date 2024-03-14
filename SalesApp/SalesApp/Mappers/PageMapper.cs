using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Mappers
{
    public static class PageMapper
    {
        public static Models.Page Map(Microsoft.PowerBI.Api.Models.Page page)
        {
            return new Models.Page
            {
                Id = page.Name,
                Name = page.DisplayName
            };
        }
    }
}
