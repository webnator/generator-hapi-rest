'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.argument('projectName', { type: String, optional: true, required: false, desc: 'Name for the project' });

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
      },
      {
        type: 'input',
        name: 'appRepo',
        message: 'What is the url of the repository? (Leave blank for no repository)',
        default: ''
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
        this.projectName = this.props.appName;
      }

      done();
    }.bind(this));
  },

  writing: function () {
    this.projectName = _.deburr(this.projectName);
    this.projectName = _.kebabCase(this.projectName);

    this.cleanProjectName = _.camelCase(this.projectName);
    this.cleanProjectName = _.toLower(this.cleanProjectName);

    this.destinationRoot(this.projectName);

    var templateVars = {
      appUppercaseName: _.toUpper(this.cleanProjectName),
      cleanProjectName: this.cleanProjectName,
      appName: this.projectName,
      appPrefix: this.props.appPrefix,
      dockerRepo: "dev.docker.kickstartteam.es:5000/kst",
      consulRepo: "dev.consul.kickstartteam.es:8500",
      usesRAML: this.props.appRAML,
      usesTests: this.props.appTesting,
      usesHealth: this.props.appHealth,
      usesAuth: this.props.appAuth,
      groupedApp: false,
      appGroup: ''
    };

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
        this.templatePath('tests/components/**'),
        this.destinationPath('tests/components'),
        templateVars
      );

      this.template(
        this.templatePath('tests/server/**'),
        this.destinationPath('tests/server'),
        templateVars
      );

      if (this.props.appHealth === true) {
        this.template(
          this.templatePath('tests/health/**'),
          this.destinationPath('tests/health'),
          templateVars
        );
      }
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
    this.copy(
      this.templatePath('hidden/jshintrc'),
      this.destinationPath('.jshintrc')
    );

    if (this.props.appRepo !== '' && this.props.appRepo.toUpperCase().substr(0,4) !== 'GIT') {
      // this.props.appRepo = 'git@github.com:webnator/' + this.props.appRepo + '.git';
      this.props.appRepo = 'git@gitlab.digitalservices.es:kst/' + this.props.appRepo + '.git';
    }

    this.config.save();
    this.config.set('appRAML', this.props.appRAML);
    this.config.set('appTesting', this.props.appTesting);
    this.config.set('appHealth', this.props.appHealth);
    this.config.set('appAuth', this.props.appAuth);
    this.config.set('appName', this.projectName);
    this.config.set('appPrefix', this.props.appPrefix);
    this.config.set('appRepo', this.props.appRepo);

  },

  install: function () {
    this.composeWith('hapi-rest:module', {
      args: ['defaultModule']
    });

    this.spawnCommandSync('git', ['init']);
    console.log('rep', this.props.appRepo);
    if (this.props.appRepo !== '') {
      this.spawnCommandSync('git', ['remote', 'add', 'origin', this.props.appRepo]);
      this.spawnCommandSync('git', ['add', '--all']);
      this.spawnCommandSync('git', ['commit', '-m', '"initial commit from generator"']);
      this.spawnCommandSync('git', ['push', '-u', 'origin', 'master']);
    }

    this.spawnCommand('sh', [this.sourceRoot() + '/../ops/consulVars.sh', this.projectName + '/dev', this.props.appPrefix, this.projectName]);

    this.npmInstall();
  },

  end: function () {
    this.log(yosay(
      'Thanks for using ' + chalk.red('generator-hapi-rest') + ' if you like it, buy me a beer!'
    ));
  }
});
