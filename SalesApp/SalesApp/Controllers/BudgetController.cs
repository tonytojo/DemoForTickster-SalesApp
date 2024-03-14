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
    public class BudgetController : Controller
    {
        private DatabaseService _databaseService { get; set; }
        private GraphService _graphService;

        public BudgetController(DatabaseService databaseService, GraphService graphService)
        {
            _databaseService = databaseService;
            _graphService = graphService;
        }

        public List<Customer> GetNonBudgetCustomers(string companyId, string userId, string name, string year)
        {
            return _databaseService.GetNonBudgetCustomersForSalesmanAndYear(companyId, userId, name, year);
        }

        [HttpPost]
        public bool SaveBudget(string companyId, string chosenSalesman, string name, string chosenCustomer, string chosenYear, string budget)
        {
            return _databaseService.SaveBudget(companyId, chosenSalesman, name, chosenCustomer, chosenYear, budget);
        }

        public async Task<List<SalesmanWithBudgets>> GetSalesmenWithBudgets(string companyId, string year)
        {
            var currentUserId = Guid.Parse(User.Id());
            var adGroups = await _graphService.GetGroupsByUserAsync(currentUserId);

            var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();

            var members = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());
            string hostHeader = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
            if (!hostHeader.Contains("localhost"))
            {
                members.RemoveAll(s => /*s.Name == "Tommie Karlsson" ||*/ s.Name == "Niklas Forsberg" || s.Name == "Daniel Rönning" || s.Name == "Anton Eriksson" || s.Name == "QBIM Admin" || s.Name == "Niklas Lindberg" || s.Name == "Åsa Säfströmer");
            }
            members.Sort((item1, item2) => item1.Name.CompareTo(item2.Name));

            var budgets = _databaseService.GetBudgetsForCompany(companyId, year);

            var list = new List<SalesmanWithBudgets>();
            foreach(var member in members)
            {
                list.Add(new SalesmanWithBudgets()
                {
                    Id = member.Id,
                    Name = member.Name,
                    Budgets = budgets.Where(e => e.UserId == member.Id).ToList()
                });
            }

            list.Sort((item1, item2) => item1.Name.CompareTo(item2.Name));

            return list;
        }

        [HttpPost]
        public bool UpdateBudget(AnnualCustomerBudget budget)
        {
            return _databaseService.UpdateBudget(budget);
        }

        [HttpPost]
        public bool RemoveBudget(AnnualCustomerBudget budget)
        {
            return _databaseService.RemoveBudget(budget);
        }
    }
    public class SalesmanWithBudgets
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<AnnualCustomerBudget> Budgets { get; set; }
    }

}
