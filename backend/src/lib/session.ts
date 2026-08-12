export const TenantSession = {
  setOrg(orgId: string) {
    localStorage.setItem('orgId', orgId);
  },

  getOrg() {
    return localStorage.getItem('orgId');
  },

  clear() {
    localStorage.removeItem('orgId');
  },
};
