import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

export const data = {
  navMain: [
    {
      title: "general",
      url: "/dashboard",
      icon: IconDashboard,
      permission: [1, 2],
      sub: [
        {
          title: "general",
          url: "/dashboard",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "newLaundry",
          url: "/newLaundry",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "dirtyLinen",
          url: "/dirtyLinen",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "cleanLinen",
          url: "/cleanLinen",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "stockIn",
          url: "/stockIn",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "laundryClaim",
          url: "/laundryClaim",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "damagedHospital",
          url: "/damagedHospital",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "sendForFix",
          url: "/sendForFix",
          icon: IconDashboard,
          permission: [1, 2],

        },
        {
          title: "returnLaundry",
          url: "/returnLaundry",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "shelfCount",
          url: "/shelfCount",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "hospitalReturn",
          url: "/hospitalReturn",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "sticker",
          url: "/sticker",
          icon: IconDashboard,
          permission: [1, 2],

        }, {
          title: "calculatePercentage",
          url: "/calculatePercentage",
          icon: IconDashboard,
          permission: [1, 2],
        }, {
          title: "stockCountForm",
          url: "/stockCountForm",
          icon: IconDashboard,
          permission: [1, 2],
        }, {
          title: "cleanDoc",
          url: "/cleanDoc",
          icon: IconDashboard,
          permission: [1, 2],

        }, {
          title: "dirtyDoc",
          url: "/dirtyDoc",
          icon: IconDashboard,
          permission: [1, 2],
        },
      ]
    },
    {
      title: "createStatus",
      url: "/setting",
      icon: IconListDetails,
      sub: [
        {
          title: "parDepartment",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "dirtyRequest",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "departmentTransfer",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "otherRequest",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "chartroom",
          url: "/dashboard",
          icon: IconDashboard,
        },
      ]
    },
    {
      title: "contract",
      url: "#",
      icon: IconChartBar,
      sub: [
        {
          title: "laundryContract",
          url: "/dashboard",
          icon: IconDashboard,
        },
        {
          title: "hospitalContract",
          url: "/dashboard",
          icon: IconDashboard,
        },
      ]
    },
    {
      title: "report",
      url: "#",
      icon: IconFolder,
    },

    {
      title: "laundryFactory",
      url: "/laundryFactory",
      icon: IconChartBar,
      sub: [
        {
          title: "laundrySetting",
          url: "/laundryFactory/laundrySetting",
          icon: IconDashboard,
        }
      ]
    },
    {
      title: "management",
      url: "/management",
      icon: IconSettings,
      permission: [1, 2],
      sub: [
        {
          title: "saleOffice",
          url: "/management/saleoffice",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "customerGroups",
          url: "/management/customer-groups",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "customers",
          url: "/management/customers",
          icon: IconDashboard,
          permission: [1, 2],
        },

        // {
        //   title: "saleOfficeGroupTypes",
        //   url: "/management/saleOfficeGroupTypes",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        // {
        //   title: "saleOfficeGroups",
        //   url: "/management/saleOfficeGroups",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        {
          title: "userMnagement",
          url: "/management/user",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "permissionManagement",
          url: "/management/permission",
          icon: IconDashboard,
          permission: [1, 2],
        },
        // {
        //   title: "factories",
        //   url: "/management/factories",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        // {
        //   title: "factorySaleOffice",
        //   url: "/management/factory-sale-office",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        {
          title: "stockLocations",
          url: "/management/stockLocation",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "locations",
          url: "/management/locations",
          icon: IconDashboard,
          permission: [1, 2],
        },
        // {
        //   title: "sapSale",
        //   url: "/management/sapSale",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        // {
        //   title: "materialTypes",
        //   url: "/management/materialTypes",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        // {
        //   title: "materials",
        //   url: "/management/materials",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        // {
        //   title: "itemCategories",
        //   url: "/management/itemCategories",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        // {
        //   title: "itemCategoryPrices",
        //   url: "/management/itemCategoryPrices",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        // {
        //   title: "items",
        //   url: "/management/items",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        // {
        //   title: "itemBags",
        //   url: "/management/itemBags",
        //   icon: IconDashboard,
        //   permission: [1, 2],
        // },
        {
          title: "roundTime",
          url: "/management/roundTime",
          icon: IconDashboard,
          permission: [1, 2],
        },
        {
          title: "paymentTypes",
          url: "/management/payment-types",
          icon: IconDashboard,
          permission: [1, 2],
        },

      ]
    },
    {
      title: "catalog",
      url: "#",
      icon: IconUsers,
      permission: [1, 2],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      permission: [1, 2],
      items: [
        {
          title: "Active Proposals",
          url: "#",
          permission: [1, 2],
        },
        {
          title: "Archived",
          url: "#",
          permission: [1, 2],
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      permission: [1, 2],
      items: [
        {
          title: "Active Proposals",
          url: "#",
          permission: [1, 2],
        },
        {
          title: "Archived",
          url: "#",
          permission: [1, 2],
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      permission: [1, 2],
      items: [
        {
          title: "Active Proposals",
          url: "#",
          permission: [1, 2],
        },
        {
          title: "Archived",
          url: "#",
          permission: [1, 2],
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
      permission: [1, 2],
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
      permission: [1, 2],
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
      permission: [1, 2],
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
      permission: [1, 2],
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
      permission: [1, 2],
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
      permission: [1, 2],
    },
  ],


}