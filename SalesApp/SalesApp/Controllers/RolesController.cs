using Microsoft.AspNetCore.Mvc;
using SalesApp.Models;
using SalesApp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Controllers
{
    public class RolesController : Controller
    {
        private DatabaseService _databaseService { get; set; }
        public RolesController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public List<ContactRole> GetRoles(string companyId)
        {
            var roles = _databaseService.GetRoles(companyId);

            roles.Sort((x, y) => string.Compare(x.Role, y.Role));

            return roles;
        }

        public bool RemoveRole(string companyId, string role)
        {
            return _databaseService.RemoveRole(companyId, role);
        }

        public bool SaveRole(string companyId, string role)
        {
            return _databaseService.SaveRole(companyId, role);
        }

        public bool ChangeSystemRole(string companyId, string userId, bool newStatus, string role)
        {
            return _databaseService.ChangeSystemRole(companyId, userId, newStatus, role);
        }
    }
}
