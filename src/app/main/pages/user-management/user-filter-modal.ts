export interface userFilters {
    orgId?: string;
    statusId?: string;
    roleId?: string;
    search?: string;
    pageNumber: string | "1";
    pageSize: string | "10";
  }