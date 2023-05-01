const userService = require('../service/user-service');

class UserController {
    async registration (reg, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.registration(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true
            });

            return res.json(userData);
        }
        catch (e) {
            console.log(`[Server] Error [UserController] [registration] ${ e }`);
        }
    }

    async login (reg, res, next) {
        try {

        }
        catch (e) {

        }
    }

    async logout (reg, res, next) {
        try {

        }
        catch (e) {

        }
    }

    async activate (reg, res, next) {
        try {

        }
        catch (e) {

        }
    }

    async refresh (reg, res, next) {
        try {

        }
        catch (e) {

        }
    }

    async getUsers (reg, res, next) {
        try {
            res.json([{id: 1, login: "Vanya"}])
        }
        catch (e) {

        }
    }
}

module.exports = new UserController();