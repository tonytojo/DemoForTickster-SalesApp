using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using SalesApp.Controllers;
using SalesApp.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Services
{
    public class DatabaseService
    {
        private readonly SalesAppContext _dbContext;
        private readonly IOptions<ConnectionStrings> _connectionStrings;
        private GraphService _graphService;

        public DatabaseService(SalesAppContext dbContext, IOptions<ConnectionStrings> connectionStrings, GraphService graphService)
        {
            _dbContext = dbContext;
            _connectionStrings = connectionStrings;
            _graphService = graphService;
        }

        internal List<Customer> GetNonBudgetCustomersForSalesmanAndYear(string companyId, string userId, string name, string year)
        {
            if (companyId == "7f011702-09b2-4fc3-8f94-3033436a6fc5")// Albins Industrihandel använder inte hela namnet i kolumnen utan första bokstaven i förnamn samt första i efternamn
            {
                name = GetFormattedName(name);
            }

            var salesmanResponibleCustomers = _dbContext.Customers.Where(e => e.CompanyId == companyId && e.SalesmanResponsible == name).ToList();
            var alreadyBudgetedCustomers = _dbContext.AnnualCustomerBudgets.Where(e => e.CompanyId == companyId && e.UserId == userId && e.Year == year).ToList();

            var idsToRemove = new HashSet<string>(alreadyBudgetedCustomers.Select(b => b.CustomerId));
            var nonBudgetedCustomers = salesmanResponibleCustomers.Where(a => !idsToRemove.Contains(a.Id)).ToList();

            return nonBudgetedCustomers;
        }

        internal List<AnnualCustomerBudget> GetBudgetsForCompany(string companyId, string year)
        {
            return _dbContext.AnnualCustomerBudgets.Where(e => e.CompanyId == companyId && e.Year == year).ToList();
        }

        internal bool SaveBudget(string companyId, string chosenSalesman, string name, string chosenCustomer, string chosenYear, string budget)
        {
            try
            {
                var monthlyBudget = (decimal.Parse(budget) / 12);
                decimal roundedValue = Math.Round(monthlyBudget, 1);

                if (companyId == "7f011702-09b2-4fc3-8f94-3033436a6fc5")// Albins Industrihandel använder inte hela namnet i kolumnen utan första bokstaven i förnamn samt efternamn
                {
                    name = GetFormattedName(name);
                }

                _dbContext.AnnualCustomerBudgets.Add(new AnnualCustomerBudget()
                {
                    CompanyId = companyId,
                    Year = chosenYear,
                    CustomerId = chosenCustomer,
                    UserId = chosenSalesman,
                    UserName = name,
                    AnnualBudget = int.Parse(budget),
                    JanBudget = roundedValue,
                    FebBudget = roundedValue,
                    MarsBudget = roundedValue,
                    AprilBudget = roundedValue,
                    MayBudget = roundedValue,
                    JuneBudget = roundedValue,
                    JulyBudget = roundedValue,
                    AugBudget = roundedValue,
                    SeptBudget = roundedValue,
                    OctBudget = roundedValue,
                    NovBudget = roundedValue,
                    DecBudget = roundedValue,
                });

                _dbContext.SaveChanges();

                return true;
            }
            catch (Exception)
            {

                return false;
            }
        }

        internal bool RemoveBudget(AnnualCustomerBudget budget)
        {
            try
            {
                _dbContext.AnnualCustomerBudgets.Remove(budget);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool UpdateBudget(AnnualCustomerBudget budget)
        {
            try
            {
                decimal monthlyBudget = budget.AnnualBudget / 12;
                decimal roundedValue = Math.Round(monthlyBudget, 1);

                budget.JanBudget = roundedValue;
                budget.FebBudget = roundedValue;
                budget.MarsBudget = roundedValue;
                budget.AprilBudget = roundedValue;
                budget.MayBudget = roundedValue;
                budget.JuneBudget = roundedValue;
                budget.JulyBudget = roundedValue;
                budget.AugBudget = roundedValue;
                budget.SeptBudget = roundedValue;
                budget.OctBudget = roundedValue;
                budget.NovBudget = roundedValue;
                budget.DecBudget = roundedValue;

                var toRemove = _dbContext.AnnualCustomerBudgets.Where(e => e.Year == budget.Year && e.CompanyId == budget.CompanyId && e.CustomerId == budget.CustomerId).FirstOrDefault();
                _dbContext.AnnualCustomerBudgets.Remove(toRemove);
                _dbContext.AnnualCustomerBudgets.Add(budget);

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<Prospect> GetAllProspects(string companyId)
        {
            return _dbContext.Prospects.Where(e => e.CompanyId == companyId).ToList();
        }

        internal string GetCustomerNameByOrganisation(string customerId,string companyId)
        {
            return _dbContext.Customers.Where(e => e.Id == customerId).Select(e => e.Name).FirstOrDefault();
        }

        internal ProspectCard GetProspect(string companyId, string prospectId)
        {
            var prospect = new ProspectCard();
            prospect.Info = _dbContext.Prospects.Where(e => e.CompanyId == companyId && e.Id == prospectId).FirstOrDefault();
            prospect.Contacts = _dbContext.ProspectContacts.Where(e => e.ProspectId == prospectId && e.CompanyId == companyId).ToList();
            prospect.Meetings = _dbContext.ProspectMeetings.Where(e => e.CompanyId == companyId && e.ProspectId == prospectId).ToList();

            return prospect;
        }

        internal bool ChangeSystemRole(string companyId, string userId, bool newStatus, string role)
        {
            try
            {
                if (newStatus)
                {
                    if (role == "Admin")
                    {
                        _dbContext.Admins.Add(new Admin()
                        {
                            CompanyId = companyId,
                            UserId = userId
                        });
                    }
                    if (role == "SuperUser")
                    {
                        _dbContext.SuperUsers.Add(new SuperUser()
                        {
                            CompanyId = companyId,
                            UserId = userId
                        });
                    }
                    if (role == "StoreUser")
                    {
                        _dbContext.StoreUsers.Add(new StoreUser()
                        {
                            CompanyId = companyId,
                            UserId = userId
                        });
                    }
                    _dbContext.SaveChanges();
                }
                else
                {
                    if (role == "Admin")
                    {
                        var remove = _dbContext.Admins.Where(e => e.UserId == userId).FirstOrDefault();
                        _dbContext.Admins.Remove(remove);
                    }
                    if (role == "SuperUser")
                    {
                        var remove = _dbContext.SuperUsers.Where(e => e.UserId == userId).FirstOrDefault();
                        _dbContext.SuperUsers.Remove(remove);
                    }
                    if (role == "StoreUser")
                    {
                        var remove = _dbContext.StoreUsers.Where(e => e.UserId == userId).FirstOrDefault();
                        _dbContext.StoreUsers.Remove(remove);
                    }

                    _dbContext.SaveChanges();
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool SaveProspect(Prospect prospect)
        {
            try
            {
                var p = _dbContext.Prospects.Where(e => e.CompanyId == prospect.CompanyId && e.Name == prospect.Name).FirstOrDefault(); // Kontrollera ifall Prospekt med samma namn redan existerar

                if(p == null)
                {
                    _dbContext.Prospects.Add(prospect);
                    _dbContext.SaveChanges();

                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        internal Models.Company GetCompanyByName(string name)
        {
            try
            {
                return _dbContext.Companies.Where(e => e.Name == name).FirstOrDefault();
            }
            catch
            {
                return null;
            }
        }

        internal List<ProspectContact> GetProspectContacts(string companyId, string prospectId)
        {
            return _dbContext.ProspectContacts.Where(e => e.CompanyId == companyId && e.ProspectId == prospectId).ToList();
        }

        internal List<Deal> GetAllDealsForUser(Guid currentUserId)
        {
            try
            {
                return _dbContext.Deals.Where(e => e.UserId == currentUserId.ToString()).ToList();
            }
            catch
            {
                return null;
            }
        }

        internal bool SaveCampaign(Campaign campaign, List<ReactMultiSelectValue> salesmen)
        {
            try
            {
                campaign.Id = Guid.NewGuid().ToString();
                _dbContext.Campaigns.Add(campaign);

                var campaignUsers = new List<CampaignsUser>();

                foreach(var salesman in salesmen)
                {
                    campaignUsers.Add(new CampaignsUser()
                    {
                        CampaignId = campaign.Id,
                        UserId = salesman.value
                    });
                }

                _dbContext.CampaignsUsers.AddRange(campaignUsers);

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal string GetCustomerGroupIdFromCustomerId(string customerId)
        {
            return _dbContext.CustomerGroupCustomers.Where(e => e.CustomerId == customerId).FirstOrDefault().CustomerGroupId;
        }

        internal bool EditCampaign(Campaign campaign, List<ReactMultiSelectValue> salesmen)
        {
            try
            {
                var campaignToRemove = _dbContext.Campaigns.Where(e => e.Id == campaign.Id).FirstOrDefault();
                _dbContext.Campaigns.Remove(campaignToRemove);
                var salesmenToRemove = _dbContext.CampaignsUsers.Where(e => e.CampaignId == campaign.Id).ToList();
                _dbContext.CampaignsUsers.RemoveRange(salesmenToRemove);

                _dbContext.Campaigns.Add(campaign);

                var campaignUsers = new List<CampaignsUser>();

                foreach (var salesman in salesmen)
                {
                    campaignUsers.Add(new CampaignsUser()
                    {
                        CampaignId = campaign.Id,
                        UserId = salesman.value
                    });
                }

                _dbContext.CampaignsUsers.AddRange(campaignUsers);

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<CampaignsUser> GetSelectedMembersForCampaign(string campaignId)
        {
            return _dbContext.CampaignsUsers.Where(e => e.CampaignId == campaignId).ToList();
        }

        internal List<CustomerContact> GetAllCustomerContactsForCompany(string companyId)
        {
            return _dbContext.CustomerContacts.Where(e => e.CompanyId == companyId).ToList();
        }

        internal bool SaveDeal(string companyId, string userId, string title, string description, string priority, string customerId, string customerName, string contactName)
        {
            try
            {
                _dbContext.Deals.Add(new Deal()
                {
                    DealId = Guid.NewGuid().ToString(),
                    LaneId = 1,
                    CompanyId = companyId,
                    UserId = userId,
                    Title = title,
                    Description = description,
                    Priority = int.Parse(priority),
                    CustomerId = customerId,
                    CustomerName = customerName,
                    ContactName = contactName,
                    TimestampCreated = DateTime.Now,
                    TimestampModified = DateTime.Now
                });

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<LightUser> GetLightUsers()
        {
            return _dbContext.LightUsers.ToList();
        }

        internal bool ConvertToCustomer(string prospectId, string companyId, string customerId)
        {
            var customer = _dbContext.Customers.Where(e => e.CompanyId == companyId && e.Id == customerId).FirstOrDefault();
            if (customer == null)
                return false;

            try
            {
                var prospectContacts = _dbContext.ProspectContacts.Where(e => e.CompanyId == companyId && e.ProspectId == prospectId).ToList();
                _dbContext.ProspectContacts.RemoveRange(prospectContacts);
                foreach (var contact in prospectContacts)
                {
                    _dbContext.CustomerContacts.Add(new CustomerContact()
                    {
                        Id = contact.Id,
                        CustomerId = customerId,
                        CompanyId = companyId,
                        FirstName = contact.FirstName,
                        LastName = contact.LastName,
                        Telephone = contact.Telephone,
                        Email = contact.Email,
                        Role = contact.Role
                    });
                }

                var prospectMeetings = _dbContext.ProspectMeetings.Where(e => e.CompanyId == companyId && e.ProspectId == prospectId).ToList();
                _dbContext.ProspectMeetings.RemoveRange(prospectMeetings);
                foreach (var meeting in prospectMeetings)
                {
                    _dbContext.CustomerMeetings.Add(new CustomerMeeting()
                    {
                        MeetingId = meeting.MeetingId,
                        ProjectId = meeting.ProjectId,
                        CompanyId = companyId,
                        CustomerId = customerId,
                        CustomerName = customer.Name,
                        Date = meeting.Date,
                        ContactName = meeting.ContactName,
                        TypeOfMeeting = meeting.TypeOfMeeting,
                        ResultOfMeeting = meeting.ResultOfMeeting,
                        Comments = meeting.Comments,
                        CompanyResponsible = meeting.CompanyResponsible,
                        WeekNumber = meeting.WeekNumber,
                        LocationType = meeting.LocationType,
                    });
                }

                var prospectMeetingsExtraContacts = _dbContext.ProspectMeetingExtraCustomerContacts.Where(e => e.CompanyId == companyId && e.ProspectId == prospectId).ToList();
                _dbContext.ProspectMeetingExtraCustomerContacts.RemoveRange(prospectMeetingsExtraContacts);
                foreach (var extraCustomerContact in prospectMeetingsExtraContacts)
                {
                    _dbContext.CustomerMeetingExtraCustomerContacts.Add(new CustomerMeetingExtraCustomerContact()
                    {
                        Id = extraCustomerContact.Id,
                        CompanyId = companyId,
                        CustomerId = customerId,
                        Date = extraCustomerContact.Date,
                        TypeOfMeeting = extraCustomerContact.TypeOfMeeting,
                        ResultOfMeeting = extraCustomerContact.ResultOfMeeting,
                        ContactName = extraCustomerContact.ContactName,
                        MeetingId = extraCustomerContact.MeetingId
                    });
                }

                var prospect = _dbContext.Prospects.Where(e => e.Id == prospectId && e.CompanyId == companyId).FirstOrDefault();
                _dbContext.Prospects.Remove(prospect);

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<ProspectMeeting> GetKmRegisteredProspectMeetingsForSalesman(string companyId, string salesmanId)
        {
            return _dbContext.ProspectMeetings.Where(e => e.CompanyId == companyId && e.CompanyResponsible == salesmanId && e.KilometersDriven != null).ToList();
        }

        internal List<CustomerMeeting> GetKmRegisteredMeetingsForSalesman(string companyId, string salesmanId)
        {
            return _dbContext.CustomerMeetings.Where(e => e.CompanyId == companyId && e.CompanyResponsible == salesmanId && e.KilometersDriven != null).ToList();
        }

        internal bool RegisterSupplierTravel(SupplierTravel supplierTravel)
        {
            try
            {
                _dbContext.SupplierTravels.Add(supplierTravel);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<ProjectActivityExtraCompanyResponsible> GetSelectedCompanyResponsiblesForProject(string projectId)
        {
            return _dbContext.ProjectActivityExtraCompanyResponsibles.Where(e => e.ProjectIdId == projectId).ToList();
        }

        internal List<ProspectMeeting> GetProspectMeetingsForSalesman(string companyId, string userId)
        {
            var allMeetings = _dbContext.ProspectMeetings.Where(e => e.CompanyId == companyId).ToList();

            var extraConnections = _dbContext.ProspectMeetingExtraCompanyResponsibles.Where(e => e.Id == userId && e.CompanyId == companyId).ToList();

            var filteredMeetings = allMeetings
                .Where(meeting => extraConnections.Any(connection => connection.MeetingId == meeting.MeetingId))
                .ToList();

            var ownedMeetings = _dbContext.ProspectMeetings.Where(e => e.CompanyResponsible == userId && e.CompanyId == companyId).ToList();

            var concatenatedList = ownedMeetings.Concat(filteredMeetings).ToList();

            return concatenatedList;
        }

        internal List<ProspectMeeting> GetProspectMeetingsForSalesmanFiltered(string companyId, string userId, string fromDate, string toDate, string status)
        {
            var allMeetings = _dbContext.ProspectMeetings.Where(e => e.CompanyId == companyId).ToList();

            var extraConnections = _dbContext.ProspectMeetingExtraCompanyResponsibles.Where(e => e.Id == userId && e.CompanyId == companyId).ToList();

            var filteredMeetings = allMeetings
                .Where(meeting => extraConnections.Any(connection => connection.MeetingId == meeting.MeetingId))
                .ToList();

            var ownedMeetings = _dbContext.ProspectMeetings.Where(e => e.CompanyResponsible == userId && e.CompanyId == companyId).ToList();

            var concatenatedList = ownedMeetings.Concat(filteredMeetings).ToList();

            IQueryable<ProspectMeeting> query = concatenatedList.Where(e => e.CompanyId == companyId).AsQueryable();

            if (!string.IsNullOrEmpty(fromDate) && fromDate != "yyyy-mm-dd")
            {
                DateTime fromDateTime = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date >= fromDateTime);
            }

            if (!string.IsNullOrEmpty(toDate) && toDate != "yyyy-mm-dd")
            {
                DateTime toDateTime = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date <= toDateTime);
            }

            if (status != "Alla")
            {
                query = query.Where(e => e.ResultOfMeeting == status);
            }

            return query.ToList();
        }

        internal List<ProspectMeeting> GetAllProspectMeetingsForCompany(string companyId)
        {
            return _dbContext.ProspectMeetings.Where(e => e.CompanyId == companyId).ToList();
        }

        internal List<ProspectMeeting> GetAllProspectMeetingsForCompanyFiltered(string companyId, string fromDate, string toDate, string status)
        {
            IQueryable<ProspectMeeting> query = _dbContext.ProspectMeetings.Where(e => e.CompanyId == companyId);

            if (!string.IsNullOrEmpty(fromDate) && fromDate != "yyyy-mm-dd")
            {
                DateTime fromDateTime = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date >= fromDateTime);
            }

            if (!string.IsNullOrEmpty(toDate) && toDate != "yyyy-mm-dd")
            {
                DateTime toDateTime = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date <= toDateTime);
            }

            if (status != "Alla")
            {
                query = query.Where(e => e.ResultOfMeeting == status);
            }

            return query.ToList();
        }

        internal CustomerMeeting GetMeetingById(string meetingId)
        {
            return _dbContext.CustomerMeetings.Where(e => e.MeetingId == meetingId).FirstOrDefault();
        }

        internal CustomerGroupStatus CheckIfCustomerIsInCustomerGroup(string customerId)
        {
            Guid guidOutput;
            if (Guid.TryParse(customerId, out guidOutput))
            {
                return new CustomerGroupStatus()
                {
                    BelongsToCustomerGroup = true,
                    CustomerGroupId = customerId
                };
            }

            var customerGroupCustomer = _dbContext.CustomerGroupCustomers.Where(e => e.CustomerId == customerId).FirstOrDefault();

            if (customerGroupCustomer == null)
            {
                return new CustomerGroupStatus() { 
                    BelongsToCustomerGroup = false,
                    CustomerGroupId = ""
                };
            }
            else
            {
                return new CustomerGroupStatus()
                {
                    BelongsToCustomerGroup = true,
                    CustomerGroupId = customerGroupCustomer.CustomerGroupId
                };
            }
        }

        internal List<ProjectActivity> GetAllProjects(string companyId)
        {
            return _dbContext.ProjectActivities.Where(e => e.CompanyId == companyId).ToList();
        }

        internal List<ProjectActivity> GetAllProjectsFiltered(string companyId, string fromDate, string toDate, string status)
        {
            IQueryable<ProjectActivity> query = _dbContext.ProjectActivities.Where(e => e.CompanyId == companyId);

            if (!string.IsNullOrEmpty(fromDate) && fromDate != "yyyy-mm-dd")
            {
                DateTime fromDateTime = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date >= fromDateTime);
            }

            if (!string.IsNullOrEmpty(toDate) && toDate != "yyyy-mm-dd")
            {
                DateTime toDateTime = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date <= toDateTime);
            }

            if (status != "Alla")
            {
                query = query.Where(e => e.Status == status);
            }

            return query.ToList();
        }

        internal List<CustomerMeeting> GetAllMeetings(string companyId)
        {
            return _dbContext.CustomerMeetings.Where(e => e.CompanyId == companyId).ToList();
        }

        internal List<CustomerMeeting> GetAllMeetingsFiltered(string companyId, string fromDate, string toDate, string status)
        {
            IQueryable<CustomerMeeting> query = _dbContext.CustomerMeetings.Where(e => e.CompanyId == companyId);

            if (!string.IsNullOrEmpty(fromDate) && fromDate != "yyyy-mm-dd")
            {
                DateTime fromDateTime = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date >= fromDateTime);
            }

            if (!string.IsNullOrEmpty(toDate) && toDate != "yyyy-mm-dd")
            {
                DateTime toDateTime = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date <= toDateTime);
            }

            if (status != "Alla")
            {
                query = query.Where(e => e.ResultOfMeeting == status);
            }

            return query.ToList();
        }

        internal List<Models.ActivitySalesman> GetActivitiesCurrentMonth(string companyId, List<AdMember> members, DateTime fromDate, DateTime toDate)
        {
            var logins =  _dbContext.Logins.Where(e => e.CompanyId == companyId &&
                e.Timestamp >= fromDate &&
                e.Timestamp <= toDate).ToList();
            var projects = _dbContext.ProjectActivities.Where(e => e.CompanyId == companyId &&
               e.Date >= fromDate &&
               e.Date <= toDate).ToList();
            var customerActivities = _dbContext.CustomerMeetings.Where(e => e.CompanyId == companyId &&
               e.Date >= fromDate &&
               e.Date <= toDate).ToList();

            var superUsers = _dbContext.SuperUsers.Where(e => e.CompanyId == companyId).ToList();
            var admins = _dbContext.Admins.Where(e => e.CompanyId == companyId).ToList();
            var storeUsers = _dbContext.StoreUsers.Where(e => e.CompanyId == companyId).ToList();

            var list = new List<Models.ActivitySalesman>();
            foreach (var member in members)
            {
                list.Add(new Models.ActivitySalesman()
                {
                    UserId = member.Id,
                    SalesmanName = member.Name,
                    NoOfLogins = logins.Where(e => e.UserId == member.Id).Count(),
                    NoOfProjects = projects.Where(e => e.CompanyResponsible == member.Id || e.CompanyResponsible2 == member.Id).Count(),
                    NoOfActivities = customerActivities.Where(e => e.CompanyResponsible == member.Id).Count(),
                    NoOfKilometers = (int)customerActivities.Where(meeting => meeting.CompanyResponsible == member.Id && meeting.KilometersDriven.HasValue)
                    .Sum(meeting => meeting.KilometersDriven),
                    IsAdmin = admins.Any(e => e.UserId == member.Id),
                    IsSuperUser = superUsers.Any(e => e.UserId == member.Id),
                    IsStoreUser = storeUsers.Any(e => e.UserId == member.Id)
                });
            }

            return list;
        }

        internal List<CustomerContact> GetAllContacts(string companyId)
        {
            return _dbContext.CustomerContacts.Where(e => e.CompanyId == companyId).ToList();
        }

        internal List<ProspectContact> GetAllProspectContacts(string companyId)
        {
            return _dbContext.ProspectContacts.Where(e => e.CompanyId == companyId).ToList();
        }

        internal List<Salesman> GetAllSalesmen(string companyId)
        {
            return _dbContext.Salesmen.Where(e => e.CompanyId == companyId).ToList();
        }

        internal bool DeleteDeal(string dealId)
        {
            try
            {
                var deal = _dbContext.Deals.Where(e => e.DealId == dealId).FirstOrDefault();

                if (deal != null)
                {
                    _dbContext.Remove(deal);
                    _dbContext.SaveChanges();
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool MoveDeal(string dealId, int newLaneId)
        {
            try
            {
                var deal = _dbContext.Deals.Where(e => e.DealId == dealId).FirstOrDefault();

                if (deal != null)
                {
                    deal.LaneId = newLaneId;
                    _dbContext.SaveChanges();
                }

                return true;
            }
            catch
            {
                return false;
            }

        }

        internal bool EditProject(ProjectActivity projectActivity, List<ReactMultiSelectValue> projectActivityExtraCompanyResponsibles, ProjectActivitiesResult ProjectActivitiesResult)
        {
            try
            {
                var projectToRemove = _dbContext.ProjectActivities.Where(e => e.ProjectId == projectActivity.ProjectId).FirstOrDefault();

                _dbContext.Remove(projectToRemove);

                _dbContext.SaveChanges();
                projectActivity.LastSaved = DateTime.Now;
                _dbContext.ProjectActivities.Add(projectActivity);

                // When we create a new project and select Status = Klart we also have data in ProjectActivitiesResult that need to be saved
                var ProjectActivity = _dbContext.ProjectActivitiesResults.FirstOrDefault(e => e.ProjectId == projectActivity.ProjectId);
                if (ProjectActivity == null && ProjectActivitiesResult.Result != null)
                {
                    _dbContext.ProjectActivitiesResults.Add(ProjectActivitiesResult);
                }

                // When we already have a project with Status = Klart we know that we have data in table ProjectActivities_Result
                // We keep Status = Klart but we change the ProjectActivitiesResult in UI for example from Förlorat to Vunnet
                if (ProjectActivity != null && ProjectActivitiesResult.Result != null)
                {
                    _dbContext.ProjectActivitiesResults.Remove(ProjectActivity);
                    _dbContext.ProjectActivitiesResults.Add(ProjectActivitiesResult);
                }

                // When we already have a project with Status = Klart we know that we have data in table ProjectActivities_Result
                // But now we change in UI from Status = Klart to something else. We neew to remove the row ftom the databae
                if (ProjectActivity != null && ProjectActivitiesResult.Result == null)
                {
                    _dbContext.ProjectActivitiesResults.Remove(ProjectActivity);
                }

                 var responsiblesToRemove = _dbContext.ProjectActivityExtraCompanyResponsibles.Where(e => e.ProjectIdId == projectActivity.ProjectId);
                _dbContext.ProjectActivityExtraCompanyResponsibles.RemoveRange(responsiblesToRemove);

           
                foreach (var part in projectActivityExtraCompanyResponsibles)
                {
                    _dbContext.ProjectActivityExtraCompanyResponsibles.Add(new ProjectActivityExtraCompanyResponsible()
                    {
                        CompanyId = projectActivity.CompanyId,
                        CustomerId = projectActivity.CustomerId,
                        ContactName = part.label,
                        Id = part.value,
                        ProjectIdId = projectActivity.ProjectId
                    });
                }

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<CustomerMeeting> GetMeetingsOfEntireCustomerGroup(string customerGroupId)
        {
            var customers = _dbContext.CustomerGroupCustomers.Where(e => e.CustomerGroupId == customerGroupId).ToList();

            var customerMeetings = new List<CustomerMeeting>();
            foreach (var customer in customers)
            {
                var meetings = _dbContext.CustomerMeetings.Where(e => e.CustomerId == customer.CustomerId).ToList();
                customerMeetings.AddRange(meetings);
            }

            return customerMeetings;
        }

        internal bool RemoveProject(string projectId)
        {
            try
            {
                var projectToRemove = _dbContext.ProjectActivities.Where(e => e.ProjectId == projectId).FirstOrDefault();

                _dbContext.ArchivedProjectActivities.Add(new ArchivedProjectActivity()
                {
                    CompanyId = projectToRemove.CompanyId,
                    CustomerId = projectToRemove.CustomerId,
                    Date = projectToRemove.Date,
                    Activity = projectToRemove.Activity,
                    Description = projectToRemove.Description,
                    CompanyResponsible = projectToRemove.CompanyResponsible,
                    CustomerContact = projectToRemove.CustomerContact,
                    Status = projectToRemove.Status,
                    NextStep = projectToRemove.NextStep,
                    WeekNumber = projectToRemove.WeekNumber,
                    CustomerName = projectToRemove.CustomerName,
                    CompanyResponsible2 = projectToRemove.CompanyResponsible2,
                    ProjectId = projectToRemove.ProjectId,
                    LastSaved = projectToRemove.LastSaved,
                    Priority = projectToRemove.Priority,
                    CampaignId = projectToRemove.CampaignId
                });

                _dbContext.ProjectActivities.Remove(projectToRemove);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<ProjectActivity> GetAllProjectsForSalesman(string companyId, string userId)
        {
            return _dbContext.ProjectActivities.Where(e => e.CompanyId == companyId && (e.CompanyResponsible == userId || e.CompanyResponsible2 == userId)).ToList();
        }

        internal List<ProjectActivity> GetAllProjectsForSalesmanFiltered(string companyId, string userId, string fromDate, string toDate, string status)
        {
            IQueryable<ProjectActivity> query = _dbContext.ProjectActivities.Where(e => e.CompanyId == companyId && (e.CompanyResponsible == userId || e.CompanyResponsible2 == userId));

            if (!string.IsNullOrEmpty(fromDate) && fromDate != "yyyy-mm-dd")
            {
                DateTime fromDateTime = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date >= fromDateTime);
            }

            if (!string.IsNullOrEmpty(toDate) && toDate != "yyyy-mm-dd")
            {
                DateTime toDateTime = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date <= toDateTime);
            }

            if (status != "Alla")
            {
                query = query.Where(e => e.Status == status);
            }

            return query.ToList();
        }

        internal List<ProjectActivity> GetProjectsOfEntireCustomerGroup(string customerGroupId)
        {
            var customers = _dbContext.CustomerGroupCustomers.Where(e => e.CustomerGroupId == customerGroupId).ToList();

            var projectActivities = new List<ProjectActivity>();
            var directProjects = _dbContext.ProjectActivities.Where(e => e.CustomerId == customerGroupId).ToList();
            projectActivities.AddRange(directProjects);
            foreach (var customer in customers)
            {
                var activites = _dbContext.ProjectActivities.Where(e => e.CustomerId == customer.CustomerId).ToList();
                projectActivities.AddRange(activites);
            }

            return projectActivities;
        }

        internal List<CustomerMeetingExtraCustomerContact> GetMeetingParticipators(string companyId, string customerId, string meetingId)
        {
            return _dbContext.CustomerMeetingExtraCustomerContacts.Where(x => x.CompanyId == companyId && x.CustomerId == customerId && x.MeetingId == meetingId).ToList();
        }

        internal List<ProspectMeetingExtraCustomerContact> GetProspectMeetingParticipators(string companyId, string prospectId, string meetingId)
        {
            return _dbContext.ProspectMeetingExtraCustomerContacts.Where(x => x.CompanyId == companyId && x.ProspectId == prospectId && x.MeetingId == meetingId).ToList();
        }

        internal string GetIdOfCustomerGroupFromCustomerId(string companyId, string customerId)
        {
            try
            {
                return _dbContext.CustomerGroupCustomers.Where(e => e.CompanyId == companyId && e.CustomerId == customerId).FirstOrDefault().CustomerGroupId;
            }
            catch
            {
                return "";
            }
        }

        internal bool RemoveMeeting(CustomerMeeting meeting)
        {
            try
            {
                var meetingToRemove = _dbContext.CustomerMeetings.Where(x => x.CompanyId == meeting.CompanyId &&
                    x.CustomerId == meeting.CustomerId &&
                    x.Date == meeting.Date &&
                    x.TypeOfMeeting == meeting.TypeOfMeeting &&
                    x.ResultOfMeeting == meeting.ResultOfMeeting &&
                    x.MeetingId == meeting.MeetingId).FirstOrDefault();
                _dbContext.ArchivedCustomerMeetings.Add(new ArchivedCustomerMeeting()
                {
                    MeetingId = meetingToRemove.MeetingId,
                    ProjectId = meetingToRemove.ProjectId,
                    CompanyId = meetingToRemove.CompanyId,
                    CustomerId = meetingToRemove.CustomerId,
                    CustomerName = meetingToRemove.CustomerName,
                    Date = meetingToRemove.Date,
                    ContactName = meetingToRemove.ContactName,
                    TypeOfMeeting = meetingToRemove.TypeOfMeeting,
                    ResultOfMeeting = meetingToRemove.ResultOfMeeting,
                    Comments = meetingToRemove.Comments,
                    CompanyResponsible = meetingToRemove.CompanyResponsible,
                    WeekNumber = meetingToRemove.WeekNumber,
                    LocationType = meetingToRemove.LocationType,
                });
                _dbContext.CustomerMeetings.Remove(meetingToRemove);

                var connectedResponsiblesToRemove = _dbContext.CustomerMeetingExtraCompanyResponsibles.Where(e => e.CompanyId == meeting.CompanyId && e.MeetingId == meeting.MeetingId).ToList();
                foreach(var conn in connectedResponsiblesToRemove)
                {
                    _dbContext.ArchivedCustomerMeetingExtraCompanyResponsibles.Add(new ArchivedCustomerMeetingExtraCompanyResponsible()
                    {
                        Id = conn.Id,
                        CompanyId = conn.CompanyId,
                        CustomerId = conn.CustomerId,
                        Date = conn.Date,
                        TypeOfMeeting = conn.TypeOfMeeting,
                        ResultOfMeeting = conn.ResultOfMeeting,
                        ContactName = conn.ContactName,
                        MeetingId = conn.MeetingId
                    });
                }
                _dbContext.CustomerMeetingExtraCompanyResponsibles.RemoveRange(connectedResponsiblesToRemove);

                var connectedContactsToRemove = _dbContext.CustomerMeetingExtraCustomerContacts.Where(e => e.CompanyId == meeting.CompanyId && e.MeetingId == meeting.MeetingId).ToList();
                foreach (var conn in connectedContactsToRemove)
                {
                    _dbContext.ArchivedCustomerMeetingExtraCustomerContacts.Add(new ArchivedCustomerMeetingExtraCustomerContact()
                    {
                        Id = conn.Id,
                        CompanyId = conn.CompanyId,
                        CustomerId = conn.CustomerId,
                        Date = conn.Date,
                        TypeOfMeeting = conn.TypeOfMeeting,
                        ResultOfMeeting = conn.ResultOfMeeting,
                        ContactName = conn.ContactName,
                        MeetingId = conn.MeetingId
                    });
                }
                _dbContext.CustomerMeetingExtraCustomerContacts.RemoveRange(connectedContactsToRemove);

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool RemoveProspectMeeting(ProspectMeeting meeting)
        {
            try
            {
                var meetingToRemove = _dbContext.ProspectMeetings.Where(x => x.CompanyId == meeting.CompanyId &&
                    x.ProspectId == meeting.ProspectId &&
                    x.Date == meeting.Date &&
                    x.TypeOfMeeting == meeting.TypeOfMeeting &&
                    x.ResultOfMeeting == meeting.ResultOfMeeting &&
                    x.MeetingId == meeting.MeetingId).FirstOrDefault();
                _dbContext.ArchivedProspectMeetings.Add(new ArchivedProspectMeeting()
                {
                    MeetingId = meetingToRemove.MeetingId,
                    ProjectId = meetingToRemove.ProjectId,
                    CompanyId = meetingToRemove.CompanyId,
                    ProspectId = meetingToRemove.ProspectId,
                    ProspectName = meetingToRemove.ProspectName,
                    Date = meetingToRemove.Date,
                    ContactName = meetingToRemove.ContactName,
                    TypeOfMeeting = meetingToRemove.TypeOfMeeting,
                    ResultOfMeeting = meetingToRemove.ResultOfMeeting,
                    Comments = meetingToRemove.Comments,
                    CompanyResponsible = meetingToRemove.CompanyResponsible,
                    WeekNumber = meetingToRemove.WeekNumber,
                    LocationType = meetingToRemove.LocationType,
                });
                _dbContext.ProspectMeetings.Remove(meetingToRemove);

                var connectedResponsiblesToRemove = _dbContext.ProspectMeetingExtraCompanyResponsibles.Where(e => e.CompanyId == meeting.CompanyId && e.MeetingId == meeting.MeetingId).ToList();
                foreach (var conn in connectedResponsiblesToRemove)
                {
                    _dbContext.ArchivedProspectMeetingExtraCompanyResponsibles.Add(new ArchivedProspectMeetingExtraCompanyResponsible()
                    {
                        Id = conn.Id,
                        CompanyId = conn.CompanyId,
                        ProspectId = conn.ProspectId,
                        Date = conn.Date,
                        TypeOfMeeting = conn.TypeOfMeeting,
                        ResultOfMeeting = conn.ResultOfMeeting,
                        ContactName = conn.ContactName,
                        MeetingId = conn.MeetingId
                    });
                }
                _dbContext.ProspectMeetingExtraCompanyResponsibles.RemoveRange(connectedResponsiblesToRemove);

                var connectedContactsToRemove = _dbContext.ProspectMeetingExtraCustomerContacts.Where(e => e.CompanyId == meeting.CompanyId && e.MeetingId == meeting.MeetingId).ToList();
                foreach (var conn in connectedContactsToRemove)
                {
                    _dbContext.ArchivedProspectMeetingExtraCustomerContacts.Add(new ArchivedProspectMeetingExtraCustomerContact()
                    {
                        Id = conn.Id,
                        CompanyId = conn.CompanyId,
                        ProspectId = conn.ProspectId,
                        Date = conn.Date,
                        TypeOfMeeting = conn.TypeOfMeeting,
                        ResultOfMeeting = conn.ResultOfMeeting,
                        ContactName = conn.ContactName,
                        MeetingId = conn.MeetingId
                    });
                }
                _dbContext.ProspectMeetingExtraCustomerContacts.RemoveRange(connectedContactsToRemove);

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<CustomerMeeting> GetKmUnregisteredMeetingsForSalesman(string companyId, string userId)
        {
            var meetings = _dbContext.CustomerMeetings.Where(e => e.CompanyId == companyId && e.CompanyResponsible == userId && e.KilometersDriven == null).ToList();

            return meetings;
        }

        internal List<ProspectMeeting> GetKmUnregisteredProspectMeetingsForSalesman(string companyId, string userId)
        {
            var meetings = _dbContext.ProspectMeetings.Where(e => e.CompanyId == companyId && e.CompanyResponsible == userId && e.KilometersDriven == null).ToList();

            return meetings;
        }

        internal List<SupplierTravel> GetSupplierTravelsForSalesman(string companyId, string userId)
        {
            var travels = _dbContext.SupplierTravels.Where(e => e.CompanyId == companyId && e.UserId == userId).ToList();

            return travels;
        }

        internal List<CustomerGroup> GetConnectedCustomerGroups(string companyId, List<CustomerGroupCustomer> connectedCustomers)
        {
            var customerIds = connectedCustomers.Select(e => e.CustomerGroupId).ToList();
            return _dbContext.CustomerGroups.Where(e => e.CompanyId == companyId && customerIds.Contains(e.Id)).ToList();
        }

        internal bool RegisterKilometers(string companyId, string meetingId, string kilometers)
        {
            try
            {
                var meeting = _dbContext.CustomerMeetings.Where(e => e.CompanyId == companyId && e.MeetingId == meetingId).FirstOrDefault();

                meeting.KilometersDriven = int.Parse(kilometers);

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool RegisterProspectKilometers(string companyId, string meetingId, string kilometers)
        {
            try
            {
                var meeting = _dbContext.ProspectMeetings.Where(e => e.CompanyId == companyId && e.MeetingId == meetingId).FirstOrDefault();

                meeting.KilometersDriven = int.Parse(kilometers);

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<ValueObject> GetCustomerGroupsFromCustomers(string companyId, List<ValueObject> connectedCustomers)
        {
            var ids = connectedCustomers.Select(e => e.Id).ToList();
            var customerGroupCustomers = _dbContext.CustomerGroupCustomers.Where(e => e.CompanyId == companyId && ids.Contains(e.CustomerId)).ToList();

            var cIds = customerGroupCustomers.Select(e => e.CustomerGroupId).ToList();
            var customerGroups = _dbContext.CustomerGroups.Where(e => e.CompanyId == companyId && cIds.Contains(e.Id)).ToList();

            var valuedCustomers = _dbContext.CustomerValues.Where(e => e.CompanyId == companyId).ToList();

            var list = new List<ValueObject>();
            foreach(var group in customerGroups)
            {
                list.Add(new ValueObject()
                {
                    Id = group.Id,
                    Name = group.Name,
                    Type = "CustomerGroup",
                    Classification = valuedCustomers.FirstOrDefault(e => e.CustomerId == group.Id)?.Classification
                });
            }

            return list;
        }

        internal object CheckSuperUser(string companyId, Guid currentUserId)
        {
            try
            {
                var superUser = _dbContext.SuperUsers.Where(e => e.CompanyId == companyId && e.UserId == currentUserId.ToString()).FirstOrDefault();

                if (superUser != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        internal bool UpdateValuedCustomerWithSalesR12(string companyId, string customerId)
        {
            Guid guidOutput;
            var salesR12 = Guid.TryParse(customerId, out guidOutput) ? GetSalesLast12MonthsCustomerGroup(companyId, customerId) : GetSalesLast12Months(companyId, customerId);
            var valuedCustomer = GetCustomerWithValues(companyId, customerId);

            var status = EditValue(new SaveValueObject()
            {
                customerId = valuedCustomer.CustomerId,
                customerName = valuedCustomer.Name,
                potRevenue = valuedCustomer.PotentialRevenue.ToString(),
                loyality = valuedCustomer.Loyalty.ToString(),
                sortiment = valuedCustomer.Sortiment.ToString(),
                revenue = salesR12.ToString(),
                brandValue = valuedCustomer.BrandValue.ToString(),
                marketLeading = valuedCustomer.MarketLeading.ToString(),
                economy = valuedCustomer.Economy.ToString(),
                ownerShip = valuedCustomer.OwnerShip.ToString()

            }, companyId);

            return status;
        }

        internal object CheckLightUser(string companyId, Guid currentUserId)
        {
            try
            {
                var lightUser = _dbContext.LightUsers.Where(e => e.CompanyId == companyId && e.UserId == currentUserId.ToString()).FirstOrDefault();

                if (lightUser != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        internal bool CheckStoreUser(string companyId, Guid currentUserId)
        {
            try
            {
                var storeUser = _dbContext.StoreUsers.Where(e => e.CompanyId == companyId && e.UserId == currentUserId.ToString()).FirstOrDefault();

                if (storeUser != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

        internal bool CheckKilometersObliged(string companyId, Guid currentUserId)
        {
            try
            {
                var kmUser = _dbContext.KilometersDrivenObligeds.Where(e => e.CompanyId == companyId && e.UserId == currentUserId.ToString()).FirstOrDefault();

                if (kmUser != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }


        internal ProjectActivity GetProject(string companyId, string customerId, string projectId)
        {
            return _dbContext.ProjectActivities.Where(e => e.CompanyId == companyId && e.CustomerId == customerId && e.ProjectId == projectId).FirstOrDefault();
        }

        internal ProjectActivitiesResult GetProjectResult(string projectId)
        {
            var result = _dbContext.ProjectActivitiesResults.Where(e => e.ProjectId == projectId).FirstOrDefault();
            return result;
        }



        internal List<ProjectActivity> GetProjectsForSalesmanAndWeek(string salesman, string type, string value, string companyId)
        {
            var currentYear = DateTime.Now.Year.ToString();

            if (type == "Vecka")
            {
                return _dbContext.ProjectActivities.Where(e => e.CompanyResponsible == salesman && e.WeekNumber == int.Parse(value) && e.Date.Year.ToString() == currentYear).ToList();
            }
            if (type == "Månad")
            {
                if (value.Length == 1)
                    value = "0" + value;

                var v = currentYear + "-" + value;
                return _dbContext.ProjectActivities.Where(e => e.CompanyResponsible == salesman && e.Date.ToString().Contains(v)).ToList();
            }

            return _dbContext.ProjectActivities.Where(e => e.CompanyResponsible == salesman && e.Date.ToString().Contains(value)).ToList();
        }

        internal Company GetCompanyById(string companyId)
        {
            return _dbContext.Companies.Where(e => e.Id == companyId).FirstOrDefault();
        }

        internal List<CustomerMeeting> GetMeetingsForSalesman(string companyId, string salesman)
        {
            var allMeetings = _dbContext.CustomerMeetings.Where(e => e.CompanyId == companyId).ToList();

            var extraConnections = _dbContext.CustomerMeetingExtraCompanyResponsibles.Where(e => e.Id == salesman && e.CompanyId == companyId).ToList();

            var filteredMeetings = allMeetings
                .Where(meeting => extraConnections.Any(connection => connection.MeetingId == meeting.MeetingId))
                .ToList();

            var ownedMeetings = _dbContext.CustomerMeetings.Where(e => e.CompanyResponsible == salesman && e.CompanyId == companyId).ToList();

            var concatenatedList = ownedMeetings.Concat(filteredMeetings).ToList();

            return concatenatedList;
        }

        internal List<CustomerMeeting> GetMeetingsForSalesmanFiltered(string companyId, string salesman, string fromDate, string toDate, string status)
        {
            var allMeetings = _dbContext.CustomerMeetings.Where(e => e.CompanyId == companyId).ToList();

            var extraConnections = _dbContext.CustomerMeetingExtraCompanyResponsibles.Where(e => e.Id == salesman && e.CompanyId == companyId).ToList();

            var filteredMeetings = allMeetings
                .Where(meeting => extraConnections.Any(connection => connection.MeetingId == meeting.MeetingId))
                .ToList();

            var ownedMeetings = _dbContext.CustomerMeetings.Where(e => e.CompanyResponsible == salesman && e.CompanyId == companyId).ToList();

            var concatenatedList = ownedMeetings.Concat(filteredMeetings).ToList();

            IQueryable<CustomerMeeting> query = concatenatedList.Where(e => e.CompanyId == companyId).AsQueryable();

            if (!string.IsNullOrEmpty(fromDate) && fromDate != "yyyy-mm-dd")
            {
                DateTime fromDateTime = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date >= fromDateTime);
            }

            if (!string.IsNullOrEmpty(toDate) && toDate != "yyyy-mm-dd")
            {
                DateTime toDateTime = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date <= toDateTime);
            }

            if (status != "Alla")
            {
                query = query.Where(e => e.ResultOfMeeting == status);
            }

            return query.ToList();
        }

        internal async Task<bool> SaveProject(ProjectActivity projectActivity, List<string> customerMeetingExtraCompanyResponsibles, ProjectActivitiesResult ProjectActivitiesResult)
        {
            var name = GetCustomerNameForProject(projectActivity.CustomerId, projectActivity.CompanyId);
            projectActivity.CustomerName = name;
            projectActivity.LastSaved = DateTime.Now;
            projectActivity.ProjectId = Guid.NewGuid().ToString();
            try
            {
                _dbContext.ProjectActivities.Add(projectActivity);

                var adGroups = await _graphService.GetGroupsByUserAsync(Guid.Parse(projectActivity.CompanyResponsible));
                var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();
                var members = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());
                foreach (var companyResponsible in customerMeetingExtraCompanyResponsibles)
                {
                    var responsible = members.Where(e => e.Id == companyResponsible).FirstOrDefault();

                    var salesmanName = responsible.Name;

                    _dbContext.ProjectActivityExtraCompanyResponsibles.Add(new ProjectActivityExtraCompanyResponsible()
                    {
                        CompanyId = projectActivity.CompanyId,
                        CustomerId = projectActivity.CustomerId,
                        Id = responsible.Id,
                        ContactName = salesmanName,
                        ProjectIdId = projectActivity.ProjectId
                    });
                }

                // When we create a new project and select Status = Klart we also have data in ProjectActivitiesResult that need to be saved
               if (ProjectActivitiesResult.Result != null)
                {
                    ProjectActivitiesResult.ProjectId = projectActivity.ProjectId;
                    _dbContext.ProjectActivitiesResults.Add(ProjectActivitiesResult);
                }
                    
                
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal void SaveLogin(string companyId, string companyName, string userId, string name)
        {
            var login = new Login();
            login.CompanyId = companyId;
            login.CompanyName = companyName;
            login.UserId = userId;
            login.Name = name;
            login.Timestamp = DateTime.Now;

            _dbContext.Logins.Add(login);

            _dbContext.SaveChanges();
        }

        private string GetCustomerNameForProject(string customerId, string companyId)
        {
            try
            {
                return _dbContext.Customers.Where(e => e.Id == customerId && e.CompanyId == companyId).FirstOrDefault().Name;
            }
            catch
            {
                return _dbContext.CustomerGroups.Where(e => e.Id == customerId && e.CompanyId == companyId).FirstOrDefault().Name;
            }
        }

        internal List<CustomerContact> GetCustomerContactsFromCustomerGroup(string companyId, string customerId)
        {
            var cgCustomer = _dbContext.CustomerGroupCustomers.Where(e => e.CompanyId == companyId && e.CustomerId == customerId).FirstOrDefault();

            return _dbContext.CustomerContacts.Where(e => e.CustomerId == cgCustomer.CustomerGroupId).ToList();
        }

        internal bool SaveCustomerGroup(string name, List<Customer> customers, string companyId)
        {
            var valuedCustomers = _dbContext.CustomerValues.Where(e => e.CompanyId == companyId).ToList();

            try
            {
                var newId = Guid.NewGuid();
                _dbContext.CustomerGroups.Add(new CustomerGroup()
                {
                    Id = newId.ToString(),
                    Name = name.ToUpper(),
                    CompanyId = companyId
                });

                _dbContext.SaveChanges();

                foreach(var customer in customers)
                {
                    _dbContext.CustomerGroupCustomers.Add(new CustomerGroupCustomer()
                    {
                        CustomerGroupId = newId.ToString(),
                        CompanyId = companyId,
                        CustomerId = customer.Id,
                        CustomerName = customer.Name
                    });

                    foreach(var valCustomer in valuedCustomers)
                    {
                        if (valCustomer.CustomerId == customer.Id) // Delete customer from ValuedCustomers table if it exists there
                        {
                            _dbContext.CustomerValues.Remove(valCustomer);
                        }
                    }
                }

                _dbContext.SaveChanges();



                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<CustomerMeetingExtraCustomerContact> GetSelectedCustomerContactsForMeeting(string meetingId)
        {
            return _dbContext.CustomerMeetingExtraCustomerContacts.Where(e => e.MeetingId == meetingId).ToList();
        }
        
        internal List<CustomerMeetingExtraCompanyResponsible> GetSelectedCompanyResponsiblesForMeeting(string meetingId)
        {
            return _dbContext.CustomerMeetingExtraCompanyResponsibles.Where(e => e.MeetingId == meetingId).ToList();
        }

        internal List<ProspectMeetingExtraCompanyResponsible> GetSelectedCompanyResponsiblesForProspectMeeting(string meetingId)
        {
            return _dbContext.ProspectMeetingExtraCompanyResponsibles.Where(e => e.MeetingId == meetingId).ToList();
        }

        internal List<ProspectMeetingExtraCustomerContact> GetSelectedProspectContactsForMeeting(string meetingId)
        {
            return _dbContext.ProspectMeetingExtraCustomerContacts.Where(e => e.MeetingId == meetingId).ToList();
        }

        internal List<ValueObject> GetResponsiblesCustomers(string companyId, string responsibleName)
        {
            if(companyId == "7f011702-09b2-4fc3-8f94-3033436a6fc5")// Albins Industrihandel använder inte hela namnet i kolumnen utan första bokstaven i förnamn samt efternamn
            {
                responsibleName = GetFormattedName(responsibleName);
            }
            var valuedCustomers = _dbContext.CustomerValues.Where(e => e.CompanyId == companyId).ToList();
            var customers = _dbContext.Customers.Where(x => x.CompanyId == companyId &&
            (
            x.SalesmanResponsible.ToUpper() == responsibleName.ToUpper() ||
            x.ProduktsäljHydraulik == responsibleName ||
            x.ProduktsäljSkydd == responsibleName ||
            x.ProduktsäljSkärande == responsibleName ||
            x.ProduktsäljSlip == responsibleName ||
            x.ProduktsäljTillsatsmat == responsibleName ||
            x.ProduktsäljTransmission == responsibleName ||
            x.ProduktsäljTryckluft == responsibleName
            )
            ).ToList().Where(e => e.Status == null);

            var list = new List<ValueObject>();
            foreach(var customer in customers)
            {
                list.Add(
                    new ValueObject
                    {
                        Id = customer.Id,
                        Name = customer.Name,
                        Type = "Customer",
                        Classification = valuedCustomers.FirstOrDefault(e => e.CustomerId == customer.Id)?.Classification
                    }
                );
            }

            return list;
        }

        static string GetFormattedName(string fullName)
        {
            string[] nameParts = fullName.Split(' ');

            if (nameParts.Length >= 2)
            {
                string formattedName = $"{nameParts[0][0]}{nameParts[1][0]}";

                return formattedName;
            }

            return fullName;
        }

        internal bool RemoveContact(string companyId, string customerId, string id)
        {
            try
            {
                var contact = _dbContext.CustomerContacts.Where(x => x.CompanyId == companyId && x.Id == id).FirstOrDefault();
                _dbContext.CustomerContacts.Remove(contact);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool RemoveOption(string companyId, string option)
        {
            try
            {
                var optionToRemove = _dbContext.StatusOptions.Where(x => x.CompanyId == companyId && x.OptionValue == option).FirstOrDefault();
                _dbContext.StatusOptions.Remove(optionToRemove);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal CustomerContact GetCustomerContact(string companyId, string customerId, string id)
        {
            return _dbContext.CustomerContacts.Where(x => x.CompanyId == companyId && x.CustomerId == customerId && x.Id == id).FirstOrDefault();
        }

        internal ProspectContact GetProspectContact(string companyId, string prospectId, string id)
        {
            return _dbContext.ProspectContacts.Where(x => x.CompanyId == companyId && x.ProspectId == prospectId && x.Id == id).FirstOrDefault();
        }

        internal bool SaveOption(string companyId, string option)
        {
            try
            {
                _dbContext.StatusOptions.Add(new StatusOption()
                {
                    CompanyId = companyId,
                    OptionValue = option
                });

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool EditCustomerContact(string customerId, string companyId, string firstName, string lastName, string tele, string email, string role, CustomerContact customerContact)
        {
            var contactToRemove = _dbContext.CustomerContacts.Where(x => x.CompanyId == companyId
                                    && x.CustomerId == customerId
                                    && x.Id == customerContact.Id).FirstOrDefault();

            if (contactToRemove == null)
                return false;

            _dbContext.CustomerContacts.Remove(contactToRemove);
            _dbContext.SaveChanges();

            _dbContext.CustomerContacts.Add(customerContact);
            _dbContext.SaveChanges();

            return true;
        }

        internal bool EditProspectContact(string prospectId, string companyId, ProspectContact prospectContact)
        {
            var contactToRemove = _dbContext.ProspectContacts.Where(x => x.CompanyId == companyId
                                    && x.ProspectId == prospectId
                                    && x.Id == prospectContact.Id).FirstOrDefault();

            if (contactToRemove == null)
                return false;

            _dbContext.ProspectContacts.Remove(contactToRemove);
            _dbContext.SaveChanges();

            _dbContext.ProspectContacts.Add(prospectContact);
            _dbContext.SaveChanges();

            return true;
        }

        internal List<StatusOption> GetOptions(string companyId)
        {
            return _dbContext.StatusOptions.Where(e => e.CompanyId == companyId).ToList();
        }

        internal List<ProjectActivity> GetProjectsForSalesman(string companyId, string salesman)
        {
            return _dbContext.ProjectActivities.Where(e => e.CompanyId == companyId && (e.CompanyResponsible == salesman || e.CompanyResponsible2 == salesman)).ToList();
        }



        internal dynamic CheckAdmin(string companyId, Guid currentUserId)
        {
            try
            {
                var admin = _dbContext.Admins.Where(e => e.CompanyId == companyId && e.UserId == currentUserId.ToString()).FirstOrDefault();
                
                if(admin != null)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }

       internal List<string> GetAdminUserForOrganisation(string companyId)
        {
            var admins = _dbContext.Admins.Where(e => e.CompanyId == companyId).Select(e => e.UserId).ToList();
            return admins;
        }

        internal List<CustomerValue> GetCustomersWithValues(string companyId)
        {
            return _dbContext.CustomerValues.Where(x => x.CompanyId == companyId).ToList();
        }

        internal Campaign GetCampaign(string campaignId)
        {
            return _dbContext.Campaigns.Where(x => x.Id == campaignId).FirstOrDefault();
        }

        internal List<string> GetSalesNameOnProjectId(string Id)
        {
            return _dbContext.ProjectActivityExtraCompanyResponsibles.Where(x => x.ProjectIdId == Id).Select(e => e.ContactName).ToList();
        }


        internal List<Campaign> GetCampaigns(string companyId)
        {
            return _dbContext.Campaigns.Where(x => x.CompanyId == companyId).ToList();
        }

        internal List<Campaign> GetCampaignsForSalesman(string companyId, string userId)
        {
            var campaignUsers = _dbContext.CampaignsUsers.Where(e => e.UserId == userId).ToList();
            var campaignIds = campaignUsers.Select(e => e.CampaignId).ToList();

            return _dbContext.Campaigns.Where(x => x.CompanyId == companyId && campaignIds.Contains(x.Id)).ToList();
        }

        internal bool EditCustomerGroup(string name, List<Customer> customers, string customerGroupId)
        {

            try
            {
                var group = _dbContext.CustomerGroups.SingleOrDefault(b => b.Id == customerGroupId);

                if (group != null)
                {
                    group.Name = name.ToUpper();
                    _dbContext.SaveChanges();

                    var list = _dbContext.CustomerGroupCustomers.Where(x => x.CustomerGroupId == customerGroupId).ToList();
                    var companyId = list.First().CompanyId;
                    var valuedCustomers = _dbContext.CustomerValues.Where(e => e.CompanyId == companyId).ToList();

                    _dbContext.CustomerGroupCustomers.RemoveRange(list);
                    _dbContext.SaveChanges();

                    foreach (var cust in customers)
                    {
                        _dbContext.CustomerGroupCustomers.Add(new CustomerGroupCustomer()
                        {
                            CustomerGroupId = customerGroupId,
                            CustomerId = cust.Id,
                            CustomerName = cust.Name,
                            CompanyId = companyId
                        });

                        foreach (var valCustomer in valuedCustomers)
                        {
                            if (valCustomer.CustomerId == cust.Id) // Delete customer from ValuedCustomers table if it exists there
                            {
                                _dbContext.CustomerValues.Remove(valCustomer);
                            }
                        }
                    }
                    _dbContext.SaveChanges();

                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        internal int GetSalesLast12MonthsCustomerGroup(string companyId, string customerId)
        {
            DateTime lastYear = DateTime.Today.AddYears(-1);

            var customers = _dbContext.CustomerGroupCustomers.Where(e => e.CustomerGroupId == customerId).ToList();

            int amount = 0;

            foreach (var customer in customers)
            {
                var sales = _dbContext.Sales.Where(e => e.CompanyId == companyId && e.CustomerId == customer.CustomerId && e.Date > lastYear).ToList();

                foreach (var sale in sales)
                {
                    amount = amount + (int)sale.Amount;
                }
            }

            return amount;
        }

        internal List<CustomerGroup> GetCustomerGroupsSearch(string companyId, string customer)
        {
            try
            {
                var customerGroups = _dbContext.CustomerGroups.Where(e => e.CompanyId == companyId && e.Name.Contains(customer) ).ToList();

                return customerGroups;
            }
            catch
            {
                return null;
            }
        }

        internal List<Customer> GetCustomersSearch(string companyId, string customer)
        {
            var customers = _dbContext.Customers.Where(e => e.CompanyId == companyId && (e.Name.Contains(customer) || e.Id.Contains(customer))).ToList();

            return customers;
        }

        internal int GetSalesLast12Months(string companyId, string customerId)
        {
            DateTime lastYear = DateTime.Today.AddYears(-1);

            string connectionString = _connectionStrings.Value.SalesAppDb ;

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                var query = $"SELECT SUM(Amount) FROM Sales WHERE CompanyId = @CompanyId AND CustomerId = @CustomerId AND Date > @LastYear";

                using (var command = new SqlCommand(query, connection))
                {
                    try
                    {
                        command.CommandTimeout = 0;

                        command.Parameters.AddWithValue("@CompanyId", companyId);
                        command.Parameters.AddWithValue("@CustomerId", customerId);
                        command.Parameters.AddWithValue("@LastYear", lastYear);

                        int amount = (int?)command.ExecuteScalar() ?? 0;

                        return amount;
                    }
                    catch
                    {
                        return 0;
                    }
                }
            }
        }

        internal List<FollowUp> GetFollowUps(string companyId, string customerId)
        {
            return _dbContext.FollowUps.Where(e => e.CompanyId == companyId && e.CustomerId == customerId).ToList();
        }

        internal bool SaveFollowUp(FollowUp followUp)
        {
            try
            {
                _dbContext.FollowUps.Add(followUp);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal string GetIdOfCustomer(string customerName)
        {
            return _dbContext.Customers.Where(x => x.Name == customerName).FirstOrDefault().Id;
        }

        internal bool SaveValue(SaveValueObject valueObject, string companyId)
        {
            var classification = GetClassification(valueObject);
            var c = Guid.NewGuid();
            var isCustomerGroup = Guid.TryParse(valueObject.customerId, out c);
            try
            {
                _dbContext.CustomerValues.Add(new CustomerValue()
                {
                    CustomerId = valueObject.customerId,
                    CompanyId = companyId,
                    PotentialRevenue = int.Parse(valueObject.potRevenue),
                    Loyalty = int.Parse(valueObject.loyality),
                    Sortiment = int.Parse(valueObject.sortiment),
                    Revenue = int.Parse(valueObject.revenue),
                    BrandValue = int.Parse(valueObject.brandValue),
                    MarketLeading = int.Parse(valueObject.marketLeading),
                    Economy = int.Parse(valueObject.economy),
                    OwnerShip = int.Parse(valueObject.ownerShip),
                    Classification = classification,
                    Name = valueObject.customerName,
                    CustomerGroup = isCustomerGroup.ToString()
                });

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal CustomerGroup GetCustomerGroup(string companyId, string customerId)
        {
            return _dbContext.CustomerGroups.Where(e => e.Id == customerId && e.CompanyId == companyId).FirstOrDefault();
        }

        internal Customer GetCustomer(string companyId, string customerId)
        {
            return _dbContext.Customers.Where(e => e.CompanyId == companyId && e.Id == customerId).FirstOrDefault();
        }

        internal CustomerValue GetCustomerWithValues(string companyId, string customerId)
        {
            return _dbContext.CustomerValues.Where(x => x.CompanyId == companyId && x.CustomerId == customerId).FirstOrDefault();
        }

        internal string GetIdOfCustomerGroup(string name)
        {
            return _dbContext.CustomerGroups.Where(x => x.Name == name).FirstOrDefault().Id;
        }

        internal string GetNameOfCustomerGroup(string customerGroupId)
        {
            return _dbContext.CustomerGroups.Where(x => x.Id == customerGroupId).FirstOrDefault().Name;
        }

        internal List<CustomerGroupCustomer> GetConnectedCustomers(string customerGroupId)
        {
            try
            {
                var customers = _dbContext.CustomerGroupCustomers.Where(e => e.CustomerGroupId == customerGroupId).ToList();

                return customers;
            }
            catch
            {
                return null;
            }
        }

        internal bool RemoveCustomerGroup(string customerGroupId)
        {
            try
            {
                var customerValues = _dbContext.CustomerValues.Where(x => x.CustomerId == customerGroupId);
                _dbContext.CustomerValues.RemoveRange(customerValues);
                _dbContext.SaveChanges();

                var customerGroupCustomers = _dbContext.CustomerGroupCustomers.Where(x => x.CustomerGroupId == customerGroupId);
                _dbContext.CustomerGroupCustomers.RemoveRange(customerGroupCustomers);
                _dbContext.SaveChanges();

                var customerGroup = _dbContext.CustomerGroups.Where(x => x.Id == customerGroupId);
                _dbContext.CustomerGroups.RemoveRange(customerGroup);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal List<CustomerGroup> GetCustomerGroups(string companyId)
        {
            try
            {
                var customerGroups = _dbContext.CustomerGroups.Where(e => e.CompanyId == companyId).ToList();

                return customerGroups;
            }
            catch
            {
                return null;
            }
        }

        internal List<CustomerGroupCustomer> GetTakenCustomers(string companyId)
        {
            try
            {
                var customers = _dbContext.CustomerGroupCustomers.Where(e => e.CompanyId == companyId).ToList();

                return customers;
            }
            catch
            {
                return null;
            }
        }

        internal List<Customer> GetCustomers(string companyId)
        {
            return _dbContext.Customers.Where(e => e.CompanyId == companyId).ToList();
        }

        internal bool EditMeeting(CustomerMeeting customerMeeting, List<ReactMultiSelectValue> customerMeetingExtraCustomerContacts, List<ReactMultiSelectValue> customerMeetingExtraCompanyResponsibles)
        {
            try
            {
                DateTimeFormatInfo dfi = DateTimeFormatInfo.CurrentInfo;
                Calendar cal = dfi.Calendar;
                var week = cal.GetWeekOfYear(customerMeeting.Date, dfi.CalendarWeekRule, dfi.FirstDayOfWeek);

                var meetingToRemove = _dbContext.CustomerMeetings.SingleOrDefault(e => e.MeetingId == customerMeeting.MeetingId);
                _dbContext.CustomerMeetings.Remove(meetingToRemove);

                var name = _dbContext.Customers.Where(e => e.CompanyId == customerMeeting.CompanyId && e.Id == customerMeeting.CustomerId).FirstOrDefault().Name;

                var meeting = new CustomerMeeting();
                meeting.CompanyId = meetingToRemove.CompanyId;
                meeting.CustomerId = customerMeeting.CustomerId;
                meeting.CustomerName = name;
                meeting.TypeOfMeeting = customerMeeting.TypeOfMeeting;
                meeting.ResultOfMeeting = customerMeeting.ResultOfMeeting;
                if (customerMeeting.TypeOfMeeting == "Projektarbete")
                {
                    meeting.ContactName = "Ingen vald";
                }
                else
                {
                    meeting.ContactName = customerMeetingExtraCustomerContacts.FirstOrDefault().value;
                }                
                //meeting.MiscExplanation = customerMeeting.MiscExplanation;
                meeting.Comments = customerMeeting.Comments;
                meeting.Date = customerMeeting.Date;
                meeting.WeekNumber = week;
                meeting.MeetingId = customerMeeting.MeetingId;
                meeting.ProjectId = customerMeeting.ProjectId;
                meeting.CompanyResponsible = customerMeeting.CompanyResponsible;
                meeting.LocationType = customerMeeting.LocationType;
                meeting.KilometersDriven = meetingToRemove.KilometersDriven;

                _dbContext.CustomerMeetings.Add(meeting);
                _dbContext.SaveChanges();

                var participatorsToRemove = _dbContext.CustomerMeetingExtraCustomerContacts.Where(e => e.MeetingId == customerMeeting.MeetingId);
                _dbContext.CustomerMeetingExtraCustomerContacts.RemoveRange(participatorsToRemove);

                var responsiblesToRemove = _dbContext.CustomerMeetingExtraCompanyResponsibles.Where(e => e.MeetingId == customerMeeting.MeetingId);
                _dbContext.CustomerMeetingExtraCompanyResponsibles.RemoveRange(responsiblesToRemove);

                foreach (var part in customerMeetingExtraCustomerContacts)
                {
                    var contactName = _dbContext.CustomerContacts.Where(e => e.Id == part.value).FirstOrDefault();
                    var n = "";
                    if (part.value == "Leverantör/Partner")
                    {
                        n = part.value;
                    }
                    else
                    {
                        n = contactName.FirstName + " " + contactName.LastName;
                    }
                    _dbContext.CustomerMeetingExtraCustomerContacts.Add(new CustomerMeetingExtraCustomerContact()
                    {
                        CompanyId = meetingToRemove.CompanyId,
                        CustomerId = meetingToRemove.CustomerId,
                        TypeOfMeeting = customerMeeting.TypeOfMeeting,
                        ResultOfMeeting = customerMeeting.ResultOfMeeting,
                        Date = customerMeeting.Date,
                        ContactName = n,
                        Id = part.value,
                        MeetingId = customerMeeting.MeetingId
                });
                }

                foreach (var part in customerMeetingExtraCompanyResponsibles)
                {
                    _dbContext.CustomerMeetingExtraCompanyResponsibles.Add(new CustomerMeetingExtraCompanyResponsible()
                    {
                        CompanyId = meetingToRemove.CompanyId,
                        CustomerId = meetingToRemove.CustomerId,
                        TypeOfMeeting = customerMeeting.TypeOfMeeting,
                        ResultOfMeeting = customerMeeting.ResultOfMeeting,
                        Date = customerMeeting.Date,
                        ContactName = part.label,
                        Id = part.value,
                        MeetingId = customerMeeting.MeetingId
                    });
                }


                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }

            
        }

        internal bool EditProspectMeeting(ProspectMeeting prospectMeeting, List<ReactMultiSelectValue> prospectMeetingExtraCustomerContacts, List<ReactMultiSelectValue> prospectMeetingExtraCompanyResponsibles)
        {
            try
            {
                DateTimeFormatInfo dfi = DateTimeFormatInfo.CurrentInfo;
                Calendar cal = dfi.Calendar;
                var week = cal.GetWeekOfYear(prospectMeeting.Date, dfi.CalendarWeekRule, dfi.FirstDayOfWeek);

                var meetingToRemove = _dbContext.ProspectMeetings.SingleOrDefault(e => e.MeetingId == prospectMeeting.MeetingId);
                _dbContext.ProspectMeetings.Remove(meetingToRemove);

                var name = _dbContext.Prospects.Where(e => e.CompanyId == prospectMeeting.CompanyId && e.Id == prospectMeeting.ProspectId).FirstOrDefault().Name;

                var meeting = new ProspectMeeting();
                meeting.CompanyId = meetingToRemove.CompanyId;
                meeting.ProspectId = prospectMeeting.ProspectId;
                meeting.ProspectName = name;
                meeting.TypeOfMeeting = prospectMeeting.TypeOfMeeting;
                meeting.ResultOfMeeting = prospectMeeting.ResultOfMeeting;
                meeting.ContactName = prospectMeetingExtraCustomerContacts.FirstOrDefault().value;
                meeting.Comments = prospectMeeting.Comments;
                meeting.Date = prospectMeeting.Date;
                meeting.WeekNumber = week;
                meeting.MeetingId = prospectMeeting.MeetingId;
                meeting.CompanyResponsible = prospectMeeting.CompanyResponsible;
                meeting.LocationType = prospectMeeting.LocationType;

                _dbContext.ProspectMeetings.Add(meeting);
                _dbContext.SaveChanges();

                var participatorsToRemove = _dbContext.ProspectMeetingExtraCustomerContacts.Where(e => e.MeetingId == prospectMeeting.MeetingId);
                _dbContext.ProspectMeetingExtraCustomerContacts.RemoveRange(participatorsToRemove);

                var respToRemove = _dbContext.ProspectMeetingExtraCompanyResponsibles.Where(e => e.MeetingId == prospectMeeting.MeetingId);
                _dbContext.ProspectMeetingExtraCompanyResponsibles.RemoveRange(respToRemove);

                foreach (var part in prospectMeetingExtraCustomerContacts)
                {
                    var contactName = _dbContext.ProspectContacts.Where(e => e.Id == part.value).FirstOrDefault();
                    var n = "";
                    if (part.value == "Leverantör/Partner")
                    {
                        n = part.value;
                    }
                    else
                    {
                        n = contactName.FirstName + " " + contactName.LastName;
                    }
                    _dbContext.ProspectMeetingExtraCustomerContacts.Add(new ProspectMeetingExtraCustomerContact()
                    {
                        CompanyId = meetingToRemove.CompanyId,
                        ProspectId = meetingToRemove.ProspectId,
                        TypeOfMeeting = prospectMeeting.TypeOfMeeting,
                        ResultOfMeeting = prospectMeeting.ResultOfMeeting,
                        Date = prospectMeeting.Date,
                        ContactName = n,
                        Id = part.value,
                        MeetingId = prospectMeeting.MeetingId
                    });
                }

                foreach (var part in prospectMeetingExtraCompanyResponsibles)
                {
                    _dbContext.ProspectMeetingExtraCompanyResponsibles.Add(new ProspectMeetingExtraCompanyResponsible()
                    {
                        CompanyId = meetingToRemove.CompanyId,
                        ProspectId = meetingToRemove.ProspectId,
                        TypeOfMeeting = prospectMeeting.TypeOfMeeting,
                        ResultOfMeeting = prospectMeeting.ResultOfMeeting,
                        Date = prospectMeeting.Date,
                        ContactName = part.label,
                        Id = part.value,
                        MeetingId = prospectMeeting.MeetingId
                    });
                }

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }


        }

        internal bool SaveRole(string companyId, string role)
        {
            try
            {
                _dbContext.ContactRoles.Add(
                    new ContactRole() { 
                        CompanyId = companyId, 
                        Role = role
                });

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool RemoveRole(string companyId, string role)
        {
            try
            {
                var roleToRemove = _dbContext.ContactRoles.Where(x => x.CompanyId == companyId && x.Role == role).ToList();
                _dbContext.ContactRoles.RemoveRange(roleToRemove);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal async Task<bool> SaveMeeting(CustomerMeeting customerMeeting, List<string> customerMeetingExtraCustomerContacts, List<string> customerMeetingExtraCompanyResponsibles)
        {
            try
            {
                DateTimeFormatInfo dfi = DateTimeFormatInfo.CurrentInfo;
                Calendar cal = dfi.Calendar;
                var week = cal.GetWeekOfYear(customerMeeting.Date, dfi.CalendarWeekRule, dfi.FirstDayOfWeek);
                customerMeeting.WeekNumber = week;

                if(customerMeeting.TypeOfMeeting == "Projektarbete")
                {
                    customerMeeting.ContactName = "Ingen vald";
                }
                else
                {
                    customerMeeting.ContactName = customerMeetingExtraCustomerContacts.FirstOrDefault();
                }

                customerMeeting.MeetingId = Guid.NewGuid().ToString();
                _dbContext.CustomerMeetings.Add(customerMeeting);

                _dbContext.SaveChanges();
                
                foreach(var contact in customerMeetingExtraCustomerContacts)
                {
                    var contactName = _dbContext.CustomerContacts.Where(e => e.Id == contact).FirstOrDefault();
                    var name = "";
                    if (contact == "Leverantör/Partner")
                    {
                        name = contact;
                    }
                    else
                    {
                        name = contactName.FirstName + " " + contactName.LastName;
                    }
                    _dbContext.CustomerMeetingExtraCustomerContacts.Add(new CustomerMeetingExtraCustomerContact() { 
                        CompanyId = customerMeeting.CompanyId,
                        CustomerId = customerMeeting.CustomerId,
                        Date = customerMeeting.Date,
                        TypeOfMeeting = customerMeeting.TypeOfMeeting,
                        ResultOfMeeting = customerMeeting.ResultOfMeeting,
                        Id = contact,
                        ContactName = name,
                        MeetingId = customerMeeting.MeetingId
                    });
                }

                var adGroups = await _graphService.GetGroupsByUserAsync(Guid.Parse(customerMeeting.CompanyResponsible));
                var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();
                var members = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());
                foreach (var companyResponsible in customerMeetingExtraCompanyResponsibles)
                {
                    var responsible = members.Where(e => e.Id == companyResponsible).FirstOrDefault();

                    var name = responsible.Name;

                    _dbContext.CustomerMeetingExtraCompanyResponsibles.Add(new CustomerMeetingExtraCompanyResponsible()
                    {
                        CompanyId = customerMeeting.CompanyId,
                        CustomerId = customerMeeting.CustomerId,
                        Date = customerMeeting.Date,
                        TypeOfMeeting = customerMeeting.TypeOfMeeting,
                        ResultOfMeeting = customerMeeting.ResultOfMeeting,
                        Id = responsible.Id,
                        ContactName = name,
                        MeetingId = customerMeeting.MeetingId
                    });
                }

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal async Task<bool> SaveProspectMeeting(ProspectMeeting prospectMeeting, List<string> prospectMeetingExtraCustomerContacts, List<string> customerMeetingExtraCompanyResponsibles)
        {
            try
            {
                DateTimeFormatInfo dfi = DateTimeFormatInfo.CurrentInfo;
                Calendar cal = dfi.Calendar;
                var week = cal.GetWeekOfYear(prospectMeeting.Date, dfi.CalendarWeekRule, dfi.FirstDayOfWeek);
                prospectMeeting.WeekNumber = week;

                prospectMeeting.ContactName = prospectMeetingExtraCustomerContacts.FirstOrDefault();

                prospectMeeting.MeetingId = Guid.NewGuid().ToString();
                _dbContext.ProspectMeetings.Add(prospectMeeting);

                _dbContext.SaveChanges();

                foreach (var contact in prospectMeetingExtraCustomerContacts)
                {
                    var contactName = _dbContext.ProspectContacts.Where(e => e.Id == contact).FirstOrDefault();
                    var name = "";
                    if (contact == "Leverantör/Partner")
                    {
                        name = contact;
                    }
                    else
                    {
                        name = contactName.FirstName + " " + contactName.LastName;
                    }
                    _dbContext.ProspectMeetingExtraCustomerContacts.Add(new ProspectMeetingExtraCustomerContact()
                    {
                        CompanyId = prospectMeeting.CompanyId,
                        ProspectId = prospectMeeting.ProspectId,
                        Date = prospectMeeting.Date,
                        TypeOfMeeting = prospectMeeting.TypeOfMeeting,
                        ResultOfMeeting = prospectMeeting.ResultOfMeeting,
                        Id = contact,
                        ContactName = name,
                        MeetingId = prospectMeeting.MeetingId
                    });
                }

                var adGroups = await _graphService.GetGroupsByUserAsync(Guid.Parse(prospectMeeting.CompanyResponsible));
                var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();
                var members = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());
                foreach (var companyResponsible in customerMeetingExtraCompanyResponsibles)
                {
                    var responsible = members.Where(e => e.Id == companyResponsible).FirstOrDefault();

                    var name = responsible.Name;

                    _dbContext.ProspectMeetingExtraCompanyResponsibles.Add(new ProspectMeetingExtraCompanyResponsible()
                    {
                        CompanyId = prospectMeeting.CompanyId,
                        ProspectId = prospectMeeting.ProspectId,
                        Date = prospectMeeting.Date,
                        TypeOfMeeting = prospectMeeting.TypeOfMeeting,
                        ResultOfMeeting = prospectMeeting.ResultOfMeeting,
                        Id = responsible.Id,
                        ContactName = name,
                        MeetingId = prospectMeeting.MeetingId
                    });
                }

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }


        internal List<CustomerMeeting> GetMeetings(string companyId, string customerId)
        {
            return _dbContext.CustomerMeetings.Where(e => e.CompanyId == companyId && e.CustomerId == customerId).ToList();
        }

        internal List<CustomerMeeting> GetMeetingsFiltered(string companyId, string customerId, string fromDate, string toDate, string status)
        {
            IQueryable<CustomerMeeting> query = _dbContext.CustomerMeetings.Where(e => e.CompanyId == companyId && e.CustomerId == customerId);

            if (!string.IsNullOrEmpty(fromDate) && fromDate != "yyyy-mm-dd")
            {
                DateTime fromDateTime = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date >= fromDateTime);
            }

            if (!string.IsNullOrEmpty(toDate) && toDate != "yyyy-mm-dd")
            {
                DateTime toDateTime = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date <= toDateTime);
            }

            if (status != "Alla")
            {
                query = query.Where(e => e.ResultOfMeeting == status);
            }

            return query.ToList();
        }

        internal List<CustomerMeeting> GetMeetingsForSalesman(string salesmanId, string type, string value)
        {
            var currentYear = DateTime.Now.Year.ToString();

            if (type == "Vecka")
            {
                return _dbContext.CustomerMeetings.Where(e => e.CompanyResponsible == salesmanId && e.WeekNumber == int.Parse(value) && e.Date.Year.ToString() == currentYear).ToList();
            }
            if (type == "Månad")
            {
                if (value.Length == 1)
                    value = "0" + value;

                var v = currentYear + "-" + value;
                return _dbContext.CustomerMeetings.Where(e => e.CompanyResponsible == salesmanId && e.Date.ToString().Contains(v)).ToList();
            }

            return _dbContext.CustomerMeetings.Where(e => e.CompanyResponsible == salesmanId && e.Date.ToString().Contains(value)).ToList();
        }

        internal List<ContactRole> GetRoles(string companyId)
        {
            return _dbContext.ContactRoles.Where(e => e.CompanyId == companyId).ToList();
        }

        internal bool SaveCustomerContact(CustomerContact customerContact)
        {
            try
            {
                //if(customerContact.Email != null)
                //{
                //    var duplicateContact = _dbContext.CustomerContacts.Where(e => e.CompanyId == customerContact.CompanyId && e.FirstName == customerContact.FirstName && e.Email == customerContact.Email).FirstOrDefault();
                //    if (duplicateContact != null)
                //        return false;
                //}
                _dbContext.CustomerContacts.Add(customerContact);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool SaveProspectContact(ProspectContact customerContact)
        {
            try
            {
                if (customerContact.Email != null)
                {
                    var duplicateContact = _dbContext.ProspectContacts.Where(e => e.CompanyId == customerContact.CompanyId && e.FirstName == customerContact.FirstName && e.Email == customerContact.Email).FirstOrDefault();
                    if (duplicateContact != null)
                        return false;
                }
                _dbContext.ProspectContacts.Add(customerContact);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }


        internal List<CustomerContact> GetCustomerContacts(string companyId, string customerId)
        {
            return _dbContext.CustomerContacts.Where(e => e.CompanyId == companyId && e.CustomerId == customerId).ToList();
        }


        internal List<CustomerContact> GetCustomerContactsForEntireGroup(string companyId, string customerId)
        {
            var customerGroup = _dbContext.CustomerGroupCustomers.Where(x => x.CustomerId == customerId).FirstOrDefault();

            var customerGroupCustomers = _dbContext.CustomerGroupCustomers.Where(x => x.CustomerGroupId == customerGroup.CustomerGroupId).ToList();

            var list = new List<CustomerContact>();

            foreach(var cus in customerGroupCustomers)
            {
                var contacts = _dbContext.CustomerContacts.Where(x => x.CustomerId == cus.CustomerId).ToList();

                list.AddRange(contacts);
            }

            var c = _dbContext.CustomerContacts.Where(x => x.CustomerId == customerGroup.CustomerGroupId).ToList();

            list.AddRange(c);

            return list;
        }

        internal bool EditValue(SaveValueObject valueObject, string companyId)
        {
            var classification = GetClassification(valueObject);
            var customerValue = _dbContext.CustomerValues.SingleOrDefault(x => x.CompanyId == companyId && x.CustomerId == valueObject.customerId);

            try
            {
                customerValue.PotentialRevenue = int.Parse(valueObject.potRevenue);
                customerValue.Loyalty = int.Parse(valueObject.loyality);
                customerValue.Sortiment = int.Parse(valueObject.sortiment);
                customerValue.Revenue = int.Parse(valueObject.revenue);
                customerValue.BrandValue = int.Parse(valueObject.brandValue);
                customerValue.MarketLeading = int.Parse(valueObject.marketLeading);
                customerValue.Economy = int.Parse(valueObject.economy);
                customerValue.OwnerShip = int.Parse(valueObject.ownerShip);
                customerValue.Classification = classification;

                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool RemoveValuedCustomer(string companyId, string customerId)
        {
            try
            {
                var customerValues = _dbContext.CustomerValues.Where(x => x.CustomerId == customerId && x.CompanyId == companyId);
                _dbContext.CustomerValues.RemoveRange(customerValues);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal bool RemoveCampaign(string companyId, string campaignId)
        {
            try
            {
                var campaign = _dbContext.Campaigns.Where(x => x.Id == campaignId && x.CompanyId == companyId).FirstOrDefault() ;
                _dbContext.Campaigns.Remove(campaign);
                _dbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal string GetNameOfCustomerOrGroup(string companyId, string customerId)
        {
            var customer = _dbContext.Customers.Where(e => e.CompanyId == companyId && e.Id == customerId).FirstOrDefault();

            if(customer != null)
            {
                return customer.Name;
            }
            else
            {
                var groupName = _dbContext.CustomerGroups.Where(e => e.CompanyId == companyId && e.Id == customerId).FirstOrDefault().Name;

                return groupName;
            }
        }

        internal string GetNameOfProspect(string companyId, string prospectId)
        {
            var customer = _dbContext.Prospects.Where(e => e.CompanyId == companyId && e.Id == prospectId).FirstOrDefault();

            return customer.Name;
        }


        internal List<ProjectActivity> GetProjects(string companyId, string customerId)
        {
            return _dbContext.ProjectActivities.Where(e => e.CompanyId == companyId && e.CustomerId == customerId).ToList();
        }

        internal List<ProjectActivity> GetProjectsFiltered(string companyId, string customerId, string fromDate, string toDate, string status)
        {
            IQueryable<ProjectActivity> query = _dbContext.ProjectActivities.Where(e => e.CompanyId == companyId && e.CustomerId == customerId);

            if (!string.IsNullOrEmpty(fromDate) && fromDate != "yyyy-mm-dd")
            {
                DateTime fromDateTime = DateTime.ParseExact(fromDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date >= fromDateTime);
            }

            if (!string.IsNullOrEmpty(toDate) && toDate != "yyyy-mm-dd")
            {
                DateTime toDateTime = DateTime.ParseExact(toDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                query = query.Where(e => e.Date <= toDateTime);
            }

            if (status != "Alla")
            {
                query = query.Where(e => e.Status == status);
            }

            return query.ToList();
        }

        internal CustomerMeeting GetMeeting(string companyId, string customerId, string meetingId)
        {
            return _dbContext.CustomerMeetings.Where(e => e.MeetingId == meetingId).FirstOrDefault();
        }

        internal ProspectMeeting GetProspectMeeting(string companyId, string prospectId, string meetingId)
        {
            return _dbContext.ProspectMeetings.Where(e => e.MeetingId == meetingId).FirstOrDefault();
        }

        internal string GetClassification(SaveValueObject valueObject)
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

            var calcValue = potRevenueValue
                + loyaltyValue
                + sortimentValue
                + revenueValue
                + brandValue
                + marketLeadingValue
                + economyValue
                + ownerShipValue;

            var value = calcValue;
            if(value >= 0 && value < 0.25)
                return "D";
            if (value >= 0.25 && value < 0.50)
                return "C";
            if (value > 0.50 && value < 0.75)
                return "B";
            if (value > 0.75 && value <= 1.1)
                return "A";

            return "D";
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

    }
}
