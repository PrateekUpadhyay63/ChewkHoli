export interface activityListingFilter {
  statusId?: string;
  roleId?: string;
  groupId?: string;
  pageNumber: string | "1";
  pageSize: string | "10";
}
