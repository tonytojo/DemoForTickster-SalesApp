#pragma checksum "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "0e3c4474f2410ec77c0538e60d2f75afccbb42e0"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Home_QuickRegister), @"mvc.1.0.view", @"/Views/Home/QuickRegister.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\_ViewImports.cshtml"
using SalesApp;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\_ViewImports.cshtml"
using SalesApp.Models;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"0e3c4474f2410ec77c0538e60d2f75afccbb42e0", @"/Views/Home/QuickRegister.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"4592827324f917cd9d3972d0c99f0c6a47bead41", @"/Views/_ViewImports.cshtml")]
    public class Views_Home_QuickRegister : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 1 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
Write(await Html.PartialAsync("../../wwwroot/js/dist/main.cshtml"));

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n<input id=\"logo\"");
            BeginWriteAttribute("value", " value=\"", 79, "\"", 100, 1);
#nullable restore
#line 2 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 87, ViewBag.Logo, 87, 13, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"color\"");
            BeginWriteAttribute("value", " value=\"", 145, "\"", 167, 1);
#nullable restore
#line 3 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 153, ViewBag.Color, 153, 14, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"company\"");
            BeginWriteAttribute("value", " value=\"", 214, "\"", 238, 1);
#nullable restore
#line 4 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 222, ViewBag.Company, 222, 16, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"companyId\"");
            BeginWriteAttribute("value", " value=\"", 287, "\"", 313, 1);
#nullable restore
#line 5 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 295, ViewBag.CompanyId, 295, 18, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"adress\"");
            BeginWriteAttribute("value", " value=\"", 359, "\"", 382, 1);
#nullable restore
#line 6 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 367, ViewBag.Adress, 367, 15, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"reportId\"");
            BeginWriteAttribute("value", " value=\"", 430, "\"", 455, 1);
#nullable restore
#line 7 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 438, ViewBag.ReportId, 438, 17, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"salesReportId\"");
            BeginWriteAttribute("value", " value=\"", 508, "\"", 538, 1);
#nullable restore
#line 8 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 516, ViewBag.SalesReportId, 516, 22, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"workspaceId\"");
            BeginWriteAttribute("value", " value=\"", 589, "\"", 617, 1);
#nullable restore
#line 9 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 597, ViewBag.WorkspaceId, 597, 20, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n\r\n<input id=\"username\"");
            BeginWriteAttribute("value", " value=\"", 667, "\"", 692, 1);
#nullable restore
#line 11 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 675, ViewBag.UserName, 675, 17, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"loggedInName\"");
            BeginWriteAttribute("value", " value=\"", 744, "\"", 765, 1);
#nullable restore
#line 12 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 752, ViewBag.Name, 752, 13, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"userId\"");
            BeginWriteAttribute("value", " value=\"", 811, "\"", 834, 1);
#nullable restore
#line 13 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 819, ViewBag.UserId, 819, 15, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"isAdmin\"");
            BeginWriteAttribute("value", " value=\"", 881, "\"", 905, 1);
#nullable restore
#line 14 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 889, ViewBag.IsAdmin, 889, 16, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n<input id=\"isSuperUser\"");
            BeginWriteAttribute("value", " value=\"", 956, "\"", 984, 1);
#nullable restore
#line 15 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 964, ViewBag.IsSuperUser, 964, 20, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"display: none\" />\r\n\r\n\r\n<div>\r\n    <nav class=\"navbar navbar-light light-blue lighten-4\"");
            BeginWriteAttribute("style", " style=\"", 1080, "\"", 1136, 6);
            WriteAttributeValue(" ", 1088, "background-color:", 1089, 18, true);
#nullable restore
#line 19 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue(" ", 1106, ViewBag.Color, 1107, 14, false);

#line default
#line hidden
#nullable disable
            WriteAttributeValue("", 1121, ";", 1121, 1, true);
            WriteAttributeValue(" ", 1122, "height:", 1123, 8, true);
            WriteAttributeValue(" ", 1130, "70px", 1131, 5, true);
            WriteAttributeValue(" ", 1135, "", 1136, 1, true);
            EndWriteAttribute();
            WriteLiteral(">\r\n        <a href=\"/\" style=\"height: 100%\"><img");
            BeginWriteAttribute("src", " src=\"", 1185, "\"", 1204, 1);
#nullable restore
#line 20 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 1191, ViewBag.Logo, 1191, 13, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(@" style="" height: 100%"" /></a>
        <div id=""spinner"" class=""spinner-border"" style=""color: white"" role=""status"">
            <span class=""sr-only"">Loading...</span>
        </div>
        <div style=""float: right; display: flex"">
            <div class=""username"" style=""color: white; margin: 10px"">");
#nullable restore
#line 25 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
                                                                Write(ViewBag.UserName);

#line default
#line hidden
#nullable disable
            WriteLiteral("</div>\r\n            <a id=\"prevLink\" href=\"/\"><i class=\"fas fa-arrow-circle-left\" style=\"color: white; font-size: 44px\"></i></a>\r\n        </div>\r\n    </nav>\r\n</div>\r\n<div class=\"content\">\r\n\r\n</div>\r\n<footer class=\"text-center text-lg-start\"");
            BeginWriteAttribute("style", " style=\"", 1768, "\"", 1822, 5);
            WriteAttributeValue("", 1776, "background-color:", 1776, 17, true);
#nullable restore
#line 33 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue(" ", 1793, ViewBag.Color, 1794, 14, false);

#line default
#line hidden
#nullable disable
            WriteAttributeValue("", 1808, ";", 1808, 1, true);
            WriteAttributeValue(" ", 1809, "color:", 1810, 7, true);
            WriteAttributeValue(" ", 1816, "white", 1817, 6, true);
            EndWriteAttribute();
            WriteLiteral(">\r\n    <div class=\"container p-4\">\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-6 col-md-12\">\r\n                <div style=\"height: 50%\">\r\n                    <img");
            BeginWriteAttribute("src", " src=\"", 1999, "\"", 2018, 1);
#nullable restore
#line 38 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
WriteAttributeValue("", 2005, ViewBag.Logo, 2005, 13, false);

#line default
#line hidden
#nullable disable
            EndWriteAttribute();
            WriteLiteral(" style=\"height: 100%; max-height: 100px\" />\r\n                </div>\r\n            </div>\r\n            <div class=\"col-lg-6 col-md-12\">\r\n                <p>\r\n                    ");
#nullable restore
#line 43 "C:\Users\Tony\Source\Repos\SalesApp\SalesApp\SalesApp\Views\Home\QuickRegister.cshtml"
               Write(ViewBag.Adress);

#line default
#line hidden
#nullable disable
            WriteLiteral("\r\n                </p>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</footer>\r\n\r\n\r\n");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591