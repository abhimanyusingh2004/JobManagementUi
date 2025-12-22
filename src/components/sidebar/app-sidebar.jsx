// import * as React from "react"
// import {
//   IconDashboard,
//   IconMessage2Question,
//   IconSettings,
//   IconCalendarClock,
//   IconCalendarWeekFilled,
//   IconDeviceTabletUp,
//   IconFileLike
// } from "@tabler/icons-react"


// import { NavDocuments } from "@/components/sidebar/nav-documents"
// import { NavMain } from "@/components/sidebar/nav-main"
// import { NavSecondary } from "@/components/sidebar/nav-secondary"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import { ScrollArea } from "../ui/scroll-area"
// import { useSelector } from "react-redux"

// export const sidebarData = {
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "/",
//       icon: IconDashboard,
//     },
//     {
//       title: "Calender",
//       icon: IconCalendarWeekFilled,
//       items: [
//         {
//           title: "Create Calender",
//           url: "/create-calender",
//         },
//         {
//           title: "All Events",
//           url:"/allevents",
//         },
//          {
//           title: "Birthday Calender",
//           url:"/birthday-calender",
//         }
//       ],
//     },
//     {
//       title: "Creative",
//       icon: IconDeviceTabletUp,
//       items: [
//         {
//           title: "Upload Creative",
//           url: "/upload",
//         },
       
//       ],
//     },
//     {
//       title: "Approval",
//       icon: IconFileLike,
//       items: [
//         {
//           title: "Approve Calender",
//           url: "/approve-calender",
//         },
//         {
//           title: "Approve Creative",
//           url: "/approve-creative",
//         },
//       ],
//     },
//      {
//       title: "Monthly Calender",
//       icon: IconFileLike,
//       items: [
//         {
//           title: "Approve Calender",
//           url: "/manager-calender",
//         },
//          {
//           title: "Approve Creative",
//           url: "/manager-creative",
//         }
       
//       ],
//     },
//   ],
//   navSecondary: [
//     {
//       title: "Settings",
//       url: "/setting",
//       icon: IconSettings,
//     },
//   ],
//   documents: [
//     {
//       name: "Single Option",
//       url: "/single-option",
//       icon: IconCalendarClock,
//     },
//   ],
// }

// export function AppSidebar({ data = sidebarData, ...props }) {

//   const role = useSelector((state) => state.user.role?.toLowerCase() || "guest")

//   const navMain = data.navMain
//     .filter((item) => {
//       if (role === "admin") {
//         return item.title === "Dashboard" || item.title === "Approval"
//       }
//       if (role === "manager") {   
//         return item.title === "Dashboard" || item.title === "Monthly Calender"
//       }
//       if (role === "user") {
//         return item.title !== "Approval" && item.title !=="Monthly Calender"
//       }
//       if (role === "SuperAdmin") {
//         return item.title !== "Approval"
//       }
//       return true;
    
//     })
//     .map((item) => {
//       if (item.items) {
//         return {
//           ...item,
//           items: item.items.filter((subItem) => {
//             if (role !== "admin" && subItem.title === "Hold Routing") {
//               return false
//             }
//             return true
//           }),
//         }
//       }
//       return item
//     })

//   const documents = data.documents.filter((item) => {
//     if (role !== "admin" && item.name === "Company") {
//       return false
//     }
//     return true
//   })

//   const filteredSidebarData = {
//     ...data,
//     navMain,
//     documents,
//   }

//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               asChild
//               className="data-[slot=sidebar-menu-button]:!py-1.5 data-[slot=sidebar-menu-button]:!px-0"
//             >
//               <a href="/">
//                 <img src="./logo.png" alt="logo" className="h-6 w-fit" />
//                 <span className="text-base font-semibold">
//                   LMS Digital Panel{" "}
//                   <span className="text-xs text-gray-500 ml-1">
//                     ({role})
//                   </span>
//                 </span>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>

//       <SidebarContent>
//         <ScrollArea className="h-[calc(100vh-4rem)] pr-1">
//           <div className="min-h-[calc(100vh-4rem)] flex flex-col flex-1">
//             <NavMain items={filteredSidebarData.navMain} />
//             <NavDocuments items={filteredSidebarData.documents} />
//             <NavSecondary
//               items={filteredSidebarData.navSecondary}
//               className="mt-auto"
//             />
//           </div>
//         </ScrollArea>
//       </SidebarContent>
//     </Sidebar>
//   )
// }




import * as React from "react"
import {
  IconSettings,
  IconTemplate,      // You can use this or any icon you prefer
  IconPlus,
  IconEdit,
} from "@tabler/icons-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ScrollArea } from "../ui/scroll-area"

export const sidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconSettings,
    },
    {
      title: "Tracker",
      icon: IconTemplate,
      items: [
        {
          title: "Job-Posts",
          url: "/tracker/job-posts",
          icon: IconPlus,
        },
        {
          title: "Resume",
          url: "/tracker/resumes",
          icon: IconEdit,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/setting",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({data = sidebarData, ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!py-1.5 data-[slot=sidebar-menu-button]:!px-0"
            >
              <a href="/">
                <img src="./logo.png" alt="logo" className="h-6 w-fit" />
                <span className="text-base font-semibold">
                Legal Draft
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-4rem)] pr-1">
          <div className="min-h-[calc(100vh-4rem)] flex flex-col flex-1">
            <NavMain items={sidebarData.navMain} />
            <NavSecondary
              items={sidebarData.navSecondary}
              className="mt-auto"
            />
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}