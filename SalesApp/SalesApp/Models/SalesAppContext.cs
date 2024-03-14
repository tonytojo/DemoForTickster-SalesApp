using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace SalesApp.Models
{
    public partial class SalesAppContext : DbContext
    {
        public SalesAppContext()
        {
        }

        public SalesAppContext(DbContextOptions<SalesAppContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Admin> Admins { get; set; }
        public virtual DbSet<AnnualCustomerBudget> AnnualCustomerBudgets { get; set; }
        public virtual DbSet<ArchivedCustomerMeeting> ArchivedCustomerMeetings { get; set; }
        public virtual DbSet<ArchivedCustomerMeetingExtraCompanyResponsible> ArchivedCustomerMeetingExtraCompanyResponsibles { get; set; }
        public virtual DbSet<ArchivedCustomerMeetingExtraCustomerContact> ArchivedCustomerMeetingExtraCustomerContacts { get; set; }
        public virtual DbSet<ArchivedProjectActivity> ArchivedProjectActivities { get; set; }
        public virtual DbSet<ArchivedProspectMeeting> ArchivedProspectMeetings { get; set; }
        public virtual DbSet<ArchivedProspectMeetingExtraCompanyResponsible> ArchivedProspectMeetingExtraCompanyResponsibles { get; set; }
        public virtual DbSet<ArchivedProspectMeetingExtraCustomerContact> ArchivedProspectMeetingExtraCustomerContacts { get; set; }
        public virtual DbSet<Campaign> Campaigns { get; set; }
        public virtual DbSet<CampaignsUser> CampaignsUsers { get; set; }
        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<ContactRole> ContactRoles { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<CustomerContact> CustomerContacts { get; set; }
        public virtual DbSet<CustomerGroup> CustomerGroups { get; set; }
        public virtual DbSet<CustomerGroupCustomer> CustomerGroupCustomers { get; set; }
        public virtual DbSet<CustomerMeeting> CustomerMeetings { get; set; }
        public virtual DbSet<CustomerMeetingExtraCompanyResponsible> CustomerMeetingExtraCompanyResponsibles { get; set; }
        public virtual DbSet<CustomerMeetingExtraCustomerContact> CustomerMeetingExtraCustomerContacts { get; set; }
        public virtual DbSet<CustomerValue> CustomerValues { get; set; }
        public virtual DbSet<Deal> Deals { get; set; }
        public virtual DbSet<FollowUp> FollowUps { get; set; }
        public virtual DbSet<KilometersDriven> KilometersDrivens { get; set; }
        public virtual DbSet<KilometersDrivenObliged> KilometersDrivenObligeds { get; set; }
        public virtual DbSet<LightUser> LightUsers { get; set; }
        public virtual DbSet<Login> Logins { get; set; }
        public virtual DbSet<ProjectActivitiesResult> ProjectActivitiesResults { get; set; }
        public virtual DbSet<ProjectActivity> ProjectActivities { get; set; }
        public virtual DbSet<ProjectActivityExtraCompanyResponsible> ProjectActivityExtraCompanyResponsibles { get; set; }
        public virtual DbSet<ProjectFileInfo> ProjectFileInfos { get; set; }
        public virtual DbSet<Prospect> Prospects { get; set; }
        public virtual DbSet<ProspectContact> ProspectContacts { get; set; }
        public virtual DbSet<ProspectMeeting> ProspectMeetings { get; set; }
        public virtual DbSet<ProspectMeetingExtraCompanyResponsible> ProspectMeetingExtraCompanyResponsibles { get; set; }
        public virtual DbSet<ProspectMeetingExtraCustomerContact> ProspectMeetingExtraCustomerContacts { get; set; }
        public virtual DbSet<Sale> Sales { get; set; }
        public virtual DbSet<SalesReferenceTable> SalesReferenceTables { get; set; }
        public virtual DbSet<Salesman> Salesmen { get; set; }
        public virtual DbSet<StatusOption> StatusOptions { get; set; }
        public virtual DbSet<StoreUser> StoreUsers { get; set; }
        public virtual DbSet<SuperUser> SuperUsers { get; set; }
        public virtual DbSet<SupplierTravel> SupplierTravels { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name=SalesAppDb");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.UserId })
                    .HasName("PK__Admins__FCEF90687A8C90E8");

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<AnnualCustomerBudget>(entity =>
            {
                entity.HasKey(e => new { e.Year, e.CompanyId, e.CustomerId })
                    .HasName("PK__Annual_C__DFC0BFFBE025977F");

                entity.ToTable("Annual_CustomerBudget");

                entity.Property(e => e.Year)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.AnnualBudget).HasColumnName("Annual_Budget");

                entity.Property(e => e.AprilBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("April_Budget");

                entity.Property(e => e.AugBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("Aug_Budget");

                entity.Property(e => e.DecBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("Dec_Budget");

                entity.Property(e => e.FebBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("Feb_Budget");

                entity.Property(e => e.JanBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("Jan_Budget");

                entity.Property(e => e.JulyBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("July_Budget");

                entity.Property(e => e.JuneBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("June_Budget");

                entity.Property(e => e.MarsBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("Mars_Budget");

                entity.Property(e => e.MayBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("May_Budget");

                entity.Property(e => e.NovBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("Nov_Budget");

                entity.Property(e => e.OctBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("Oct_Budget");

                entity.Property(e => e.SeptBudget)
                    .HasColumnType("decimal(18, 1)")
                    .HasColumnName("Sept_Budget");

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ArchivedCustomerMeeting>(entity =>
            {
                entity.HasKey(e => e.MeetingId)
                    .HasName("PK__Archived__E9F9E94CAEB65E09");

                entity.ToTable("Archived_CustomerMeeting");

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CampaignId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Comments)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyResponsible)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactTelephone)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.LocationType)
                    .HasMaxLength(55)
                    .IsUnicode(false);

                entity.Property(e => e.MiscExplanation)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProjectId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ArchivedCustomerMeetingExtraCompanyResponsible>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.MeetingId })
                    .HasName("PK__Archived__EC8B72934AB6CC6D");

                entity.ToTable("Archived_CustomerMeeting_ExtraCompanyResponsibles");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ArchivedCustomerMeetingExtraCustomerContact>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.MeetingId })
                    .HasName("PK__Archived__EC8B7293F2FEBEEB");

                entity.ToTable("Archived_CustomerMeeting_ExtraCustomerContacts");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ArchivedProjectActivity>(entity =>
            {
                entity.HasKey(e => e.ProjectId)
                    .HasName("PK__Archived__761ABEF089152D21");

                entity.ToTable("Archived_ProjectActivities");

                entity.Property(e => e.ProjectId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Activity)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CampaignId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyResponsible)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyResponsible2)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerContact)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.Description)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.LastSaved).HasColumnType("datetime");

                entity.Property(e => e.NextStep)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Priority)
                    .HasMaxLength(55)
                    .IsUnicode(false);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ArchivedProspectMeeting>(entity =>
            {
                entity.HasKey(e => e.MeetingId)
                    .HasName("PK__Archived__E9F9E94CA6BEC6E4");

                entity.ToTable("Archived_ProspectMeeting");

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CampaignId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Comments)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyResponsible)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactTelephone)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.LocationType)
                    .HasMaxLength(55)
                    .IsUnicode(false);

                entity.Property(e => e.MiscExplanation)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProjectId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProspectId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProspectName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ArchivedProspectMeetingExtraCompanyResponsible>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.MeetingId })
                    .HasName("PK__Archived__EC8B7293B8F88B46");

                entity.ToTable("Archived_ProspectMeeting_ExtraCompanyResponsibles");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ProspectId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ArchivedProspectMeetingExtraCustomerContact>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.MeetingId })
                    .HasName("PK__Archived__EC8B72935AB574B7");

                entity.ToTable("Archived_ProspectMeeting_ExtraCustomerContacts");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ProspectId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Campaign>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.EndDate).HasColumnType("date");

                entity.Property(e => e.StartDate).HasColumnType("date");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CampaignsUser>(entity =>
            {
                entity.HasKey(e => new { e.CampaignId, e.UserId })
                    .HasName("PK__Campaign__EE26065DFA84DF1D");

                entity.Property(e => e.CampaignId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Company>(entity =>
            {
                entity.HasKey(e => e.Name)
                    .HasName("PK__Companie__737584F7903B8D23");

                entity.HasIndex(e => e.Id, "UQ__Companie__3214EC06F810F496")
                    .IsUnique();

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Adress)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Color)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Id)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.LogoPath)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ReportId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.SalesReport2ReportId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("SalesReport2_ReportId");

                entity.Property(e => e.SalesReportReportId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("SalesReport_ReportId");

                entity.Property(e => e.StoreReportReportId)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("StoreReport_ReportId");

                entity.Property(e => e.WorkspaceId)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ContactRole>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.Role })
                    .HasName("PK__ContactR__C03648BF4197FCBB");

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Role)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.CompanyId })
                    .HasName("PK__Customer__E0CD9DCD8FD212D2");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProduktsäljHydraulik)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("Produktsälj_Hydraulik");

                entity.Property(e => e.ProduktsäljSkydd)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("Produktsälj_Skydd");

                entity.Property(e => e.ProduktsäljSkärande)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("Produktsälj_Skärande");

                entity.Property(e => e.ProduktsäljSlip)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("Produktsälj_Slip");

                entity.Property(e => e.ProduktsäljTillsatsmat)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("Produktsälj_Tillsatsmat");

                entity.Property(e => e.ProduktsäljTransmission)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("Produktsälj_Transmission");

                entity.Property(e => e.ProduktsäljTryckluft)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("Produktsälj_Tryckluft");

                entity.Property(e => e.RevenueLast12MonthSek)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("RevenueLast12Month_SEK");

                entity.Property(e => e.SalesmanResponsible)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("Salesman_Responsible");

                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.Customers)
                    .HasPrincipalKey(p => p.Id)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Customers__Compa__467D75B8");
            });

            modelBuilder.Entity<CustomerContact>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Telephone)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CustomerGroup>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.CompanyId })
                    .HasName("PK__Customer__E0CD9DCDCBCB80F6");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.IncrementId).ValueGeneratedOnAdd();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.CustomerGroups)
                    .HasPrincipalKey(p => p.Id)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__CustomerG__Compa__05D8E0BE");
            });

            modelBuilder.Entity<CustomerGroupCustomer>(entity =>
            {
                entity.HasKey(e => new { e.CustomerGroupId, e.CustomerId })
                    .HasName("PK__Customer__00E9E1B77155FE58");

                entity.Property(e => e.CustomerGroupId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CustomerMeeting>(entity =>
            {
                entity.HasKey(e => e.MeetingId)
                    .HasName("PK__Customer__E9F9E94C57915813");

                entity.ToTable("CustomerMeeting");

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CampaignId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Comments)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyResponsible)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactTelephone)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.LocationType)
                    .HasMaxLength(55)
                    .IsUnicode(false);

                entity.Property(e => e.MiscExplanation)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProjectId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CustomerMeetingExtraCompanyResponsible>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.MeetingId })
                    .HasName("PK__Customer__EC8B7293E4681F45");

                entity.ToTable("CustomerMeeting_ExtraCompanyResponsibles");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CustomerMeetingExtraCustomerContact>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.MeetingId })
                    .HasName("PK__Customer__EC8B7293F7B2B090");

                entity.ToTable("CustomerMeeting_ExtraCustomerContacts");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<CustomerValue>(entity =>
            {
                entity.HasKey(e => new { e.CustomerId, e.CompanyId })
                    .HasName("PK__Customer__76771512E8C19A94");

                entity.ToTable("CustomerValue");

                entity.Property(e => e.CustomerId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Classification)
                    .HasMaxLength(1)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerGroup)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Deal>(entity =>
            {
                entity.Property(e => e.DealId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Description).IsUnicode(false);

                entity.Property(e => e.TimestampCreated)
                    .HasColumnType("datetime")
                    .HasColumnName("Timestamp_Created");

                entity.Property(e => e.TimestampModified)
                    .HasColumnType("datetime")
                    .HasColumnName("Timestamp_Modified");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<FollowUp>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.CustomerId, e.Date, e.ToEmail, e.Comment })
                    .HasName("PK__FollowUp__27D0379F4718930C");

                entity.ToTable("FollowUp");

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ToEmail)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Comment)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<KilometersDriven>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.UserId, e.Date })
                    .HasName("PK__Kilomete__FB98A8157ACA84E7");

                entity.ToTable("KilometersDriven");

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.Kilometers)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<KilometersDrivenObliged>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.UserId })
                    .HasName("PK__Kilomete__FCEF9068FCCE6BB5");

                entity.ToTable("KilometersDrivenObliged");

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<LightUser>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.UserId })
                    .HasName("PK__LightUse__FCEF9068BC0B3D3F");

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Login>(entity =>
            {
                entity.HasKey(e => new { e.Timestamp, e.UserId })
                    .HasName("PK__Logins__59DB16FAB310B214");

                entity.Property(e => e.Timestamp).HasColumnType("datetime");

                entity.Property(e => e.UserId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ProjectActivitiesResult>(entity =>
            {
                entity.HasKey(e => e.ProjectId)
                    .HasName("PK__ProjectA__761ABEF062D4F9E3");

                entity.ToTable("ProjectActivities_Result");

                entity.Property(e => e.ProjectId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Result)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ProjectActivity>(entity =>
            {
                entity.HasKey(e => e.ProjectId)
                    .HasName("PK__ProjectA__761ABEF045DF4DD4");

                entity.Property(e => e.ProjectId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Activity)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CampaignId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyResponsible)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyResponsible2)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerContact)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.Description)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.LastSaved).HasColumnType("datetime");

                entity.Property(e => e.NextStep)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Priority)
                    .HasMaxLength(55)
                    .IsUnicode(false);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ProjectActivityExtraCompanyResponsible>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.ProjectIdId })
                    .HasName("PK__ProjectA__E4E8C8DB245740AC");

                entity.ToTable("ProjectActivity_ExtraCompanyResponsibles");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProjectIdId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ProjectFileInfo>(entity =>
            {
                entity.ToTable("Project_FileInfo");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.FileData).IsRequired();

                entity.Property(e => e.FileName)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.FileType)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.ProjectId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UploadDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<Prospect>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ProspectContact>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CreatedBy)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProspectId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Telephone)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ProspectMeeting>(entity =>
            {
                entity.HasKey(e => e.MeetingId)
                    .HasName("PK__Prospect__E9F9E94CAA04D092");

                entity.ToTable("ProspectMeeting");

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CampaignId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Comments)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyResponsible)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactTelephone)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.LocationType)
                    .HasMaxLength(55)
                    .IsUnicode(false);

                entity.Property(e => e.MiscExplanation)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProjectId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProspectId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProspectName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ProspectMeetingExtraCompanyResponsible>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.MeetingId })
                    .HasName("PK__Prospect__EC8B7293BD5C9C3B");

                entity.ToTable("ProspectMeeting_ExtraCompanyResponsibles");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ProspectId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ProspectMeetingExtraCustomerContact>(entity =>
            {
                entity.HasKey(e => new { e.Id, e.MeetingId })
                    .HasName("PK__Prospect__EC8B72933FB19D72");

                entity.ToTable("ProspectMeeting_ExtraCustomerContacts");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.MeetingId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ContactName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ProspectId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ResultOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TypeOfMeeting)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Sale>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Currency)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.Id)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.SäljareId)
                    .HasMaxLength(55)
                    .IsUnicode(false)
                    .HasColumnName("Säljare_Id");
            });

            modelBuilder.Entity<SalesReferenceTable>(entity =>
            {
                entity.HasKey(e => e.CompanyId)
                    .HasName("PK__SalesRef__2D971CACE8A065C0");

                entity.ToTable("SalesReferenceTable");

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.TableName)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Salesman>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.InköpareJn)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("InköpareJN");

                entity.Property(e => e.Lagerid)
                    .HasMaxLength(5)
                    .IsUnicode(false)
                    .HasColumnName("LAGERID");

                entity.Property(e => e.Namn)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("NAMN");

                entity.Property(e => e.Säljare)
                    .HasMaxLength(3)
                    .IsUnicode(false);

                entity.Property(e => e.SäljareJn)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("SäljareJN");

                entity.Property(e => e.Säljargrupp)
                    .HasMaxLength(15)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<StatusOption>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.OptionValue })
                    .HasName("PK__StatusOp__B2585F4881F5BD8A");

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.OptionValue)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<StoreUser>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.UserId })
                    .HasName("PK__StoreUse__FCEF906853E2F783");

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SuperUser>(entity =>
            {
                entity.HasKey(e => new { e.CompanyId, e.UserId })
                    .HasName("PK__SuperUse__FCEF9068CC2E0337");

                entity.Property(e => e.CompanyId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SupplierTravel>(entity =>
            {
                entity.ToTable("SupplierTravel");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Comments)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.SupplierName)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
