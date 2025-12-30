const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {

    
    //récuperer le badge
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied' })
    }

    //découper le badge
    const headerToken = header.split(' ')[1];

    //le vérifier
    try {
        const authorizedUser = jwt.verify(headerToken, process.env.JWT_SECRET)

        if (authorizedUser) {
            req.user = authorizedUser;
            next()
        }
    } catch (error) {
        return res.status(401).json({ message: 'Access Denied' })
    }
}

module.exports = protect;