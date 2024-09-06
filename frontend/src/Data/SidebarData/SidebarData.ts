import {
  ChartBarSquareIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

import { ISidebarData } from "../../types/types";

export const SidebarData: ISidebarData[] = [
  {
    title: "Overview",
    navigator: "/admin/overview",
    icon: ChartBarSquareIcon,
  },
  {
    title: "Attendees",
    navigator: "/admin/attendees",
    icon: UsersIcon,
  },
  // {
  //   title: "Forms",
  //   navigator: "/admin/forms",
  //   icon: DocumentTextIcon,
  // },
  // {
  //   title: "Discounts",
  //   navigator: "/admin/discounts",
  //   icon: TagIcon,
  // },
];
