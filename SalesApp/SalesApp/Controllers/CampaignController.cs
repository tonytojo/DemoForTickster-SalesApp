using Microsoft.AspNetCore.Authorization;
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
    public class CampaignController : Controller
    {
        private DatabaseService _databaseService { get; set; }
        private GraphService _graphService;
        public CampaignController(DatabaseService databaseService, GraphService graphService)
        {
            _databaseService = databaseService;
            _graphService = graphService;
        }

        public Campaign GetCampaign(string campaignId)
        {
            var campaign = _databaseService.GetCampaign(campaignId);

            return campaign;
        }

        public List<Campaign> GetCampaigns(string companyId)
        {
            var campaigns = _databaseService.GetCampaigns(companyId);

            return campaigns;
        }

        public List<Campaign> GetCampaignsForSalesman(string companyId)
        {
            var campaigns = _databaseService.GetCampaignsForSalesman(companyId, User.Id());

            return campaigns;
        }

        public bool RemoveCampaign(string companyId, string campaignId)
        {
            var status = _databaseService.RemoveCampaign(companyId, campaignId);

            return status;
        }

        public bool SaveCampaign(Campaign campaign, List<ReactMultiSelectValue> salesmen)
        {
            var status = _databaseService.SaveCampaign(campaign, salesmen);

            return status;
        }

        public bool EditCampaign(Campaign campaign, List<ReactMultiSelectValue> salesmen)
        {
            var status = _databaseService.EditCampaign(campaign, salesmen);

            return status;
        }

        public async Task<List<ReactMultiSelectValue>> GetSelectedMembersForCampaign(string companyId, string campaignId)
        {
            var members = _databaseService.GetSelectedMembersForCampaign(campaignId);
            var currentUserId = Guid.Parse(User.Id());
            var adGroups = await _graphService.GetGroupsByUserAsync(currentUserId);

            var salesAppGroup = adGroups.Where(e => e.Name.Contains("SalesApp")).FirstOrDefault();

            var adMembers = await _graphService.GetGroupMembers(salesAppGroup.Id.ToString());

            var list = new List<ReactMultiSelectValue>();

            foreach (var mem in members)
            {
                list.Add(new ReactMultiSelectValue
                {
                    label = adMembers.Where(e => e.Id == mem.UserId).FirstOrDefault().Name,
                    value = mem.UserId
                });
            }

                return list;
            }

    }
}
