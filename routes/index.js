var express = require('express');
var router = express.Router();
var ConfigParser = require('../services/configparser');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Logrotate generator',
        config: {}
    });
});

router.post('/', function(req, res, next) {
    var config, parser = new ConfigParser();

    try {
        console.log(req.body);
        config = parser.setConfig(req.body).toString();
        res.render('config', {
            title: 'Your logrotate configuration',
            config: config
        });
    } catch (err) {
        console.error('=======================================');
        console.error(err);
        console.error('=======================================');
        var error = {};
        switch (err) {
            case ConfigParser.ERROR.FILE_MISSING:
                error.field = "file";
                break;
            case ConfigParser.ERROR.TYPE_MISSING:
                error.field = "type";
                break;
            case ConfigParser.ERROR.OWNERGROUP_MISSING:
                error.field = "rights";
        }

        error.message = err.message;

        res.render('index', {
            title: 'Logrotate generator :: an error occured',
            config: parser.getConfig(),
            error: error
        });
    }

});

module.exports = router;