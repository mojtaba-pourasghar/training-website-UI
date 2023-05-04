import api from './api';

class PermissionService {
    constructor() {
      this.adminRoute = process.env.NEXT_PUBLIC_API_URL+process.env.ADMIN;
      this.adminPermissionRoute = `${this.adminRoute}/v1/permissions`
    }

    async getAdminPermissions(token) {
        return await api
            .get(this.adminPermissionRoute, {
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

    async saveAdminPermission(token,formData) {

      return await api
          .post(this.adminPermissionRoute,formData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          })
          .then((response) =>                               
            response.data
          )
          .catch(error => {
            //console.error(error);
            throw error;
          });
  }

  async updateAdminPermission(token,formData) {

    return await api
        .put(this.adminPermissionRoute,formData, {
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

  async deleteAdminPermission(token,permissionId) {
   
    return await api
        .delete(this.adminPermissionRoute+'/'+permissionId, {
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

export default new PermissionService;