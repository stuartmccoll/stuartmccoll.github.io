---
categories:
  - Microsoft Azure
  - PowerShell
date: 2023-03-29T20:00:00+01:00
draft: false
lastMod: 2023-03-29T20:00:00+01:00
tags:
  - Microsoft Azure
  - PowerShell
title: Use PowerShell to find empty Azure resource groups
---

In this post, I'll show you how to find and remove empty Azure resource groups
using the Azure Az PowerShell module.

## Install the Azure Az PowerShell module

We're going to follow [this guide on Microsoft Learn](https://learn.microsoft.com/en-us/powershell/azure/install-az-ps)
to install the Azure Az PowerShell module.

I'm going to assume that you have the latest version of PowerShell installed.
If you don't, you can follow [this guide on Microsoft Learn](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell).

Run the following command in a PowerShell session:

```powershell
Install-Module -Name Az -Scope CurrentUser -Repository PsGallery -Force
```

You'll need to authenticate Azure PowerShell by signing in with your Azure
credentials.

```powershell
Connect-AzAccount
```

## Using the `Get-AzResourceGroup` cmdlet

You can run the `Get-AzResourceGroup` cmdlet without any options to retrieve
all Azure resource groups within your connected Azure account.

We'll use this cmdlet in tandem with the `Get-AzResource` cmdlet to retrieve
the names of all resource groups that do not have associated resources.

```powershell
Get-AzResourceGroup | ForEach-Object { if (!(Get-AzResource -ResourceGroupName $_.ResourceGroupName)) { Write-Host $_.ResourceGroupName } }
```

This can be taken a step further to remove any resource groups that are found
to have no associated resources, by using the `Remove-AzResourceGroup` cmdlet.

```powershell
Get-AzResourceGroup | ForEach-Object { if (!(Get-AzResource -ResourceGroupName $_.ResourceGroupName)) { Remove-AzResourceGroup $_.ResourceGroupName } }
```

## Further reading

Further information on the `Get-AzResourceGroup` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/az.resources/get-azresourcegroup).

Further information on the `Remove-AzResourceGroup` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/az.resources/remove-azresourcegroup).

Further information on the `Get-AzResource` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/az.resources/get-azresource).
