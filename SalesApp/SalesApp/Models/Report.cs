using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesApp.Models
{
    public class Report
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Path { get; set; }
        public string Type { get; set; }
        public bool Hidden { get; set; }
        public int Size { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string ParentFolderId { get; set; }
        public string ContentType { get; set; }
        public string Content { get; set; }
        public bool IsFavorite { get; set; }
        public bool HasDataSources { get; set; }
        public Group Group { get; set; }
        public List<Page> Pages { get; set; }
        public Metadata Meta { get; set; }
        public IEnumerable<Tag> Tags { get; set; }
        public bool Restricted { get; set; }
        public bool UserHasFullDataAccess { get; set; }
    }

    public class Metadata
    {
        public string Id { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
        public string PublishedBy { get; set; }
        public string Date { get; set; }
        public string Image { get; set; }
        public string Owner { get; set; }
        public string Wiki { get; set; }
        public string UpdateFrequenzy { get; set; }
        public string Support { get; set; }
        public string LastChangedBy { get; set; }
        public string InformationOwner { get; set; }
        public bool IsPublished { get; set; }
    }

    public class DataSource
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<AdGroup> AdGroups { get; set; }
    }

    public class Page
    {
        public string Id { get; set; }
        public string Name { get; set; }

    }

    public class Tag
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class AdGroup
    {
        public string Name { get; set; }
        public string Id { get; set; }
    }
}