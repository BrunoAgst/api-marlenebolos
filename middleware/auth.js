const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

module.exports = async function(req, res, next) {

    const authToken = req.headers['authorization'];

    if(authToken === undefined || authToken === null || authToken === ''){
        res.status(404);
        res.json({'err': 'Não Autorizado'});
    }

    const bearer = authToken.split(' ');
    var token = bearer[1];

    await jwt.verify(token, jwtSecret, (err, data) => {
        if(err){
            res.status(401);
            res.json({'err': 'Sessão inválida'});
            return
        }
        
        next();
    });

};