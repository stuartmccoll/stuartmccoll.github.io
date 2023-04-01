---
categories:
  - Automation
  - Application Insights
  - Bicep
  - Microsoft Azure
  - PowerShell
date: 2023-04-01T21:00:00+01:00
draft: false
lastMod: 2023-04-01T21:00:00+01:00
tags:
  - Automation
  - Application Insights
  - Bicep
  - Microsoft Azure
  - PowerShell
title: Use Bicep to create an Application Insights resource
---

In this post, I'll show you how to create a
[Bicep](https://github.com/Azure/bicep) file which declares the resources
required for an Application Insights instance, specifically one used to
monitor a website.

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
New-AzResourceGroup -Name rgApplicationInsightsDemo -Location uksouth
```

You'll get a response back similar to the following (where `<subscription_id>`
contains your own Azure subscription identifier):

```powershell
ResourceGroupName : rgApplicationInsightsDemo
Location          : uksouth
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/<subscription_id>/resourceGroups/rgApplicationInsightsDemo
```

## Creating the `.bicep` file

Create a new file called `Create-ApplicationInsights.bicep`. In this file, we'll
be declaring two different Azure resources:

- an Application Insights resource
- a Log Analytics workspace - this isn't _strictly_ necessary; without it, you
can create an Application Insights with the 'Classic' Resource Mode. However, this mode has been deprecated in favour of using a Log Analytics workspace.

We'll be passing a single parameter when deploying the resources declared in
this file - the Azure region that we want to deploy to, which
we'll give a parameter name of `location`. If not passed, this will default
to the location of the associated Azure resource group:

```bicep
@description('Location for all resources')
param location string = resourceGroup.location()
```

### Declaring the Log Analytics workspace

You can find information on all of the available properties within the
[Microsoft Learn documentation for the Microsoft.OperationInsights/workspaces resource type](https://learn.microsoft.com/en-us/azure/templates/microsoft.operationalinsights/workspaces?pivots=deployment-language-bicep).

When declaring this resource, the properties we're setting are as follows:

- `name` - the name of the resource.
- `location` - the Azure region where the resource will be deployed.
- `sku` - the name of the SKU; `PerGB2018` is effectively 'pay per use'.
- `retentionInDays` - the number of days to retain workspace data.

```bicep
resource workspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'logWebsiteApplicationInsightsWorkspace'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}
```

### Declaring the Azure Application Insights resource

You can find information on all of the available properties within the
[Microsoft Learn documentation for the Microsoft.Insights/components resource type](https://learn.microsoft.com/en-us/azure/templates/microsoft.insights/components?pivots=deployment-language-bicep).

When declaring this resource, the properties we're setting are as follows:

- `name` - the name of the resource.
- `location` - the Azure region where the resource will be deployed.
- `kind` - the kind of application that the resource refers to. In this example
we're monitoring a website, so we're using `web`.
- `Application_Type` - the type of application being monitored. Again, we're
using `web`.
- `Flow_Type` - the documentation specifies that this is to be set as
`Bluefield` when creating resources via the REST API.
- `Ingestion_Mode` - the flow of the ingestion; we're delivering to a Log
Analytics workspace, so our value is `LogAnalytics`.
- `publicNetworkAccessForIngestion` - the network access type for accessing
Application Insights ingestion.
- `publicNetworkAccessForQuery` - the network access type for accessing
Application Insights query.
- `Request_Source` - the documentation specifies that this is to be set as
`rest` when creating resources via the REST API.
- `RetentionInDays` - the retention period in days.
- `WorkspaceResourceId` - the resource identifier of the Log Analytics
workspace that data will be ingested to.

```bicep
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appiWebsite'
  kind: 'web'
  location: location
  properties: {
    Application_Type: 'web'
    Flow_Type: 'Bluefield'
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
    Request_Source: 'rest'
    RetentionInDays: 90
    WorkspaceResourceId: workspace.id
  }
}
```

## Deploying the resources declared in the `.bicep` file

To deploy the resources declared in our .`bicep` file, run the following
command in a PowerShell session:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName rgApplicationInsightsDemo -TemplateFile ./Create-ApplicationInsights.bicep
```

You should receive a similar response to the following:

```powershell
DeploymentName          : Create-ApplicationInsights
ResourceGroupName       : rgApplicationInsightsDemo
ProvisioningState       : Succeeded
Timestamp               : 01/04/2023 11:08:36
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name             Type                       Value
                          ===============  =========================  ==========
                          location         String                     "uksouth"

Outputs                 :

DeploymentDebugLogLevel :
```

You can validate that the deployment has been successful by running the
following command in a PowerShell session:

```powershell
Get-AzResource -ResourceGroupName rgApplicationInsightsDemo
```

## Removing resources

Finally, let's remove the resources created. Run the following command in a
PowerShell session:

```powershell
Remove-AzResourceGroup -Name rgApplicationInsightsDemo
```

## Further reading

If you're interested in exploring Bicep further, you may be interested in the
[Fundamentals of Bicep](https://learn.microsoft.com/en-gb/training/paths/fundamentals-bicep/)
learning path at Microsoft Learn.
