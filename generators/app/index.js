'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('projectName', { type: String, optional: true, required: false, desc: 'Name for the project' });
    if (this.projectName) {
      this.projectName = _.camelCase(this.projectName);
    }

  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the exclusive ' + chalk.red('generator-hapi-rest') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'appPrefix',
        message: 'What will be the preffix of your application:',
        default: this.appName
      },
      {
        type: 'confirm',
        name: 'appRAML',
        message: 'Would you like to enable RAML documentation?',
        default: true
      },
      {
        type: 'confirm',
        name: 'appTesting',
        message: 'Would you like to enable testing with Jasmine?',
        default: true
      },
      {
        type: 'confirm',
        name: 'appHealth',
        message: 'Would you like to set a \'Health Check\' endpoint?',
        default: true
      },
      {
        type: 'confirm',
        name: 'appAuth',
        message: 'Would you like to set up an authentication boilerplate with jwt?',
        default: true
      }
    ];

    if (!this.projectName) {
      var namePrompt = {
        type: 'input',
        name: 'appName',
        message: 'What\'s the name of your application:',
        default: this.appName
      };
      prompts.unshift(namePrompt);
    }

    this.prompt(prompts, function (props) {
      this.props = props;
      this.props.appPrefix = _.toUpper(this.props.appPrefix);
      if (!this.projectName) {
        this.projectName = _.camelCase(this.props.appName);
      }

      done();
    }.bind(this));
  },

  writing: function () {
    this.destinationRoot(this.projectName);

    var templateVars = {
      appUppercaseName: _.toUpper(this.projectName),
      appName: this.projectName,
      appPrefix: this.props.appPrefix
    }

    this.template(
      this.templatePath('server/**'),
      this.destinationPath('server'),
      templateVars
    );
    if (this.props.appRAML === true) {
      this.template(
        this.templatePath('raml/**'),
        this.destinationPath('raml'),
        templateVars
      );
    }

    if (this.props.appTesting === true) {
      this.template(
        this.templatePath('tests/**'),
        this.destinationPath('tests'),
        templateVars
      );
    }

    if (this.props.appHealth === true) {
      this.template(
        this.templatePath('extra_apis/health/**'),
        this.destinationPath('server/api/health'),
        templateVars
      );
    }

    if (this.props.appAuth === true) {
      this.template(
        this.templatePath('extra_apis/auth/**'),
        this.destinationPath('server/api/auth'),
        templateVars
      );
    }

    this.template(
      this.templatePath('config/**'),
      this.destinationPath(''),
      templateVars
    );

    this.copy(
      this.templatePath('hidden/gitignore'),
      this.destinationPath('.gitignore')
    );

  },

  install: function () {
    this.spawnCommand('git', ['init']);
    this.npmInstall();
  },

  end: function () {
    this.log(yosay(
      'Thanks for using ' + chalk.red('generator-hapi-rest') + ' if you like it, buy me a beer!'
    ));
  }
});
