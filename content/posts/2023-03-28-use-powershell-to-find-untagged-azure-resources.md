---
categories:
  - Microsoft Azure
  - PowerShell
date: 2023-03-28T11:00:00+01:00
draft: false
lastMod: 2023-03-28T11:00:00+01:00
tags:
  - Microsoft Azure
  - PowerShell
title: Use PowerShell to find untagged Azure resources
---

In this post, I'll show you how to retrieve Azure resources that do not have
any associated tags.

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

## Using the `Get-Resource` cmdlet

You can run the `Get-Resource` cmdlet without any options to retrieve all
Azure resources within your connected Azure account.

To narrow down the list of resources to _only_ those that do not have any
associated tags, we'll utilise the `Where-Object` cmdlet as well. You can
find out more about this cmdlet on [Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/where-object).

```powershell
Get-AzResource | Where-Object {$_.Tags -eq $null -or $_Tags.Count -eq 0}
```

## Further reading

Further information on the `Get-AzResource` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/az.resources/get-azresource).
