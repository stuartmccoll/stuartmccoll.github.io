---
categories:
  - Microsoft Azure
  - PowerShell
date: 2023-06-24T11:30:00+01:00
draft: false
lastMod: 2023-06-24T11:30:00+01:00
tags:
  - Microsoft Azure
  - PowerShell
title: Use PowerShell to find deallocated Azure VMs
---

In this post, I'll show you how to find deallocated Azure Virtual Machines
using the Azure Resource Graph PowerShell module.

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

## Install the Azure Resource Graph PowerShell module

We're going to follow [this guide on Microsoft Learn](https://learn.microsoft.com/en-us/azure/governance/resource-graph/first-query-powershell#add-the-resource-graph-module)
to install the Azure Resource Graph PowerShell module.

Run the following command in a PowerShell session:

```powershell
Install-Module -Name Az.ResourceGraph
```

## Using the `Search-AzGraph` cmdlet

Azure Virtual Machines that have been stopped will have a PowerState property
of 'deallocated'. We can use this in an Azure Resource Graph query to find
any Azure Virtual Machines that have been stopped.

```powershell
Search-AzGraph -Query "where type=~ 'Microsoft.Compute/VirtualMachines' and properties.extended.instanceView.powerState.code == 'PowerState/deallocated' | project name, location"
```

With this query, we're asking to retrieve any Azure resources that have a type
of `Microsoft.Compute/VirtualMachines` and where the
`properties.extended.instanceView.powerState.code` property is equal to
`PowerState/deallocated`. We're then asking only for the `name` and `location`
properties to be returned.

You should get a response like:

```powershell
name        location
----        --------
TestVM1     eastus
```

If you want more information to be returned about the resource, you can leave
out the `| project name, location` part of the query to return the default
dataset.

## Further reading

Further information on the `Search-AzGraph` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/az.resourcegraph/search-azgraph).
