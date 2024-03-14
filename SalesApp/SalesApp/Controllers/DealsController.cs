using Microsoft.AspNetCore.Mvc;
using SalesApp.Extensions;
using SalesApp.Models;
using SalesApp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Controllers
{
    public class DealsController : Controller
    {
        private DatabaseService _databaseService;
        private GraphService _graphService;

        public DealsController(GraphService graphService, DatabaseService databaseService)
        {
            _graphService = graphService;
            _databaseService = databaseService;
        }
        public IActionResult Index()
        {
            return View();
        }

        public List<Deal> GetAllDealsForUser()
        {
            var currentUserId = Guid.Parse(User.Id());

            return _databaseService.GetAllDealsForUser(currentUserId);
        }

        public bool MoveDeal(string dealId, int newLaneId)
        {
            return _databaseService.MoveDeal(dealId, newLaneId);
        }

        public bool SaveDeal(string companyId, string title, string description, string priority, string customerId, string customerName, string contactName)
        {
            return _databaseService.SaveDeal( companyId,  User.Id(),  title,  description,  priority,  customerId,  customerName,  contactName);
        }

        public bool DeleteDeal(string dealId)
        {
            return _databaseService.DeleteDeal(dealId);
        }
    }
}
