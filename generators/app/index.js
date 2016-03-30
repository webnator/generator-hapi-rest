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

    var prompts = [];

    if (!this.projectName) {
      var namePrompt = {
        type: 'input',
        name: 'appName',
        message: 'What\'s the name of your application:',
        default: this.appName
      };
      prompts.push(namePrompt);
    }

    this.prompt(prompts, function (props) {
      this.props = props;
      if (!this.projectName) {
        this.projectName = _.camelCase(this.props.appName);
      }
    
      done();
    }.bind(this));
  },

  writing: function () {
    this.destinationRoot(this.projectName);

    this.template(
      this.templatePath('server/**'),
      this.destinationPath('server'),
      {
        appUppercaseName: _.toUpper(this.projectName),
        appName: this.projectName
      }
    );

    this.template(
      this.templatePath('raml/**'),
      this.destinationPath('raml'),
      {
        appUppercaseName: _.toUpper(this.projectName),
        appName: this.projectName
      }
    );

    this.template(
      this.templatePath('tests/**'),
      this.destinationPath('tests'),
      {
        appUppercaseName: _.toUpper(this.projectName),
        appName: this.projectName
      }
    );

    this.template(
      this.templatePath('config/**'),
      this.destinationPath(''),
      {
        appUppercaseName: _.toUpper(this.projectName),
        appName: this.projectName
      }
    );

    this.copy(
      this.templatePath('hidden/gitignore'),
      this.destinationPath('.gitignore')
    );

  },

  install: function () {
    this.npmInstall();
  }
});
