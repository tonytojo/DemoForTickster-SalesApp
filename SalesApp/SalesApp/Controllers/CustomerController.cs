using Microsoft.AspNetCore.Mvc;
using SalesApp.Extensions;
using SalesApp.Models;
using SalesApp.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Controllers
{
    public class CustomerController : Controller
    {
        private DatabaseService _databaseService { get; set; }
        private GraphService _graphService;

        public CustomerController( DatabaseService databaseService, GraphService graphService)
        {
            _databaseService = databaseService;
            _graphService = graphService;
        }

        public List<Customer> GetCustomers(string companyId)
        {
            var customers = _databaseService.GetCustomers(companyId);

            var takenCustomers = _databaseService.GetTakenCustomers(companyId);
            var customersAlreadyValued = _databaseService.GetCustomersWithValues(companyId);

            var filtered = customers.Where(e => !takenCustomers.Any(y => y.CustomerId == e.Id)).ToList();
            var filtered2 = filtered.Where(e => !customersAlreadyValued.Any(y => y.CustomerId == e.Id)).ToList();
            var filtered3 = filtered2.Where(e => e.Name != null).ToList();

            return filtered3.Where(e => (e.Name.Contains("#") == false && e.Name.Contains("WEB-lager") == false && e.Name.Contains("U ") == false) && (e.Status == null)).ToList();
        }

        public List<ValueObject> GetAllCustomersWithoutFilter(string companyId)
        {
            var customers = _databaseService.GetCustomers(companyId).Where(e => e.Status == null);

            var valueObjects = new List<ValueObject>();

            foreach (var customer in customers)
            {
                valueObjects.Add(new ValueObject()
                {
                    Id = customer.Id,
                    Name = customer.Name,
                    Type = "Customer"
                });
            }

            return valueObjects
                .Where(e => e.Name != null && !e.Name.Contains("#") && !e.Name.Contains("WEB-lager") && !e.Name.Contains("U "))
                .ToList();
        }

        public List<ValueObject> GetCustomersAndCustomerGroups(string companyId)
        {
            var customers = _databaseService.GetCustomers(companyId).Where(e => e.Status == null);

            var takenCustomers = _databaseService.GetTakenCustomers(companyId);
            var customersAlreadyValued = _databaseService.GetCustomersWithValues(companyId);

            var filtered = customers.Where(e => !takenCustomers.Any(y => y.CustomerId == e.Id)).ToList();
            var filtered2 = filtered.Where(e => !customersAlreadyValued.Any(y => y.CustomerId == e.Id)).ToList();

            var customerGroups = _databaseService.GetCustomerGroups(companyId);
            var valueObjects = new List<ValueObject>();

            foreach(var customer in filtered)
            {
                valueObjects.Add(new ValueObject()
                {
                    Id = customer.Id,
                    Name = customer.Name,
                    Type = "Customer"
                });
            }

            foreach (var customerGroup in customerGroups)
            {
                valueObjects.Add(new ValueObject()
                {
                    Id = customerGroup.Id,
                    Name = customerGroup.Name,
                    Type = "CustomerGroup"
                });
            }

            var filtered3 = valueObjects.Where(e => !customersAlreadyValued.Any(y => y.CustomerId == e.Id)).ToList();

            return filtered3.Where(e => e.Name.Contains("#") == false && e.Name.Contains("WEB-lager") == false && e.Name.Contains("U ") == false).ToList(); ;
        }

        public List<ValueObject> GetCustomersAndCustomerGroupsSearch(string companyId, string customerSearch, bool includeValued)
        {
            if (customerSearch == null || customerSearch == "")
                return null;

            var customers = _databaseService.GetCustomersSearch(companyId, customerSearch).Where(e => e.Status == null); ;

            var takenCustomers = _databaseService.GetTakenCustomers(companyId);
            var customersAlreadyValued = _databaseService.GetCustomersWithValues(companyId);

            var filtered = customers.Where(e => !takenCustomers.Any(y => y.CustomerId == e.Id)).ToList();
            var filtered2 = filtered.Where(e => !customersAlreadyValued.Any(y => y.CustomerId == e.Id)).ToList();

            var customerGroups = _databaseService.GetCustomerGroupsSearch(companyId, customerSearch);
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

            foreach (var customerGroup in customerGroups)
            {
                valueObjects.Add(new ValueObject()
                {
                    Id = customerGroup.Id,
                    Name = customerGroup.Name,
                    Type = "CustomerGroup"
                });
            }

            if(includeValued == false)
            {
                var filtered3 = valueObjects.Where(e => !customersAlreadyValued.Any(y => y.CustomerId == e.Id)).ToList();

                filtered3.Sort((x, y) => string.Compare(x.Name, y.Name));

                return filtered3.Where(e => e.Name.Contains("#") == false && e.Name.Contains("WEB-lager") == false && e.Name.Contains("U ") == false).ToList();
            }

            return valueObjects.Where(e => e.Name.Contains("#") == false && e.Name.Contains("WEB-lager") == false && e.Name.Contains("U ") == false).ToList();
        }

        public List<ValueObject> GetCustomersWithoutFilter(string companyId, string customerSearch)
        {
            if (customerSearch == null || customerSearch == "")
                return null;

            var customers = _databaseService.GetCustomersSearch(companyId, customerSearch).Where(e => e.Status == ""); 

            //var takenCustomers = _databaseService.GetTakenCustomers(companyId);

            //var filtered = customers.Where(e => !takenCustomers.Any(y => y.CustomerId == e.Id)).ToList();

            //var customerGroups = _databaseService.GetCustomerGroupsSearch(companyId, customerSearch);
            var valueObjects = new List<ValueObject>();

            foreach (var customer in customers)
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

            return valueObjects.Where(e => e.Name.Contains("#") == false && e.Name.Contains("WEB-lager") == false && e.Name.Contains("U ") == false).ToList(); ;
        }

        public List<ValueObject> GetResponsiblesCustomersAndGroups(string companyId, string responsibleName)
        {
            var connectedCustomers = _databaseService.GetResponsiblesCustomers(companyId, responsibleName);

            var takenCustomers = _databaseService.GetTakenCustomers(companyId);

            var customerGroups = _databaseService.GetCustomerGroupsFromCustomers(companyId, connectedCustomers);

            var filtered = connectedCustomers.Where(e => !takenCustomers.Any(y => y.CustomerId == e.Id)).ToList();

            var filtered2 = filtered.Concat(customerGroups).ToList();

            filtered2.Sort((x, y) => string.Compare(x.Name, y.Name));

            return filtered2;
        }

        public List<ValueObject> SearchCustomersAndGroups(string companyId, string customerSearch)
        {
            if (customerSearch == null || customerSearch == "")
                return null;

            var customers = _databaseService.GetCustomersSearch(companyId, customerSearch).Where(e => e.Status == "" || e.Status == null);

            var takenCustomers = _databaseService.GetTakenCustomers(companyId);

            var filtered = customers.Where(e => !takenCustomers.Any(y => y.CustomerId == e.Id)).ToList();

            var customerGroups = _databaseService.GetCustomerGroupsSearch(companyId, customerSearch);
            var filteredTakenCustomers = takenCustomers.Where(e => e.CustomerName.ToLower().Contains(customerSearch.ToLower())).ToList();
            var connectedCustomerGroups = _databaseService.GetConnectedCustomerGroups(companyId, filteredTakenCustomers);

            foreach(var connectedCustomerGroup in connectedCustomerGroups)
            {
                if (!customerGroups.Contains(connectedCustomerGroup))
                {
                    customerGroups.Add(connectedCustomerGroup);
                }
            }

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

            foreach (var customerGroup in customerGroups)
            {
                valueObjects.Add(new ValueObject()
                {
                    Id = customerGroup.Id,
                    Name = customerGroup.Name,
                    Type = "CustomerGroup"
                });
            }

            valueObjects.Sort((x, y) => string.Compare(x.Name, y.Name));

            return valueObjects
                .Where(e => e.Name.Contains("#") == false && e.Name.Contains("WEB-lager") == false && e.Name
                .Contains("U ") == false)
                .ToList();
        }

        public List<CustomerContact> GetCustomerContacts(string companyId, string customerId, bool includeCustomerGroup = false)
        {
            var contacts = _databaseService.GetCustomerContacts(companyId, customerId);

            if (includeCustomerGroup)
            {
                var cgContacts = _databaseService.GetCustomerContactsFromCustomerGroup(companyId, customerId);

                var combinedList = contacts.Concat(cgContacts).ToList();

                combinedList.Sort((x, y) => string.Compare(x.FirstName, y.FirstName));

                return combinedList;
            }

            contacts.Sort((x, y) => string.Compare(x.FirstName, y.FirstName));

            return contacts;
        }

        public List<ReactMultiSelectValue> GetCustomerContactsSelect(string companyId, string customerId)
        {
            var contacts = _databaseService.GetCustomerContacts(companyId, customerId);

            contacts.Sort((x, y) => string.Compare(x.FirstName, y.FirstName));

            var list = new List<ReactMultiSelectValue>();

            list.Add(new ReactMultiSelectValue
            {
                label = "Leverantör/Partner",
                value = "Leverantör/Partner"
            });

            foreach (var mem in contacts)
            {
                list.Add(new ReactMultiSelectValue
                {
                    label = mem.FirstName + " " + mem.LastName + "-"+mem.Role,
                    value = mem.Id
                });
            }

            return list;
        }

        public List<ReactMultiSelectValue> GetSelectedCustomerContactsForMeeting(string meetingId)
        {
            var meeting = _databaseService.GetMeetingById(meetingId);
            if(meeting.TypeOfMeeting == "Projektarbete")
                return new List<ReactMultiSelectValue>();

            var contacts = _databaseService.GetSelectedCustomerContactsForMeeting(meetingId);
            var cus = _databaseService.GetCustomerContacts(contacts[0].CompanyId, contacts[0].CustomerId);

            contacts.Sort((x, y) => string.Compare(x.ContactName, y.ContactName));

            var list = new List<ReactMultiSelectValue>();

            try
            {
                foreach (var mem in contacts)
                {
                    try
                    {
                        if(mem.ContactName == "Leverantör/Partner")
                        {
                            list.Add(new ReactMultiSelectValue
                            {
                                label = mem.ContactName,
                                value = mem.Id
                            });
                        }
                        else
                        {
                            list.Add(new ReactMultiSelectValue
                            {
                                label = mem.ContactName + "-" + cus.Where(e => e.Id == mem.Id).FirstOrDefault().Role,
                                value = mem.Id
                            });
                        }

                    }
                    catch
                    {
                        var cus1 = _databaseService.GetCustomerContactsForEntireGroup(contacts[0].CompanyId, contacts[0].CustomerId);

                        foreach (var memb in contacts)
                        {
                            if(memb.ContactName == "Leverantör/Partner")
                            {
                                list.Add(new ReactMultiSelectValue
                                {
                                    label = memb.ContactName,
                                    value = memb.Id
                                });
                            }
                            else
                            {
                                list.Add(new ReactMultiSelectValue
                                {
                                    label = memb.ContactName + "-" + cus1.Where(e => e.Id == memb.Id).FirstOrDefault().Role,
                                    value = memb.Id
                                });
                            }
                        }

                        return list;
                    }
                }

                return list;
            }
            catch // Get contacts from entire customer group
            {
                var cus1 = _databaseService.GetCustomerContactsForEntireGroup(contacts[0].CompanyId, contacts[0].CustomerId);

                foreach (var mem in contacts)
                {
                    list.Add(new ReactMultiSelectValue
                    {
                        label = mem.ContactName + "-" + cus1.Where(e => e.Id == mem.Id).FirstOrDefault().Role,
                        value = mem.Id
                    });
                }

                return list;
            }

        }

        public List<ReactMultiSelectValue> GetSelectedCompanyResponsiblesForMeeting(string meetingId)
        {
            var companyResponsibles = _databaseService.GetSelectedCompanyResponsiblesForMeeting(meetingId);

            companyResponsibles.Sort((x, y) => string.Compare(x.ContactName, y.ContactName));

            var list = new List<ReactMultiSelectValue>();


                foreach (var mem in companyResponsibles)
                {

                    list.Add(new ReactMultiSelectValue
                    {
                        label = mem.ContactName,
                        value = mem.Id
                    });
                }

                return list;
        }

        public List<ReactMultiSelectValue> GetSelectedCompanyResponsiblesForProspectMeeting(string meetingId)
        {
            var companyResponsibles = _databaseService.GetSelectedCompanyResponsiblesForProspectMeeting(meetingId);

            companyResponsibles.Sort((x, y) => string.Compare(x.ContactName, y.ContactName));

            var list = new List<ReactMultiSelectValue>();


            foreach (var mem in companyResponsibles)
            {

                list.Add(new ReactMultiSelectValue
                {
                    label = mem.ContactName,
                    value = mem.Id
                });
            }

            return list;
        }

        public CustomerContact GetCustomerContact(string companyId, string customerId, string id)
        {
            return _databaseService.GetCustomerContact(companyId, customerId, id);
        }

        private static string DecodeUrlString(string url)
        {
            string newUrl;
            while ((newUrl = Uri.UnescapeDataString(url)) != url)
                url = newUrl;
            return newUrl;
        }

        public async Task<bool> SaveCustomerContact(CustomerContact customerContact)
        {
            customerContact.Id = Guid.NewGuid().ToString();

            TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;
            customerContact.FirstName = textInfo.ToTitleCase(customerContact.FirstName);
            customerContact.LastName = textInfo.ToTitleCase(customerContact.LastName);

            if (customerContact.CompanyId == "5eb7b09b-105a-4160-96b5-95b0353efcee")
            {
                if (customerContact.Role == "Inget av alternativen passar")
                {
                    await _graphService.SendEmailToOsterbergs(User.Name(), customerContact);
                }
            }

            customerContact.CreatedBy = User.UserName();

            return _databaseService.SaveCustomerContact(customerContact);
        }

        public bool EditCustomerContact(string customerId, string companyId, string firstName, string lastName, string tele, string email, string role, CustomerContact customerContact)
        {
            TextInfo textInfo = CultureInfo.CurrentCulture.TextInfo;
            customerContact.FirstName = textInfo.ToTitleCase(customerContact.FirstName);
            customerContact.LastName = textInfo.ToTitleCase(customerContact.LastName);

            return _databaseService.EditCustomerContact(customerId, companyId, firstName, lastName, tele, email, role, customerContact);
        }

        public int GetSalesLast12Months(string companyId, string customerId)
        {
            int sales = _databaseService.GetSalesLast12Months(companyId, customerId);

            return sales;
        }

        public string GetNameOfCustomerOrGroup(string companyId, string customerId)
        {
            return _databaseService.GetNameOfCustomerOrGroup(companyId, customerId);
        }

        public string GetIdOfCustomerGroupFromCustomerId(string companyId, string customerId)
        {
            return _databaseService.GetIdOfCustomerGroupFromCustomerId(companyId, customerId);
        }

        public List<FollowUp> GetFollowUps(string companyId, string customerId)
        {
            return _databaseService.GetFollowUps(companyId, customerId);
        }

        public bool SaveFollowUp(FollowUp followUp)
        {
            followUp.Comment = followUp.Comment + "-" + _databaseService.GetNameOfCustomerOrGroup(followUp.CompanyId, followUp.CustomerId);
            return _databaseService.SaveFollowUp(followUp);
        }

        public bool RemoveContact(string companyId, string customerId, string id)
        {
            var status = _databaseService.RemoveContact(companyId, customerId, id);

            return status;
        }

        public List<ValueObject> SearchCustomers(string companyId, string customerSearch)
        {
            if (customerSearch == null || customerSearch == "")
                return null;

            var customers = _databaseService.GetCustomersSearch(companyId, customerSearch).Where(e => e.Status == "" || e.Status == null); ;

            var valueObjects = new List<ValueObject>();

            foreach (var customer in customers)
            {
                valueObjects.Add(new ValueObject()
                {
                    Id = customer.Id,
                    Name = customer.Name,
                    Type = "Customer"
                });
            }

            valueObjects.Sort((x, y) => string.Compare(x.Name, y.Name));

            return valueObjects.Where(e => e.Name.Contains("#") == false && e.Name.Contains("WEB-lager") == false && e.Name.Contains("U ") == false).ToList(); ;
        }

    }
}
