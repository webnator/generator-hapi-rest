'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _ = require('lodash');
var fs = require('fs');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('moduleName', { type: String, optional: true, required: false, desc: 'Name for the module' });
  },
  prompting: function () {
    var done = this.async();

    var prompts = [];

    if (!this.moduleName) {
      var namePrompt = {
        type: 'input',
        name: 'modName',
        message: 'What\'s the name of your new module:',
        default: this.moduleName
      };
      prompts.unshift(namePrompt);
    }

    this.prompt(prompts, function (props) {
      this.props = props;
      this.props.appPrefix = _.toUpper(this.props.appPrefix);
      if (!this.moduleName) {
        this.moduleName = this.props.modName;
      }

      done();
    }.bind(this));
  },

  writing: function () {
    this.moduleName = _.camelCase(this.moduleName);

    var usesTests = this.config.get('appTesting');

    this.cleanProjectName = _.camelCase(this.config.get('appName'));
    this.cleanProjectName = _.toLower(this.cleanProjectName);

    var templateVars = {
      appUppercaseName: _.toUpper(this.cleanProjectName),
      cleanProjectName: this.cleanProjectName,
      appName: this.config.get('appName'),
      appPrefix: this.props.appPrefix,
      moduleName: this.moduleName,
      moduleNamePascal: this.moduleName.substr(0, 1).toUpperCase() + this.moduleName.substr(1)
    };

    this.template(
      this.templatePath('default/controllers/defaultController.js'),
      this.destinationPath('server/api/' + this.moduleName + '/controllers/' + this.moduleName + 'Controller.js'),
      templateVars
    );

    this.template(
      this.templatePath('default/controllers/defaultUtils.js'),
      this.destinationPath('server/api/' + this.moduleName + '/controllers/' + this.moduleName + 'Utils.js'),
      templateVars
    );

    this.template(
      this.templatePath('default/responses/defaultResponses.js'),
      this.destinationPath('server/api/' + this.moduleName + '/responses/' + this.moduleName + 'Responses.js'),
      templateVars
    );

    this.template(
      this.templatePath('default/index.js'),
      this.destinationPath('server/api/' + this.moduleName + '/' + 'index.js'),
      templateVars
    );

    this.template(
      this.templatePath('default/models/defaultModel.js'),
      this.destinationPath('server/api/' + this.moduleName + '/models/' + this.moduleName + 'Model.js'),
      templateVars
    );

    this.template(
      this.templatePath('default/models/defaultModelJoi.js'),
      this.destinationPath('server/api/' + this.moduleName + '/models/' + this.moduleName + 'ModelJoi.js'),
      templateVars
    );

    if (usesTests === true) {
      this.template(
        this.templatePath('tests/default/default-spec.js'),
        this.destinationPath('tests/' + this.moduleName + '/' + this.moduleName + '-spec.js'),
        templateVars
      );
    }

    var routes = fs.readFileSync(this.destinationPath('server/routes.js'), 'utf8');
    routes = routes.replace('/* routesinject */', 'require(\'./api/' + this.moduleName + '\')(server); \n /* routesinject */');

    fs.writeFileSync(this.destinationPath('server/routes.js'), routes, 'utf8');
  },

  end: function () {
    this.log('Done! Your module has been added to the project');
  }
});
