const router =require('express').Router();
const wxAuth = require('../libs/wxAuth');

router.get('/', wxAuth);

module.exports = router;