using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SalesApp.Models;
using SalesApp.Services;

namespace SalesApp.Controllers
{
    public class CustomerGroupsController : Controller
    {
        private DatabaseService _databaseService { get; set; }
        public CustomerGroupsController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public bool Save(string name, List<Customer> customers, string companyId)
        {
            bool status = _databaseService.SaveCustomerGroup(name, customers, companyId);

            return status;
        }

        public bool Edit(string name, List<Customer> customers, string customerGroupId)
        {
            bool status = _databaseService.EditCustomerGroup(name, customers, customerGroupId);

            return status;
        }

        public List<CustomerGroup> GetCustomerGroups(string companyId)
        {
            var customerGroups = _databaseService.GetCustomerGroups(companyId);
            customerGroups.Sort((x, y) => string.Compare(x.Name, y.Name));

            return customerGroups;
        }

        public List<Customer> GetConnectedCustomers(string customerGroupId)
        {
            var customers = _databaseService.GetConnectedCustomers(customerGroupId);

            var list = new List<Customer>();
            foreach(var cust in customers)
            {
                list.Add(new Customer()
                {
                    Id = cust.CustomerId,
                    Name = cust.CustomerName
                });
            }

            return list;
        }

        public string GetNameOfCustomerGroup(string customerGroupId)
        {
            var name = _databaseService.GetNameOfCustomerGroup(customerGroupId);

            return name;
        }
        
        public string GetCustomerGroupIdFromCustomerId(string customerId)
        {
            var id = _databaseService.GetCustomerGroupIdFromCustomerId(customerId);

            return id;
        }

        public bool RemoveCustomerGroup(string customerGroupId)
        {
            bool status = _databaseService.RemoveCustomerGroup(customerGroupId);

            return status;
        }

        public int GetSalesLast12Months(string companyId, string customerId)
        {
            int sales = _databaseService.GetSalesLast12MonthsCustomerGroup(companyId, customerId);

            return sales;
        }

        public List<ValueObject> SearchCustomersWithoutAlreadyTaken(string companyId, string customerSearch)
        {
            if (customerSearch == null || customerSearch == "")
                return null;

            var customers = _databaseService.GetCustomersSearch(companyId, customerSearch).Where(e => e.Status == "" || e.Status == null);

            var takenCustomers = _databaseService.GetTakenCustomers(companyId);

            var filtered = customers.Where(e => !takenCustomers.Any(y => y.CustomerId == e.Id)).ToList();

            //var customerGroups = _databaseService.GetCustomerGroupsSearch(companyId, customerSearch);
            var valueObjects = new List<ValueObject>();

            foreach (var customer in filtered)
            {
                valueObjects.Add(new ValueObject()
                {
                    Id = customer.Id,
                    Name = customer.Name,
                    Type = "Customer"
                });
            }

            //foreach (var customerGroup in customerGroups)
            //{
            //    valueObjects.Add(new ValueObject()
            //    {
            //        Id = customerGroup.Id,
            //        Name = customerGroup.Name,
            //        Type = "CustomerGroup"
            //    });
            //}

            valueObjects.Sort((x, y) => string.Compare(x.Name, y.Name));

            return valueObjects.Where(e => e.Name.Contains("#") == false && e.Name.Contains("WEB-lager") == false && e.Name.Contains("U ") == false).ToList(); ;
        }

        public List<CustomerGroupCustomer> GetCustomersInGroup(string customerGroupId)
        {
            var customers = _databaseService.GetConnectedCustomers(customerGroupId);

            return customers;
        }
      
        public CustomerGroupStatus CheckIfCustomerIsInCustomerGroup(string customerId)
        {
            var obj = _databaseService.CheckIfCustomerIsInCustomerGroup(customerId);

            return obj;
        }

    }
}
