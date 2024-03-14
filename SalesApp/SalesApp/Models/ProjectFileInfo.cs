using System;
using System.Collections.Generic;

#nullable disable

namespace SalesApp.Models
{
    public partial class ProjectFileInfo
    {
        public string Id { get; set; }
        public string CompanyId { get; set; }
        public string ProjectId { get; set; }
        public string FileName { get; set; }
        public byte[] FileData { get; set; }
        public string FileType { get; set; }
        public DateTime UploadDate { get; set; }
    }
}
