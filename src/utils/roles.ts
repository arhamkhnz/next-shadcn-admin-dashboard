interface AccessEntry {
  route?: string;
  accessSubRoutes?: boolean;
}

interface RoleInfo {
  canAccess: (string | AccessEntry)[];
}

interface Roles {
  [role: string]: RoleInfo;
}

export const roles: Roles = {
  Admin: {
    canAccess: ["/*"],
  },
  Employee: {
    canAccess: [
      {
        route: "/orders",
        accessSubRoutes: true,
      },
    ],
  },
};
