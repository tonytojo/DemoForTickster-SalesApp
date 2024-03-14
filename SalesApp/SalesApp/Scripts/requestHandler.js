////////////////////////////////////////////   COMPANY   ////////////////////////////////////////////////////////////
export function getCompanyMembers() {
    var url = "/Home/GetAdMembers";

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getCompanyMembersWithoutLightUsers() {
    var url = "/Home/GetAdMembersWithoutLightUsers";

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getCompanyResponsiblesSelect() {
    var url = "/Home/GetAdMembersSelect";

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getActivitiesWithTimeSpan(companyId, fromDate, toDate ) {
    var url = "/Home/GetActivitiesCurrentMonth?companyId=" + companyId;

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            companyId: companyId,
            fromDate: fromDate,
            toDate: toDate
        }
    });
}

export function removeAdMember(memberId) {
    var url = "/Home/RemoveGroupMember?userId=" + memberId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getOptions(companyId) {
    var url = "/Home/GetOptions?companyId=" + companyId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function saveOption(companyId) {
    var url = "/Home/SaveOption?companyId=" + companyId + "&option=" + $("#newOption").val();

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function removeOption(companyId, option) {
    var url = "/Home/RemoveOption?companyId=" + companyId + "&option=" + option;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function contactUs(contactTitle, contactDescription) {
    var url = "/Home/ContactUs";
    return $.ajax({
        type: 'POST',
        data: {
            contactTitle: contactTitle,
            contactDescription: contactDescription
        },
        url: url
    });
}
////////////////////////////////////////////   ROLES    /////////////////////////////////////////////////////////////
export function getRoles(companyId) {
    var url = "/Roles/GetRoles?companyId=" + companyId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function removeRole(companyId, role) {
    var url = "/Roles/RemoveRole?companyId=" + companyId + "&role=" + role;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function saveRole(companyId, role) {
    var url = "/Roles/SaveRole?companyId=" + companyId + "&role=" + role;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function changeSystemRole(companyId, userId, newStatus, role) {
    var url = "/Roles/ChangeSystemRole?userId=" + userId + "&role=" + role + "&newStatus=" + newStatus + "&companyId=" + companyId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

///////////////////////////////////////// CUSTOMERGROUPS   /////////////////////////////////////////////////////////
export function getCustomerGroups(companyId) {
    var url = "/CustomerGroups/GetCustomerGroups?companyId=";

    return $.ajax({
        type: 'GET',
        url: url + companyId
    });
}

export function getName(customerGroupId) {
    var url = "/CustomerGroups/GetNameOfCustomerGroup?customerGroupId=";

    return $.ajax({
        type: 'GET',
        url: url + customerGroupId
    });
}

export function saveCustomerGroup(name, customers, companyId) {
    var url = "/CustomerGroups/Save";

    return $.ajax({
        type: 'POST',
        data: {
            name: name,
            customers: customers,
            companyId: companyId
        },
        url: url
    });
}

export function editCustomerGroup(name, customers, customerGroupId) {
    var url = "/CustomerGroups/Edit";

    return $.ajax({
        type: 'POST',
        data: {
            name: name,
            customers: customers,
            customerGroupId: customerGroupId
        },
        url: url
    });
}

export function getSalesCustomerGroup(companyId, customerId) {
    var url = "/CustomerGroups/GetSalesLast12Months?companyId=" + companyId + "&customerId=" + customerId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getCustomersInGroup(customerGroupId) {
    var url = "/CustomerGroups/GetCustomersInGroup?customerGroupId=";

    return $.ajax({
        type: 'GET',
        url: url + customerGroupId
    });
}

export function getCustomerGroupIdFromCustomerId(customerId) {
    var url = "/CustomerGroups/GetCustomerGroupIdFromCustomerId?customerId=";

    return $.ajax({
        type: 'GET',
        url: url + customerId
    });
}

export function checkIfCustomerIsInCustomerGroup(customerId) {
    var url = "/CustomerGroups/CheckIfCustomerIsInCustomerGroup?customerId=";

    return $.ajax({
        type: 'GET',
        url: url + customerId
    });
}

///////////////////////////////////////// VALUEDCUSTOMERS   /////////////////////////////////////////////////////////
export function getValuedCustomer(companyId, customerId) {
    var url = "/Value/GetValuedCustomer?companyId=" + companyId + "&customerId=" + customerId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getValuedCustomers(companyId) {
    var url = "/Value/GetValuedCustomers?companyId=";

    return $.ajax({
        type: 'GET',
        url: url + companyId
    });
}

export function removeValuedCustomer(companyId, id) {
    var url = "/Value/RemoveValuedCustomer?companyId=" + companyId + "&customerId=" + id;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function saveValue(selectedCustomer, selectedId, potRevenue, loyality, sortiment, brandValue, marketLeading, economy, ownerShip, revenue, companyId) {

    return $.ajax({
        type: 'POST',
        data: {
            valueObject: {
                customerName: selectedCustomer,
                customerId: selectedId,
                potRevenue: potRevenue,
                loyality: loyality,
                sortiment: sortiment,
                brandValue: brandValue,
                marketLeading: marketLeading,
                economy: economy,
                ownerShip: ownerShip,
                revenue: revenue
            },
            companyId: companyId
        },
        url: "/Value/SaveValue"
    });
}

export function editValue(customerId, potRevenue, loyality, sortiment, brandValue, marketLeading, economy, ownerShip, revenue, companyId) {

    return $.ajax({
        type: 'POST',
        data: {
            valueObject: {
                customerId: customerId,
                potRevenue: potRevenue,
                loyality: loyality,
                sortiment: sortiment,
                brandValue: brandValue,
                marketLeading: marketLeading,
                economy: economy,
                ownerShip: ownerShip,
                revenue: revenue
            },
            companyId: companyId
        },
        url: "/Value/EditValue"
    });
}
///////////////////////////////////////// CUSTOMERS   /////////////////////////////////////////////////////////
export function getCustomers(companyId) {
    var url = "/Customer/GetCustomers?companyId=";

    return $.ajax({
        type: 'GET',
        url: url + companyId
    });
}

export function getCustomersWithoutFilter(companyId) {
    var url = "/Customer/GetAllCustomersWithoutFilter?companyId=" + companyId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getCustomersSearch(companyId, value) {
    var url = "/CustomerGroups/SearchCustomersWithoutAlreadyTaken?companyId=" + companyId + "&customerSearch=" + value;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function searchAllCustomers(companyId, value) {
    var url = "/Customer/SearchCustomers?companyId=" + companyId + "&customerSearch=" + value;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getCustomersAndGroupsSearch(companyId, value) {
    var url = "/Customer/SearchCustomersAndGroups?companyId=" + companyId + "&customerSearch=" + value;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function removeContact(companyId, customerId, id) {
    var url = "/Customer/RemoveContact?companyId=" + companyId + "&id=" + id;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getResponsiblesCustomersAndGroups(companyId, value) {
    var url = "/Customer/GetResponsiblesCustomersAndGroups?companyId=" + companyId + "&responsibleName=" + value;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getCustomersSearchForValue(companyId, value, includeValued) {
    var url = "/Customer/GetCustomersAndCustomerGroupsSearch?companyId=" + companyId + "&customerSearch=" + value + "&includeValued=" + includeValued ;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getCustomerContacts(companyId, customerId, includeCustomerGroup) {
    var url = "/Customer/GetCustomerContacts?companyId=" + companyId + "&customerId=" + customerId + "&includeCustomerGroup=" + includeCustomerGroup;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getCustomerContactsSelect(companyId, customerId) {
    var url = "/Customer/GetCustomerContactsSelect?companyId=" + companyId + "&customerId=" + customerId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getSelectedCustomerContactsForMeeting(meetingId) {
    var url = "/Customer/GetSelectedCustomerContactsForMeeting?meetingId=" + meetingId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getConnectedCustomers(customerGroupId) {
    var url = "/CustomerGroups/GetConnectedCustomers?customerGroupId=";

    return $.ajax({
        type: 'GET',
        url: url + customerGroupId
    });
}

export function getNameOfCustomerOrGroup(companyId, customerId) {
    var url = "/Customer/GetNameOfCustomerOrGroup?companyId=" + companyId + "&customerId=" + customerId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getIdOfCustomerGroupFromCustomerId(companyId, customerId) {
    var url = "/Customer/GetIdOfCustomerGroupFromCustomerId?companyId=" + companyId + "&customerId=" + customerId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function saveCustomerContact(customerId, companyId) {
    var sel = document.getElementById("contactRole");
    var role = sel.options[sel.selectedIndex].text;
    return $.ajax({
        type: 'POST',
        data: {
            customerContact: {
                CustomerId: customerId,
                CompanyId: companyId,
                FirstName: $("#contactFirstName").val(),
                LastName: $("#contactLastName").val(),
                Telephone: $("#contactTelephone").val(),
                Email: $("#contactEmail").val(),
                Role: role,
            }
        },
        url: "/Customer/SaveCustomerContact"
    });
}

export function editCustomerContact(customerId, companyId, id, firstName, lastName, tele, email, role) {
    return $.ajax({
        type: 'POST',
        data: {
            customerId: customerId,
            companyId: companyId,
            firstName: firstName,
            lastName: lastName,
            tele: tele,
            email: email,
            role: role,
            customerContact: {
                CustomerId: customerId,
                CompanyId: companyId,
                Id: id,
                FirstName: $("#contactFirstName").val(),
                LastName: $("#contactLastName").val(),
                Telephone: $("#contactTelephone").val(),
                Email: $("#contactEmail").val(),
                Role: $("#contactRole").val(),
            }
        },
        url: "/Customer/EditCustomerContact"
    });
}

export function getSales(companyId, customerId) {
    var url = "/Customer/GetSalesLast12Months?companyId=" + companyId + "&customerId=" + customerId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getFollowUps(companyId, customerId) {
    var url = "/Customer/GetFollowUps?companyId=" + companyId + "&customerId=" + customerId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function saveFollowUp(companyId, customerId) {
    return $.ajax({
        type: 'POST',
        data: {
            followUp: {
                CustomerId: customerId,
                CompanyId: companyId,
                ToEmail: $("#followUpEmail").val(),
                Comment: $("#followUpComment").val(),
                Date: $("#followUpDate").val()
            }
        },
        url: "/Customer/SaveFollowUp"
    });
}

export function saveFollowUpOnCreateMeeting(companyId, customerId, ) {
    return $.ajax({
        type: 'POST',
        data: {
            followUp: {
                CustomerId: customerId,
                CompanyId: companyId,
                ToEmail: $("#username").val(),
                Comment: "Detta är en påminnelse från tidigare skapat kundaktivitet. Datum: " + $("#meetingDate").val() + ". Typ av aktivitet: " + $("#meetingType").val() + ". Resultat av aktivitet: " + $("#meetingResult").val() + ". Kommentar: " + $("#meetingComment").val()+". Följ upp kund med kundnummer: " + customerId,
                Date: $("#dateFollowUp").val()
            }
        },
        url: "/Customer/SaveFollowUp"
    });
}

export function getCustomerContact(companyId, customerId, id) {
    return $.ajax({
        type: 'POST',
        data: {
            customerId: customerId,
            companyId: companyId,
            id: id,
        },
        url: "/Customer/GetCustomerContact"
    });
}
///////////////////////////////////////// MEETING   /////////////////////////////////////////////////////////
export function getMeeting(companyId, customerId, meetingId) {
    var url = "/Meeting/GetMeeting?companyId=" + companyId + "&customerId=" + customerId + "&meetingId=" + meetingId;

    return $.ajax({
        type: 'GET',
        url: url
    });
} 

export function getAllMeetingsForSalesman(companyId, userId) {
    var url = "/Meeting/GetAllMeetingsForSalesman?companyId=" + companyId + "&userId=" + userId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getAllMeetingsForSalesmanFiltered(companyId, userId, fromDate, toDate, status) {
    var url = "/Meeting/GetAllMeetingsForSalesmanFiltered?companyId=" + companyId + "&userId=" + userId + "&fromDate=" + fromDate + "&toDate=" + toDate + "&status=" + status;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getMeetings(companyId, customerId) {
    var url = "/Meeting/GetMeetings?companyId=" + companyId + "&customerId=" + customerId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getMeetingsFiltered(companyId, customerId, fromDate, toDate, status) {
    var url = "/Meeting/GetMeetingsFiltered?companyId=" + companyId + "&customerId=" + customerId + "&fromDate=" + fromDate + "&toDate=" + toDate + "&status=" + status;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getAllMeetings(companyId) {
    var url = "/Meeting/GetAllMeetings?companyId=" + companyId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getAllMeetingsFiltered(companyId, fromDate, toDate, status) {
    var url = "/Meeting/GetAllMeetingsFiltered?companyId=" + companyId + "&fromDate=" + fromDate + "&toDate=" + toDate + "&status=" + status;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function saveMeeting(customerId, companyId, customerName, companyContacts, selectedCompanyResponsibles) {
    return $.ajax({
        type: 'POST',
        data: {
            customerMeeting: {
                CustomerId: customerId,
                CompanyId: companyId,
                CustomerName: customerName,
                //ContactName: $("#meetingContact").val(),
                CompanyResponsible: $("#meetingResponsible").val(),
                ProjectId: $("#meetingProject").val(),
                TypeOfMeeting: $("#meetingType").val(),
                Date: $("#meetingDate").val(),
                ResultOfMeeting: $("#meetingResult").val(),
                //MiscExplanation: $("#miscExplanation").val(),
                Comments: $("#meetingComment").val(),
                KilometersDriven: $("#meetingKilometersDriven").val(),
                LocationType: $("#meetingLocationType").val(),
                CampaignId: $("#meetingCampaign").val()
            },
            chosenCustomerId: $("#meetingCustomer").val(),
            customerMeetingExtraCustomerContacts: companyContacts,
            customerMeetingExtraCompanyResponsibles: selectedCompanyResponsibles
        },
        url: "/Meeting/SaveMeeting"
    });
}

export function saveMeetingQuickAdd(customerId, companyId, customerName, companyContacts, selectedCompanyResponsibles) {
    return $.ajax({
        type: 'POST',
        data: {
            customerMeeting: {
                CustomerId: customerId,
                CompanyId: companyId,
                CustomerName: customerName,
                //ContactName: $("#meetingContact").val(),
                CompanyResponsible: $("#meetingResponsible").val(),
                ProjectId: $("#meetingProject").val(),
                TypeOfMeeting: $("#meetingType").val(),
                Date: $("#meetingDate").val(),
                ResultOfMeeting: $("#meetingResult").val(),
                //MiscExplanation: $("#miscExplanation").val(),
                Comments: $("#meetingComment").val(),
                KilometersDriven: $("#meetingKilometersDriven").val(),
                LocationType: $("#meetingLocationType").val(),
                CampaignId: $("#meetingCampaign").val()
            },
            chosenCustomerId: $("#meetingCustomer").val(),
            customerMeetingExtraCustomerContacts: companyContacts,
            customerMeetingExtraCompanyResponsibles: selectedCompanyResponsibles
        },
        url: "/Meeting/SaveMeeting"
    });
}

export function editMeeting(customerId, companyId, meetingId, companyContacts, selectedCompanyResponsibles) {
    return $.ajax({
        type: 'POST',
        data: {
            customerMeeting: {
                CustomerId: customerId,
                CompanyId: companyId,
                MeetingId: meetingId,
                CompanyResponsible: $("#meetingResponsible").val(),
                ProjectId: $("#meetingProject").val(),
                TypeOfMeeting: $("#meetingType").val(),
                Date: $("#meetingDate").val(),
                ResultOfMeeting: $("#meetingResult").val(),
                //MiscExplanation: $("#miscExplanation").val(),
                Comments: $("#meetingComment").val(),
                KilometersDriven: $("#meetingKilometersDriven").val(),
                LocationType: $("#meetingLocationType").val(),
                CampaignId: $("#meetingCampaign").val()
            },
            customerMeetingExtraCustomerContacts: companyContacts,
            customerMeetingExtraCompanyResponsibles: selectedCompanyResponsibles
        },
        url: "/Meeting/EditMeeting"
    });
}

export function getMeetingsOfEntireCustomerGroup(customerGroupId) {
    var url = "/Meeting/GetMeetingsOfEntireCustomerGroup?customerGroupId=" + customerGroupId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function removeMeeting(meeting) {
    return $.ajax({
        type: 'POST',
        data: {
            meeting: meeting
        },
        url: "/Meeting/RemoveMeeting"
    });
} 

export function getParticipators(companyId, customerId, meetingId) {
    var url = "/Meeting/GetMeetingParticipators?companyId=" + companyId + "&customerId=" + customerId + "&meetingId=" + meetingId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getSelectedCompanyResponsiblesForMeeting(meetingId) {
    var url = "/Customer/GetSelectedCompanyResponsiblesForMeeting?meetingId=" + meetingId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getSelectedCompanyResponsiblesForProspectMeeting(meetingId) {
    var url = "/Customer/GetSelectedCompanyResponsiblesForProspectMeeting?meetingId=" + meetingId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

///////////////////////////////////////// PROJECTS   /////////////////////////////////////////////////////////
export function getProjects(companyId, customerId) {
    var url = "/Project/GetProjects?companyId=" + companyId + "&customerId=" + customerId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getProjectsFiltered(companyId, customerId, fromDate, toDate, status) {
    var url = "/Project/GetProjectsFiltered?companyId=" + companyId + "&customerId=" + customerId + "&fromDate=" + fromDate + "&toDate=" + toDate + "&status=" + status;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getAllProjects(companyId) {
    var url = "/Project/GetAllProjects?companyId=" + companyId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getAllProjectsFiltered(companyId, fromDate, toDate, status) {
    var url = "/Project/GetAllProjectsFiltered?companyId=" + companyId + "&fromDate=" + fromDate + "&toDate=" + toDate + "&status=" + status;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getProject(companyId, customerId, projectId) {
    var url = "/Project/GetProject?companyId=" + companyId + "&customerId=" + customerId + "&projectId=" + projectId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getProjectResult(projectId) {
    var url = "/Project/GetProjectResult?projectId=" + projectId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function saveProject(customerId, companyId, selectedCompanyResponsibles) {
    return $.ajax({
        type: 'POST',
        data: {
            projectActivity: {
                CustomerId: customerId,
                CompanyId: companyId,
                Date: $("#activityDate").val(),
                Activity: $("#activityTask").val(),
                Description: $("#activityDescription").val(),
                CompanyResponsible: $("#activityContactCompany").val(),
                CompanyResponsible2: $("#activityContactCompany2").val(),
                CustomerContact: $("#activityContact").val(),
                Status: $("#activityStatus").val(),
                NextStep: $("#activityNextStep").val(), 
                Priority: $("#activityPrio").val(),
                CampaignId: $("#activityCampaign").val()
            },
            chosenCustomerId: $("#activityCustomer").val(),
            customerMeetingExtraCompanyResponsibles: selectedCompanyResponsibles,
            ProjectActivitiesResult: {
                ProjectId: null,
                Result: $("#ProjectResult").val()
            },
        },
        url: "/Project/SaveProject"
    });
}

export function getProjectsOfEntireCustomerGroup(customerGroupdId) {
    var url = "/Project/GetProjectsOfEntireCustomerGroup?customerGroupId=" + customerGroupdId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getAllProjectsForSalesman(companyId, userId) {
    var url = "/Project/GetAllProjectsForSalesman?companyId=" + companyId + "&userId=" + userId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getAllProjectsForSalesmanFiltered(companyId, userId, fromDate, toDate, status) {
    var url = "/Project/GetAllProjectsForSalesmanFiltered?companyId=" + companyId + "&userId=" + userId + "&fromDate=" + fromDate + "&toDate=" + toDate + "&status=" + status;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function editProject(customerId, companyId, projectId, selectedCompanyResponsibles) {

    return $.ajax({
        type: 'POST',
        data:
        {
            projectActivity: {
                CustomerId: customerId,
                CompanyId: companyId,
                Date: $("#activityDate").val(),
                Activity: $("#activityTask").val(),
                Description: $("#activityDescription").val(),
                CompanyResponsible: $("#activityContactCompany").val(),
                CompanyResponsible2: $("#activityContactCompany2").val(),
                CustomerContact: $("#activityContact").val(),
                Status: $("#activityStatus").val(),
                NextStep: $("#activityNextStep").val(),
                Priority: $("#activityPrio").val(),
                CampaignId: $("#activityCampaign").val(),
                ProjectId: projectId
            },
            projectActivityExtraCompanyResponsibles: selectedCompanyResponsibles,
            ProjectActivitiesResult: {
                ProjectId: projectId,
                Result: $("#ProjectResult").val()
            },
        },
        url: "/Project/EditProject"
    });
}

export function removeProject(project) {
    return $.ajax({
        type: 'POST',
        data: {
            projectId: project.projectId
        },
        url: "/Project/RemoveProject"
    });
} 

export function getSelectedCompanyResponsiblesForProject(projectId) {
    var url = "/Project/GetSelectedCompanyResponsiblesForProject?projectId=" + projectId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

//////////////////////////////////////// EXCEL ////////////////////////////////////////
export function downloadWeeklyReport(companyId, type, value) {
    var url = "/Excel/CreateAndDownloadMeetingsFile?companyId=" + companyId + "&type=" + type + "&value=" + value;

    return $.ajax({
        type: 'GET',
        url: url
    });
} 

export function downloadOverviewExcel(companyId, salesman, dateFrom, dateTo, meetingResult, projectStatus) {
    var url = "/Excel/CreateOverviewFile?salesman=" + salesman + "&companyId=" + companyId + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&meetingResult=" + meetingResult + "&projectStatus=" + projectStatus;

    return $.ajax({
        type: 'GET',
        url: url
    });
}
///////////////////////////////////////  PDF  /////////////////////////////////////////
export function downloadWeeklyReportPDF(companyId, type, value) {
    var url = "/PDF/CreateAndDownloadMeetingsFile?companyId=" + companyId + "&type=" + type + "&value=" + value;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function downloadOverviewPDF(companyId, salesman, dateFrom, dateTo, meetingResult, projectStatus) {
    var url = "/PDF/CreateOverviewFile?salesman=" + salesman + "&companyId=" + companyId + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&meetingResult=" + meetingResult + "&projectStatus=" + projectStatus;

    return $.ajax({
        type: 'GET',
        url: url
    });
}
///////////////////////////////////////  DEALS  /////////////////////////////////////////
export function getAllDealsForUser() {
    var url = "/Deals/GetAllDealsForUser";

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function moveDeal(dealId, newLaneId) {
    return $.ajax({
        type: 'POST',
        data: {
            dealId: dealId,
            newLaneId: newLaneId
        },
        url: "/Deals/MoveDeal"
    });
}

export function saveDeal(companyId, selectedCustomerId, selectedCustomerName) {
    return $.ajax({
        type: 'POST',
        data: {
            companyId: companyId,
            title: $("#title").val(),
            description: $("#description").val(),
            priority: $("#prio").val(),
            customerId: selectedCustomerId,
            customerName: selectedCustomerName,
            contactName: $("#contact").val()
        },
        url: "/Deals/SaveDeal"
    });
}

export function deleteDeal(dealId) {
    return $.ajax({
        type: 'POST',
        data: {
            dealId: dealId
        },
        url: "/Deals/DeleteDeal"
    });
}
////////////////////////////////////// KILOMETERS DRIVEN /////////////////////////////////
export function getKmUnregisteredMeetingsForSalesman(companyId, salesmanId) {
    var url = "/Home/GetKmUnregisteredMeetingsForSalesman";

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            companyId: companyId,
            salesmanId: salesmanId
        }
    });
}

export function getKmUnregisteredProspectMeetingsForSalesman(companyId, salesmanId) {
    var url = "/Home/GetKmUnregisteredProspectMeetingsForSalesman";

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            companyId: companyId,
            salesmanId: salesmanId
        }
    });
}

export function registerKilometers(companyId, meetingId, kilometers) {
    var url = "/Home/RegisterKilometers";

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            companyId: companyId,
            meetingId: meetingId,
            kilometers: kilometers
        }
    });
}

export function registerProspectKilometers(companyId, meetingId, kilometers) {
    var url = "/Home/RegisterProspectKilometers";

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            companyId: companyId,
            meetingId: meetingId,
            kilometers: kilometers
        }
    });
}

export function registerSupplierTravel(companyId, userId) {
    var url = "/Home/RegisterSupplierTravel";

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            companyId: companyId,
            userId: userId,
            date: $("#date").val(),
            supplierName: $("#supplier").val(),
            kilometersDriven: $("#kilometer").val(),
            comments: $("#comment").val()
        }
    });
}

export function getSupplierTravelsForSalesman(companyId, salesmanId) {
    var url = "/Home/GetSupplierTravelsForSalesman";

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            companyId: companyId,
            salesmanId: salesmanId
        }
    });
}

export function getRegisteredObjectForSalesman(companyId, salesmanId) {
    var url = "/Home/GetRegisteredObjectForSalesman";

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            companyId: companyId,
            salesmanId: salesmanId
        }
    });
}

////////////////////////////////////// CAMPAIGNS ///////////////////////////////////////////
export function getCampaign(campaignId) {
    var url = "/Campaign/GetCampaign?campaignId=";

    return $.ajax({
        type: 'GET',
        url: url + campaignId
    });
}

export function getCampaigns(companyId) {
    var url = "/Campaign/GetCampaigns?companyId=";

    return $.ajax({
        type: 'GET',
        url: url + companyId
    });
}

export function getCampaignsForSalesman(companyId) {
    var url = "/Campaign/GetCampaignsForSalesman?companyId=" + companyId + "&customerId=" + customerId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function saveCampaign(campaign, members) {
    var url = "/Campaign/SaveCampaign";

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            campaign: campaign,
            salesmen: members
        }
    });
}

export function editCampaign(campaign, members) {
    var url = "/Campaign/EditCampaign";

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            campaign: campaign,
            salesmen: members
        }
    });
}

export function removeCampaign(companyId, id) {
    var url = "/Campaign/RemoveCampaign?companyId=" + companyId + "&campaignId=" + id;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getSelectedMembersForCampaign(companyId, campaignId) {
    var url = "/Campaign/GetSelectedMembersForCampaign?companyId=" +companyId+"&campaignId=";

    return $.ajax({
        type: 'GET',
        url: url + campaignId
    });
}
////////////////////////////////////// PROSPECTS ///////////////////////////////////////////
export function getAllProspects(companyId) {
    var url = "/Prospect/GetAllProspects?companyId=" + companyId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getAllProspectMeetingsForCompany(companyId) {
    var url = "/Prospect/GetAllProspectMeetingsForCompany?companyId=" + companyId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getAllProspectMeetingsForCompanyFiltered(companyId, fromDate, toDate, status) {
    var url = "/Prospect/GetAllProspectMeetingsForCompanyFiltered?companyId=" + companyId + "&fromDate=" + fromDate + "&toDate=" + toDate + "&status=" + status;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getProspect(companyId, prospectId) {
    var url = "/Prospect/GetProspect?companyId=" + companyId + "&prospectId=" + prospectId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function saveProspect(companyId, name , description) {
    var url = "/Prospect/SaveProspect";

    return $.ajax({
        type: 'POST',
        url: url,
        data: {
            companyId: companyId,
            name: name,
            description: description
        }
    });
}

export function saveProspectContact(prospectId, companyId) {
    var sel = document.getElementById("contactProspectRole");
    var role = sel.options[sel.selectedIndex].text;
    return $.ajax({
        type: 'POST',
        data: {
            prospectContact: {
                ProspectId: prospectId,
                CompanyId: companyId,
                FirstName: $("#contactProspectFirstName").val(),
                LastName: $("#contactProspectLastName").val(),
                Telephone: $("#contactProspectTelephone").val(),
                Email: $("#contactProspectEmail").val(),
                Role: role,
            }
        },
        url: "/Prospect/SaveProspectContact"
    });
}

export function getProspectContactsSelect(companyId, prospectId) {
    var url = "/Prospect/GetProspectContactsSelect?companyId=" + companyId + "&prospectId=" + prospectId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function saveProspectMeeting(prospectId, companyId, prospectName, companyContacts, selectedCompanyResponsibles) {
    return $.ajax({
        type: 'POST',
        data: {
            prospectMeeting: {
                ProspectId: prospectId,
                CompanyId: companyId,
                ProspectName: prospectName,
                CompanyResponsible: $("#meetingProspectResponsible").val(),
                TypeOfMeeting: $("#meetingProspectType").val(),
                Date: $("#meetingProspectDate").val(),
                ResultOfMeeting: $("#meetingProspectResult").val(),
                Comments: $("#meetingProspectComment").val(),
                KilometersDriven: $("#meetingProspectKilometersDriven").val(),
                LocationType: $("#meetingProspectLocationType").val(),
                CampaignId: $("#meetingProspectCampaign").val()
            },
            prospectMeetingExtraCustomerContacts: companyContacts,
            customerMeetingExtraCompanyResponsibles: selectedCompanyResponsibles
        },
        url: "/Prospect/SaveMeeting"
    });
}

export function removeProspectMeeting(meeting) {
    return $.ajax({
        type: 'POST',
        data: {
            meeting: meeting
        },
        url: "/Prospect/RemoveMeeting"
    });
}

export function getProspectMeeting(companyId, prospectId, meetingId) {
    var url = "/Prospect/GetMeeting?companyId=" + companyId + "&prospectId=" + prospectId + "&meetingId=" + meetingId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getProspectContacts(companyId, prospectId) {
    var url = "/Prospect/GetProspectContacts?companyId=" + companyId + "&prospectId=" + prospectId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getProspectParticipators(companyId, prospectId, meetingId) {
    var url = "/Prospect/GetProspectMeetingParticipators?companyId=" + companyId + "&prospectId=" + prospectId + "&meetingId=" + meetingId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getSelectedProspectContactsForMeeting(meetingId) {
    var url = "/Prospect/GetSelectedProspectContactsForMeeting?meetingId=" + meetingId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function editProspectMeeting(prospectId, companyId, meetingId, companyContacts, selectedCompanyResponsibles) {
    return $.ajax({
        type: 'POST',
        data: {
            prospectMeeting: {
                ProspectId: prospectId,
                CompanyId: companyId,
                MeetingId: meetingId,
                CompanyResponsible: $("#meetingResponsible").val(),
                TypeOfMeeting: $("#meetingType").val(),
                Date: $("#meetingDate").val(),
                ResultOfMeeting: $("#meetingResult").val(),
                //MiscExplanation: $("#miscExplanation").val(),
                Comments: $("#meetingComment").val(),
                KilometersDriven: $("#meetingKilometersDriven").val(),
                LocationType: $("#meetingLocationType").val(),
            },
            prospectMeetingExtraCustomerContacts: companyContacts,
            prospectMeetingExtraCompanyResponsibles: selectedCompanyResponsibles
        },
        url: "/Prospect/EditMeeting"
    });
}

export function getProspectContact(companyId, prospectId, id) {
    return $.ajax({
        type: 'POST',
        data: {
            prospectId: prospectId,
            companyId: companyId,
            id: id,
        },
        url: "/Prospect/GetProspectContact"
    });
}

export function editProspectContact(prospectId, companyId, id) {
    return $.ajax({
        type: 'POST',
        data: {
            prospectId: prospectId,
            companyId: companyId,
            prospectContact: {
                ProspectId: prospectId,
                CompanyId: companyId,
                Id: id,
                FirstName: $("#contactFirstName").val(),
                LastName: $("#contactLastName").val(),
                Telephone: $("#contactTelephone").val(),
                Email: $("#contactEmail").val(),
                Role: $("#contactRole").val(),
            }
        },
        url: "/Prospect/EditProspectContact"
    });
}

export function convertToCustomer(companyId, prospectId, customerId) {
    return $.ajax({
        type: 'POST',
        data: {
            prospectId: prospectId,
            companyId: companyId,
            customerId: customerId
        },
        url: "/Prospect/ConvertToCustomer"
    });
}

export function getAllProspectMeetingsForSalesman(companyId, userId) {
    var url = "/Prospect/GetAllMeetingsForSalesman?companyId=" + companyId + "&userId=" + userId;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

export function getAllProspectMeetingsForSalesmanFiltered(companyId, userId, fromDate, toDate, status) {
    var url = "/Prospect/GetAllMeetingsForSalesmanFiltered?companyId=" + companyId + "&userId=" + userId + "&fromDate=" + fromDate + "&toDate=" + toDate + "&status=" + status;

    return $.ajax({
        type: 'GET',
        url: url
    });
}

///////////////////////////////////////// BUDGET //////////////////////////////////////////////////////
export function getNonBudgetCustomers(companyId, userId, name, year) {
    return $.ajax({
        type: 'POST',
        data: {
            companyId: companyId,
            userId: userId,
            name: name,
            year: year
        },
        url: "/Budget/GetNonBudgetCustomers"
    });
}

export function saveBudget(companyId, chosenSalesman,name, chosenCustomer, chosenYear, budget) {
    return $.ajax({
        type: 'POST',
        data: {
            companyId: companyId,
            chosenSalesman: chosenSalesman,
            name: name,
            chosenCustomer: chosenCustomer,
            chosenYear: chosenYear,
            budget: budget
        },
        url: "/Budget/SaveBudget"
    });
}

export function getSalesmenWithBudgets(companyId, year) {
    return $.ajax({
        type: 'POST',
        data: {
            companyId: companyId,
            year: year
        },
        url: "/Budget/GetSalesmenWithBudgets"
    });
}

export function updateBudget(budget) {
    return $.ajax({
        type: 'POST',
        data: {
            budget: budget
        },
        url: "/Budget/UpdateBudget"
    });
}

export function removeBudget(budget) {
    return $.ajax({
        type: 'POST',
        data: {
            budget: budget
        },
        url: "/Budget/RemoveBudget"
    });
}
