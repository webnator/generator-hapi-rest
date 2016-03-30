'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the exclusive ' + chalk.red('generator-hapi-rest') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appName',
      message: 'What\'s the name of your application:',
      default: this.appName
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.props.appName = _.camelCase(this.props.appName);
      // To access props later use this.props.someAnswer;

      done();
    }.bind(this));
  },

  writing: function () {
    this.destinationRoot(this.props.appName);

    this.template(
      this.templatePath('server/**'),
      this.destinationPath('server'),
      {
        appUppercaseName: _.toUpper(this.props.appName),
        appName: this.props.appName
      }
    );

    this.template(
      this.templatePath('raml/**'),
      this.destinationPath('raml'),
      {
        appUppercaseName: _.toUpper(this.props.appName),
        appName: this.props.appName
      }
    );

    this.template(
      this.templatePath('tests/**'),
      this.destinationPath('tests'),
      {
        appUppercaseName: _.toUpper(this.props.appName),
        appName: this.props.appName
      }
    );

    this.template(
      this.templatePath('config/**'),
      this.destinationPath(''),
      {
        appUppercaseName: _.toUpper(this.props.appName),
        appName: this.props.appName
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
