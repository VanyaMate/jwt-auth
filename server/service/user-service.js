const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require("../dtos/user-dto");
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration (email, password) {
        const candidate = await UserModel.findOne({ email });

        if (candidate) {
            throw ApiError.BadRequest('Пользователь с таким email уже существует');
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({
            email,
            password: hashPassword,
            activationLink
        });
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }

    async login (email, password) {
        const user = await UserModel.findOne({ email });

        if (!user || !bcrypt.compare(password, user.password)) {
            throw ApiError.BadRequest('Неправильно введен логин или пароль');
        }

        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }

    async logout (refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async activate (activationLink) {
        const user = await UserModel.findOne({ activationLink });

        if (!user) {
            throw ApiError.BadRequest('Неверная ссылка активации');
        }

        if (user && user.isActivated) {
            throw ApiError.BadRequest('Пользователь уже активирован');
        }

        user.isActivated = true;
        await user.save();
    }

    async refresh (refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findRefreshToken(refreshToken);

        console.log(userData);
        console.log(tokenFromDb);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = await tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto,
        }
    }

    async getAllUsers () {
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();