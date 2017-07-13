'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args,opts)

    this._copy_parameters = function(target, role)
    {
    this.fs.copy(
        this.templatePath('resources\\' + this.props.version + '\\MsDeployXmls' + '-' + this.props.deploymentType + '\\' + this.props.SKU + '.' + role + '.parameters.xml'),
        this.destinationPath(target + this.props.name + '\\MsDeployXmls\\' + this.props.name + '-' + this.props.deploymentType + '.' + role + '.parameters.xml'));
    };
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
      choices: ["Deploy", "Provision" ],
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
      this.destinationPath(target + this.props.name + '\\configs\\' + this.props.name + '-' + this.props.deploymentType + '-common' + '.packaging.config.json')
    );

    this.fs.copyTpl(
      this.templatePath('resources\\' + this.props.version + '\\configs\\' + this.props.SKU + '.packaging.config.json'),
      this.destinationPath(target + this.props.name + '\\configs\\' + this.props.name + '-' + this.props.deploymentType + '.packaging.config.json'), {
        name: this.props.name,
        deploymenttype: this.props.deploymentType
      }
    );        

    if(this.props.SKU === "XM1")
    {
      this._copy_parameters(target, 'CD');
      this._copy_parameters(target, 'CM');      
    }

    if(this.props.SKU === "XP1")
    {
      this._copy_parameters(target, 'CD');
      this._copy_parameters(target, 'CM');
      this._copy_parameters(target, 'PRC');
      this._copy_parameters(target, 'REP');      
    }

    if(this.props.SKU === "XP0")
    {
      this._copy_parameters(target, 'CD');
      this._copy_parameters(target, 'CM');
    }

    this.fs.copyTpl(
      this.templatePath('resources\\' + this.props.version + '\\create-package.ps1'),
      this.destinationPath(target + '\\' + this.props.name + '-create-package.ps1'), {
        name: this.props.name,
        deploymentType: this.props.deploymentType
      }
    );
  } 

  install() {
    this.installDependencies();
  }
};
