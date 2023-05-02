const { sign } = require('jsonwebtoken');
const tokenModel = require('../models/token-model');
const jwt = require('jsonwebtoken');

class TokenService {
    async generateTokens (payload) {
        const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' }, null);
        const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' }, null);

        return {
            accessToken,
            refreshToken,
        }
    }

    async saveToken (userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ user: userId });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await tokenModel.create({ user: userId, refreshToken });
        return token;
    }

    async findRefreshToken (refreshToken) {
        const tokenData = await tokenModel.findOne({ refreshToken });
        return tokenData;
    }

    async removeToken (refreshToken) {
        const tokenData = await tokenModel.deleteOne({ refreshToken });
        return tokenData;
    }

    validateAccessToken (accessToken) {
        try {
            const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            return userData;
        }
        catch (e) {
            return null;
        }
    }

    validateRefreshToken (refreshToken) {
        try {
            console.log(refreshToken);
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            console.log(userData);
            return userData;
        }
        catch (e) {
            return null;
        }
    }
}

module.exports = new TokenService();