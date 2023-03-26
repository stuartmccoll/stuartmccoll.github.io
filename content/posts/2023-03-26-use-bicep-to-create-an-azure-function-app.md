---
categories:
  - Automation
  - Azure Function App
  - Bicep
  - Microsoft Azure
  - PowerShell
date: 2023-03-26T15:00:00+01:00
draft: false
lastMod: 2023-03-26T15:00:00+01:00
tags:
  - Automation
  - Azure Function App
  - Bicep
  - Microsoft Azure
  - PowerShell
title: Use Bicep to create an Azure Function App
---

In this post, I'll show you how to create a
[Bicep](https://github.com/Azure/bicep) file which declares the resources
required for an Azure Function App.

## Prerequisites

I'll be using [Visual Studio Code](https://code.visualstudio.com/) as my
editor, where I'll be writing the `.bicep` file for this walkthrough. I'll also
be using the official [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).

I'll be using the
[Azure Az PowerShell module](https://learn.microsoft.com/en-us/powershell/azure/?view=azps-9.5.0)
to handle deploying the resources declared in the `.bicep` file I create. You
can find instructions on [installing the module](https://learn.microsoft.com/en-us/powershell/azure/install-az-ps?view=azps-9.5.0)
at Microsoft Learn.

You'll need to install [Azure Bicep](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
if you haven't already.

The rest of this post assumes that you've already authenticated the Azure Az
PowerShell module with an Azure account.

## Creating an Azure resource group

Before we begin writing our Bicep code, we'll create an Azure resource group
using the Azure Az PowerShell module. Run the following command in a PowerShell
session:

```powershell
New-AzResourceGroup -Name rg-BicepFunctionAppDemo -Location uksouth
```

You'll get a response back similar to the following (where `<subscription_id>`
contains your own Azure subscription identifier):

```powershell
ResourceGroupName : rg-BicepFunctionAppDemo
Location          : uksouth
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/<subscription_id>/resourceGroups/rg-BicepFunctionAppDemo
```

## The Azure Function code

The Bicep file that we create shortly won't _only_ declare the resources for an
Azure Function App, but it'll also contain declarations necessary to deploy an
Azure Function inside of this resource. For the purposes of this walkthrough,
I've taken a copy of the default code populated when manually creating a new
.NET Azure Function HTTP trigger. When triggered with no query parameters, this
code simply responds with:

```text
This HTTP triggered function executed successfully. Pass a name in the query
string or in the request body for a personalized response.
```

I've compressed the contents of this default code into a .`zip` file and
uploaded it to my GitHub account. If you're playing along, you can use the same
default code found in [this GitHub repository](https://github.com/stuartmccoll/bicep-examples/azure-function-app/).
A full copy of the `Create-AzureFunctionApp.bicep` file that we create below
can also be found in the same GitHub repository.

## Creating the `.bicep` file

Create a new file called `Create-AzureFunctionApp.bicep`. In this file, we'll
be declaring _five_ different Azure resources:

- an Azure Function App
- an Azure Storage account (required by the Azure Function App)
- a serverless Consumption hosting plan (required by the Azure Function App)
- an Application Insights resource (allowing us to collect logs)
- a zip deployment (allowing us to deploy our pre-packaged `.zip` file
containing the code mentioned above).

I've decomposed the entire `.bicep` file into individual sections below,
but you can also [view the file in its entirety](https://github.com/stuartmccoll/bicep-examples/blob/main/azure-function-app/Create-AzureFunctionApp.bicep).

We'll be passing _two_ parameters when deploying the resources declared in
this file. First, will be the Azure region that we want to deploy to, which
we'll give a parameter name of `location`. If not passed, this will default
to the location of the associated Azure resource group:

```bicep
@description('Location for all resources')
param location string = resourceGroup.location()
```

Our second parameter will allow us to pass the URL of the `.zip` file
containing our default Azure Function code:

```bicep
@description('Location of Azure Function .zip archive')
param packageUri string
```

We'll create two variables for our Azure Function App name, and our
Azure Storage account name:

```bicep
var functionAppName = 'funcBicepFunctionAppDemo'
var storageAccountName = 'stbicepfunctionappdemo'
```

### Declaring the Azure Storage account

```bicep
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-08-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'Storage'
}
```

### Declaring the Azure serverless Consumption hosting plan

```bicep
resource hostingPlan 'Microsoft.Web/serverfarms@2021-03-01' = {
  name: 'aseBicepFunctionAppDemo'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {}
}
```

### Declaring the Azure Function App

```bicep
resource functionApp 'Microsoft.Web/sites@2021-03-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccountName};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: applicationInsights.properties.InstrumentationKey
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet'
        }
      ]
    }
    httpsOnly: true
  }
}
```

### Declaring the Azure Application Insights resource

This resource isn't _strictly_ necessary, as it isn't something that is
mandatory when deploying a new Azure Function App.

```bicep
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appiBicepFunctionAppDemo'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    Request_Source: 'rest'
  }
}
```

### Declaring the `.zip` deployment resource

It's important that the `packageUri` property value matches the name that you
give to the `.zip` file URL parameter mentioned earlier. For ease, I've given
both the same name.

```bicep
resource zipDeploy 'Microsoft.Web/sites/extensions@2022-03-01' = {
  parent: functionApp
  name: 'MSDeploy'
  properties: {
    packageUri: packageUri
  }
}
```

## Deploying the resources declared in the `.bicep` file

If you don't already have the Azure CLI installed, you can find an installation
guide at [Microsoft Learn](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).

To deploy the resources declared in our .`bicep` file, run the following
command in a PowerShell session:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName rg-BicepFunctionAppDemo -TemplateFile ./Create-AzureFunctionApp.bicep -packageUri https://github.com/stuartmccoll/bicep-examples/raw/main/azure-function-app/BicepFunctionAppDemo.zip
```

You should receive a similar response to the following:

```powershell
DeploymentName          : Create-AzureFunctionApp
ResourceGroupName       : rg-BicepFunctionAppDemo
ProvisioningState       : Succeeded
Timestamp               : 26/03/2023 13:31:22
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name             Type                       Value
                          ===============  =========================  ==========
                          location         String                     "uksouth"
                          packageUri       String
                          "https://github.com/stuartmccoll/bicep-examples/raw/main/azure-function-app/BicepFunctionAppDemo.zip"

Outputs                 :
DeploymentDebugLogLevel :
```

You can validate that the deployment has been successful by running the
following command in a PowerShell session:

```powershell
Get-AzResource -ResourceGroupName rg-BicepFunctionAppDemo
```

If you navigate to the Azure function resource in your account, you'll find a
'Get Function Url' button on the Overview screen. If you navigate to the URL,
you should receive our expected response:

```text
This HTTP triggered function executed successfully. Pass a name in the query
string or in the request body for a personalized response.
```

## Removing resources

Finally, let's remove the resources created. Run the following command in a
PowerShell session:

```powershell
Remove-AzResourceGroup -Name rg-BicepFunctionAppDemo
```

## Further reading

If you're interested in exploring Bicep further, you may be interested in the
[Fundamentals of Bicep](https://learn.microsoft.com/en-gb/training/paths/fundamentals-bicep/)
learning path at Microsoft Learn.
