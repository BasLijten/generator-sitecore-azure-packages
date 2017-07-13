$SitecorePackagePath = ''
$targetWdpPath = ''
$configFolder = ''

Start-SitecoreAzurePackaging -SitecorePath $SitecorePackagePath -DestinationFolderPath $targetWdpPath  `
    -CargoPayloadFolderPath $configFolder + '<%= name %>\CargoPayloads' `
    -CommonConfigPath $configFolder '<%= name %>\Configs\<%= name %>-<%= deploymentType %>-common.packaging.config.json' `
    -SkuConfigPath $configFolder + '<%= name %>\Configs\<%= name %>-<%= deploymentType %>.packaging.config.json' `
    -ParameterXmlPath $configFolder + '<%= name %>\MsDeployXmls\'