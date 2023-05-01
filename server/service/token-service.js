const { sign } = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
    async generateTokens (payload) {
        const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' }, null);
        const refreshToken = sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d' }, null);

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
}

module.exports = new TokenService();