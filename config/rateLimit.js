const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10,
    message: {"erro": "Muitas requisições a partir deste IP, tente novamente após uma hora"}
});