using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Graph;

namespace SalesApp.Services
{
    public class GraphService
    {
        private readonly AadService _aadService;

        public GraphService(AadService aadService)
        {
            _aadService = aadService;
        }

        public GraphServiceClient GetGraphServiceClient()
        {
            return new GraphServiceClient(_aadService);
        }

        public async Task<IEnumerable<Models.Group>> GetGroupsByUserAsync(Guid userId)
        {
            GraphServiceClient graphServiceClient = GetGraphServiceClient();

            var collectionPage = await graphServiceClient
                .Users[userId.ToString()]
                .MemberOf
                .Request(new[] { new QueryOption("$top", "999"), new QueryOption("$select", "displayName,id") })
                .GetAsync();
            var groups = collectionPage
                .OfType<Group>()
                .Select(x => new Models.Group
                {
                    Id = Guid.Parse(x.Id),
                    Name = x.DisplayName
                }).ToArray();

            return groups;
        }

        public async Task<List<Models.AdMember>> GetGroupMembers(string groupId)
        {
            GraphServiceClient graphServiceClient = GetGraphServiceClient();

            var collectionPage = await graphServiceClient.Groups[groupId].Members.Request().GetAsync();

            var users = collectionPage
            .OfType<User>()
            .Select(x => new Models.AdMember
            {
                Id = x.Id,
                Name = x.DisplayName,
                Email = x.Mail
            }).ToArray();

            return users.ToList();
        }

        public async Task<bool> RemoveGroupMember(string groupId, string userId)
        {
            try
            {
                GraphServiceClient graphServiceClient = GetGraphServiceClient();

                await graphServiceClient.Groups[groupId].Members[userId].Reference.Request().DeleteAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal async Task<bool> ContactUs(string email, string contactTitle, string contactDescription)
        {
            try
            {
                using (var client = new HttpClient())
                {

                    var jsonData = System.Text.Json.JsonSerializer.Serialize(new
                    {

                        email = email,
                        contactTitle = contactTitle,
                        contactDescription = contactDescription
                    });
                    var content = new StringContent(jsonData);
                    content.Headers.ContentType.CharSet = string.Empty;
                    content.Headers.ContentType.MediaType = "application/json";

                    var response = await client.PostAsync("https://prod-15.northeurope.logic.azure.com:443/workflows/4bd497ae50464241bf4abf9af1770b61/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=utB4PouGBhmQUECXoRnt_e744yipBcnCMXhMUHPj4kg", content);
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        internal async Task NotifySecondSalesman(Models.ProjectActivity projectActivity, Models.AdMember salesmanToNotify, Models.AdMember createdBySalesman, Models.Customer customer)
        {
            var email = "";
            try
            {
                email = salesmanToNotify.Email;
            }
            catch
            {

            }

            using (var client = new HttpClient())
            {

                var jsonData = System.Text.Json.JsonSerializer.Serialize(new
                {

                    email = email,
                    createdBy = createdBySalesman.Email,
                    projectName = projectActivity.Activity,
                    projectCustomer = customer.Name
                });
                var content = new StringContent(jsonData);
                content.Headers.ContentType.CharSet = string.Empty;
                content.Headers.ContentType.MediaType = "application/json";

                var response = await client.PostAsync("https://prod-12.northeurope.logic.azure.com:443/workflows/3ce1b2fd22b14aaa95b40de14d963f47/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=stJHXE5xoh5vTlAm8XrPHztKRu_hnmpeA-e4v1m5E7c", content);
            }
        }

        internal async Task SendEmailToOsterbergs(string fromSalesman, Models.CustomerContact customerContact)
        {
            using (var client = new HttpClient())
            {

                var jsonData = System.Text.Json.JsonSerializer.Serialize(new
                {

                    salesman = fromSalesman,
                    contactName = customerContact.FirstName + " " + customerContact.LastName,
                    customer = customerContact.CustomerId
                });
                var content = new StringContent(jsonData);
                content.Headers.ContentType.CharSet = string.Empty;
                content.Headers.ContentType.MediaType = "application/json";

                var response = await client.PostAsync("https://prod-07.northeurope.logic.azure.com:443/workflows/3059c79e3a6449e2b465c71309f429b3/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=e7_uIKVD1_qiI0tIluUrnHhUaVJ7qHUL9bkMT0c6W6Q", content);
            }
      
        }
    }

}
