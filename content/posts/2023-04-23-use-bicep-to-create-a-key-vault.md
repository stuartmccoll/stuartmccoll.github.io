---
categories:
  - Automation
  - Bicep
  - Key Vault
  - Microsoft Azure
  - PowerShell
date: 2023-04-23T22:00:00+01:00
draft: false
lastMod: 2023-04-23T22:00:00+01:00
tags:
  - Automation
  - Bicep
  - Key Vault
  - Microsoft Azure
  - PowerShell
title: Use Bicep to create an Azure key vault
---

In this post, I'll show you how to create a
[Bicep](https://github.com/Azure/bicep) file which declares an Azure key vault
resource containing a single secret.

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
New-AzResourceGroup -Name rgKeyVaultDemo -Location uksouth
```

You'll get a response back similar to the following (where `<subscription_id>`
contains your own Azure subscription identifier):

```powershell
ResourceGroupName : rgKeyVaultDemo
Location          : uksouth
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/<subscription_id>/resourceGroups/rgKeyVaultDemo
```

## Creating the `.bicep` file

Create a new file called `Create-KeyVault.bicep`. In this file, we'll
be declaring two different Azure resources:

- the key vault itself.
- a single secret to be stored within the key vault.

We'll be passing two mandatory parameters when deploying the resources declared
in this file; the name of the key vault to be created; and the name of the
secret to be created.

```bicep
@description('The name of the key vault to be created')
param keyVaultName string

@description('The name of the key vault secret to be created')
param secretName string
```

We'll also be passing another parameter when deploying the resources declared
in this file - the Azure region that we want to deploy to, which we'll give
a parameter name of `location`. If not passed, this will default to the
location of the associated Azure resource group.

```bicep
@description('Location for all resources')
param location string = resourceGroup.location()
```

### Declaring the key vault

You can find information on all of the available properties within the
[Microsoft Learn documentation for the Microsoft.KeyVault/vaults resource type](https://learn.microsoft.com/en-us/azure/templates/microsoft.keyvault/vaults?pivots=deployment-language-bicep).

When declaring this resource, the properties we're setting are as follows:

- `name` - the name of the resource.
- `location` - the Azure region where the resource will be deployed.
- `accessPolicies` - an array of identities that have access to the key vault.
- `enableRbacAuthorization` - controls how data actions are authorised.
- `enableSoftDelete` - specifies whether 'soft delete' functionality is
enabled.
- `enabledForDeployment` - specifies whether Azure Virtual Machines are
permitted to retrieve certificates stored as secrets from the key vault.
- `enabledForDiskEncryption` - specifies whether Azure Disk Encryption
is permitted to retrieve secrets from the vault and unwrap keys.
- `enabledForTemplateDeployment` - specifies whether Azure Resource
Manager is permitted to retrieve secrets from the key vault.
- `sku` - the name of the SKU; `standard` is effectively 'pay per use'.
- `softDeleteRetentionInDays` the number of days to retain data after
soft deletion.
- `tenantId` - the Azure Active Directory tenant identifier that should
be used for authenticating requests to the key vault.

```bicep
resource vault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: keyVaultName
  location: location
  properties: {
    accessPolicies: []
    enableRbacAuthorization: false
    enableSoftDelete: true
    enabledForDeployment: false
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: false
    softDeleteRetentionInDays: 7
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
  }
}
```

### Declaring the secret

You can find information on all of the available properties within the
[Microsoft Learn documentation for the Microsoft.KeyVault/vaults/secrets resource type](https://learn.microsoft.com/en-us/azure/templates/microsoft.keyvault/vaults/secrets?pivots=deployment-language-bicep).

When declaring this resource, the properties we're setting are as follows:

- `name` - the name of the resource
- `parent` - the key vault that this secret will belong to.
- `value` - the value of the secret.

```bicep
resource secret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  name: secretName
  parent: vault
  properties: {
    value: 'TestValue'
  }
}
```

## Deploying the resources declared in the `.bicep` file

To deploy the resources declared in our .`bicep` file, run the following
command in a PowerShell session:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName rgKeyVaultDemo -TemplateFile ./Create-KeyVault.bicep -keyVaultName <UNIQUE_VALUE> -secretName TestSecret
```

You should receive a similar response to the following:

```powershell
DeploymentName          : Create-KeyVault
ResourceGroupName       : rgTestKeyVault
ProvisioningState       : Succeeded
Timestamp               : 23/04/2023 20:57:48
Mode                    : Incremental
TemplateLink            :
Parameters              :
                          Name             Type                       Value
                          ===============  =========================  ==========
                          keyVaultName     String                     "TestKeyVault"
                          secretName       String                     "TestSecret"
                          location         String                     "uksouth"
                          sku              String                     "standard"

Outputs                 :
DeploymentDebugLogLevel :
```

You can validate that the deployment has been successful by running the
following command in a PowerShell session:

```powershell
Get-AzResource -ResourceGroupName rgKeyVaultDemo
```

## Removing resources

Finally, let's remove the resources created. Run the following command in a
PowerShell session:

```powershell
Remove-AzResourceGroup -Name rgKeyVaultDemo
```

## Further reading

If you're interested in exploring Bicep further, you may be interested in the
[Fundamentals of Bicep](https://learn.microsoft.com/en-gb/training/paths/fundamentals-bicep/)
learning path at Microsoft Learn.
