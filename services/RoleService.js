import api from './api';

class RoleService {
    constructor() {
      this.adminRoute = process.env.NEXT_PUBLIC_API_URL+process.env.ADMIN;
      this.adminRoleRoute = `${this.adminRoute}/v1/roles`
    }

    async getAdminRoles(token) {
        return await api
            .get(this.adminRoleRoute, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            })
            .then((response) =>                               
              response.data
            )
            .catch(error => {
              throw error;
            });
    }
}

export default new RoleService;