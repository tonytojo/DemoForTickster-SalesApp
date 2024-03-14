using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalesApp.Models;
using SalesApp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Controllers
{
    public class ValueController : Controller
    {
        private DatabaseService _databaseService { get; set; }
        public ValueController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public List<ValueObject> GetValuedCustomers(string companyId)
        {
            var valuedCustomers = _databaseService.GetCustomersWithValues(companyId);
            var customersWithNames = _databaseService.GetCustomers(companyId);
            var customerGroupsWithNames = _databaseService.GetCustomerGroups(companyId);

            var valueObjects = new List<ValueObject>();
            foreach (var customer in valuedCustomers)
            {
                var potRevenueValue = customer.PotentialRevenue * 0.05;
                var loyaltyValue = customer.Loyalty * 0.05;
                var sortimentValue = customer.Sortiment * 0.024;
                var revenue = CalculateRevenue(customer.Revenue);
                var revenueValue = revenue * 0.024;
                var brandValue = customer.BrandValue * 0.014;
                var marketLeadingValue = customer.MarketLeading * 0.014;
                var economyValue = customer.Economy * 0.014;
                var ownerShipValue = customer.OwnerShip * 0.01;

                var sum = potRevenueValue
                            + loyaltyValue
                            + sortimentValue
                            + revenueValue
                            + brandValue
                            + marketLeadingValue
                            + economyValue
                            + ownerShipValue;

                string classification = null;
                if (sum >= 0 && sum < 0.25)
                    classification = "D";
                if (sum >= 0.25 && sum < 0.50)
                    classification = "C";
                if (sum > 0.50 && sum < 0.75)
                    classification = "B";
                if (sum > 0.75 && sum <= 1.1)
                    classification = "A";

                string name = null;
                string type = null;
                try
                {
                    name = customersWithNames.Where(e => e.CompanyId == companyId && e.Id == customer.CustomerId).FirstOrDefault().Name;
                    type = "Kund";
                }
                catch
                {
                    name = customerGroupsWithNames.Where(e => e.CompanyId == companyId && e.Id == customer.CustomerId).FirstOrDefault().Name;
                    type = "Kundgrupp";
                }
                valueObjects.Add(new ValueObject()
                {
                    Id = customer.CustomerId,
                    Name = name,
                    Classification = classification,
                    Type = type
                });
            }

            valueObjects.Sort((x, y) => string.Compare(x.Name, y.Name));

            valueObjects.Sort((x, y) => string.Compare(x.Classification, y.Classification));

            return valueObjects;
        }

        public ValueObject GetValuedCustomer(string companyId, string customerId)
        {
            var valuedCustomer = _databaseService.GetCustomerWithValues(companyId, customerId);

            var potRevenueValue = valuedCustomer.PotentialRevenue * 0.05;
            var loyaltyValue = valuedCustomer.Loyalty * 0.05;
            var sortimentValue = valuedCustomer.Sortiment * 0.024;
            var revenue = CalculateRevenue(valuedCustomer.Revenue);
            var revenueValue = revenue * 0.024;
            var brandValue = valuedCustomer.BrandValue * 0.014;
            var marketLeadingValue = valuedCustomer.MarketLeading * 0.014;
            var economyValue = valuedCustomer.Economy * 0.014;
            var ownerShipValue = valuedCustomer.OwnerShip * 0.01;

            var sum = potRevenueValue
                        + loyaltyValue
                        + sortimentValue
                        + revenueValue
                        + brandValue
                        + marketLeadingValue
                        + economyValue
                        + ownerShipValue;

            string classification = null;
            if (sum >= 0 && sum < 0.25)
                classification = "D";
            if (sum >= 0.25 && sum < 0.50)
                classification = "C";
            if (sum > 0.50 && sum < 0.75)
                classification = "B";
            if (sum > 0.75 && sum <= 1.1)
                classification = "A";

            string name;
            string type;
            try
            {
                var customerWithName = _databaseService.GetCustomer(companyId, customerId);
                name = customerWithName.Name;
                type = "Kund";
            }
            catch
            {
                var customerGroupWithName = _databaseService.GetCustomerGroup(companyId, customerId);
                name = customerGroupWithName.Name;
                type = "Kundgrupp";
            }

            return new ValueObject()
            {
                Id = valuedCustomer.CustomerId,
                Name = name,
                Classification = classification,
                Type = type,
                PotentialRevenue = valuedCustomer.PotentialRevenue,
                Loyalty = valuedCustomer.Loyalty,
                Sortiment = valuedCustomer.Sortiment,
                Revenue = valuedCustomer.Revenue,
                BrandValue = valuedCustomer.BrandValue,
                MarketLeading = valuedCustomer.MarketLeading,
                Economy = valuedCustomer.Economy,
                OwnerShip = valuedCustomer.OwnerShip
            };
        }

        public double? SaveValue(SaveValueObject valueObject, string companyId)
        {
            try
            {
                bool status = _databaseService.SaveValue(valueObject, companyId);

                if (status)
                {
                    var potRevenueValue = int.Parse(valueObject.potRevenue) * 0.05;
                    var loyaltyValue = int.Parse(valueObject.loyality) * 0.05;
                    var sortimentValue = int.Parse(valueObject.sortiment) * 0.024;
                    var revenue = CalculateRevenue(int.Parse(valueObject.revenue));
                    var revenueValue = revenue * 0.024;
                    var brandValue = int.Parse(valueObject.brandValue) * 0.014;
                    var marketLeadingValue = int.Parse(valueObject.marketLeading) * 0.014;
                    var economyValue = int.Parse(valueObject.economy) * 0.014;
                    var ownerShipValue = int.Parse(valueObject.ownerShip) * 0.01;

                    return potRevenueValue
                        + loyaltyValue
                        + sortimentValue
                        + revenueValue
                        + brandValue
                        + marketLeadingValue
                        + economyValue
                        + ownerShipValue;
                }

                return null;
            }
            catch
            {
                return null;
            }
        }

        public double? EditValue(SaveValueObject valueObject, string companyId)
        {
            try
            {
                bool status = _databaseService.EditValue(valueObject, companyId);

                if (status)
                {
                    var potRevenueValue = int.Parse(valueObject.potRevenue) * 0.05;
                    var loyaltyValue = int.Parse(valueObject.loyality) * 0.05;
                    var sortimentValue = int.Parse(valueObject.sortiment) * 0.024;
                    var revenue = CalculateRevenue(int.Parse(valueObject.revenue));
                    var revenueValue = revenue * 0.024;
                    var brandValue = int.Parse(valueObject.brandValue) * 0.014;
                    var marketLeadingValue = int.Parse(valueObject.marketLeading) * 0.014;
                    var economyValue = int.Parse(valueObject.economy) * 0.014;
                    var ownerShipValue = int.Parse(valueObject.ownerShip) * 0.01;

                    return potRevenueValue
                        + loyaltyValue
                        + sortimentValue
                        + revenueValue
                        + brandValue
                        + marketLeadingValue
                        + economyValue
                        + ownerShipValue;
                }

                return null;
            }
            catch
            {
                return null;
            }
        }

        public bool RemoveValuedCustomer(string companyId, string customerId)
        {
            var status = _databaseService.RemoveValuedCustomer(companyId, customerId);

            return status;
        }

        private int? CalculateRevenue(int value)
        {
            if (value >= 0 && value < 200000)
                return 1;
            if (value >= 200000 && value < 400000)
                return 2;
            if (value >= 400000 && value < 1000000)
                return 3;
            if (value >= 1000000 && value < 2000000)
                return 4;
            if (value >= 2000000)
                return 5;

            return null;
        }

        [AllowAnonymous]
        public bool UpdateValuedCustomer(string companyId, string customerId)
        {
            return _databaseService.UpdateValuedCustomerWithSalesR12(companyId, customerId);
        }

    }
}
