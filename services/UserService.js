 
import api from './api';
class UserService {

    constructor() {
        this.adminRoute = process.env.NEXT_PUBLIC_API_URL+process.env.ADMIN;
        this.adminUserRoute = `${this.adminRoute}/v1/users`
    }

    async getAdminUsers(token) {

        return await api
            .get(this.adminUserRoute, {
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

    async saveAdminUser(token,formData) {

      return await api
          .post(this.adminUserRoute,formData, {
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

  async updateAdminUser(token,formData) {

    return await api
        .put(this.adminUserRoute,formData, {
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

  async deleteAdminUser(token,userId) {
   
    return await api
        .delete(this.adminUserRoute+'/'+userId, {
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

export default new UserService;