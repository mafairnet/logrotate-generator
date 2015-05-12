var merge = require('merge');

var base = {
    'file': '',
    'rotate': '',
    'interval': '',
    'size': '',
    'emailaddress': '',
    'owner': '',
    'group': '',
    'ownerR': '',
    'ownerW': '',
    'ownerX': '',
    'groupR': '',
    'groupW': '',
    'groupX': '',
    'otherR': '',
    'otherW': '',
    'otherX': '',
    'missingok': '',
    'compress': '',
    'delaycompress': '',
    'prerotate': '',
    'postrotate': '',
    'copytruncate': ''
};

var toBool = function(value) {
    var bool = false;
    if (value) {
        bool = !value ? false :
            typeof value === 'boolean' ? value :
            typeof value === 'number' ? !! value :
            typeof value === 'string' ? value === 'on' : false;
    }

    return bool;
}

var toUnixRight = function(r, w, x) {
    var right = 0;
    if (toBool(r)) right += 4;
    if (toBool(w)) right += 2;
    if (toBool(x)) right += 1;

    return right;
}

var ConfigParser = function(config) {};

ConfigParser.ERROR = {
    FILE_MISSING: 'File must be provided.',
    TYPE_MISSING: 'Either interval or size must be provided.',
    USERGROUP_MISSING: 'When provided, both Owner and Group must be filled.'
};

ConfigParser.prototype.setConfig = function(config) {
    this.config = merge.recursive(base, config);
    return this;
};

ConfigParser.prototype.getConfig = function() {
    return this.config;
}

ConfigParser.prototype.validate = function() {
    var c = this.config;

    if (!c.file) throw new Error(ConfigParser.ERROR.FILE_MISSING);

    if (!c.interval && !c.size) throw new Error(ConfigParser.ERROR.TYPE_MISSING);

    if ((c.owner && !c.group) || (!c.owner && c.group)) throw new Error(ConfigParser.ERROR.USERGROUP_MISSING);
};

ConfigParser.prototype.toString = function() {
    var out, c = this.config;
    this.validate();

    out = c.file + " {\n";
    out += "\trotate " + c.rotate + "\n";

    if (c.interval) {
        out += "\t" + c.interval + "\n";
    }

    if (c.size) {
        out += "\tsize=" + c.size + "\n";
    }

    if (c.compress) {
        out += "\tcompress\n";
    }

    if (c.delaycompress) {
        out += "\tdelaycompress\n";
    }

    if (c.missingok) {
        out += "\tmissingok\n";
    }

    if (c.copytruncate) {
        out += "\tcopytruncate\n";
    }

    if (c.owner && c.group) {
        out += "\tcreate " +
            toUnixRight(c.ownerR, c.ownerW, c.ownerX) +
            toUnixRight(c.groupR, c.groupW, c.groupX) +
            toUnixRight(c.otherR, c.otherW, c.otherX) + " " + c.owner + " " + c.group + "\n";
    }

    if (c.prerotate) {
        out += "\tprerotate\n";
        out += "\t\t" + c.prerotate.replace(/\n/g, '\n\t\t').replace(/\n+$/g, '') + "\n";
        out += "\tendscript\n";
    }

    if (c.postrotate) {
        out += "\tpostrotate\n";
        out += "\t\t" + c.postrotate.replace(/\n/g, '\n\t\t').replace(/\n+$/g, '') + "\n";
        out += "\tendscript\n";
    }

    out += "}";

    return out;
};

module.exports = ConfigParser;