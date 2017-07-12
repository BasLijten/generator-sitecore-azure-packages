'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args,opts)

  };
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the delightful ' + chalk.red('generator-sitecore-azure-packages') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'What packagename do you want to use>'
    }, {
      type: 'list',
      name: 'version',
      message: 'For wat sitecore version do you want to create a package?',
      choices: ["8.2.1", "8.2.2", "8.2.3"],
      default: '8.2.3' 
    }, {
      type: 'list',
      name: 'SKU',
      message: 'On what SKU do you want to base this package?',
      choices: ["XM1", "XP1", "XP0"],
      default: "XP1"
    }, {
      type: 'list',
      name: 'deploymentType',
      message: 'what kind of deployment package do you want to create?',
      choices: ["Deploy", "Provision", "Both"],
      default: "Deploy"
    }

    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    var target = "configuration\\";
    this.fs.copy(
      this.templatePath('resources\\' + this.props.version + '\\configs\\common.packaging.config.json'),
      this.destinationPath(target + this.props.name + '\\configs\\common.packaging.config.json')
    );

    this.fs.copyTpl(
      this.templatePath('resources\\' + this.props.version + '\\configs\\' + this.props.SKU + '.packaging.config.json'),
      this.destinationPath(target + this.props.name + '\\configs\\' + this.props.name + '.packaging.config.json'), {
        name: this.props.name
      }
    );

    this.fs.copy(
      this.templatePath('resources\\' + this.props.version + '\\MsDeployXmls\\' + this.props.SKU + '*'),
      this.destinationPath(target + this.props.name + '\\MsDeployXmls\\')
    );
  }

  install() {
    this.installDependencies();
  }
};
