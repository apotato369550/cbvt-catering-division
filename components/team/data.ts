
export type TeamMember = {
  initials: string;
  name: string;
  role: string;
};

export const initialMembers: TeamMember[] = [
  {
    initials: "JD",
    name: "Juan Dela Cruz",
    role: "Admin",
  },
  {
    initials: "AM",
    name: "Ana Mercado",
    role: "Kitchen staff",
  },
  {
    initials: "RS",
    name: "Rico Santos",
    role: "Management",
  },
];
