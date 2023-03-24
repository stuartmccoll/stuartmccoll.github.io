---
categories:
  - Microsoft Azure
  - PowerShell
date: 2023-03-24T18:30:00+01:00
draft: false
lastMod: 2023-03-24T18:30:00+01:00
tags:
  - Microsoft Azure
  - PowerShell
title: Use PowerShell to retrieve Azure location information
---

In this post, I'll show you how to retrieve Azure location names using
PowerShell; specifically, using the Azure Az PowerShell module.

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

## Using the `Get-AzLocation` cmdlet

You can run the `Get-AzLocation` cmdlet without any filtering to return
information such as latitude, longitude, physical location, region type, etc.
Here, we're going to filter to retrieve _only_ the location names, e.g. the
`Location` of each object returned.

```powershell
Get-AzLocation | Select Location
```

This will return a formatted table containing only the 'unfriendly' version of
each location, e.g. 'eastus', 'uksouth', etc. If you're looking to include
Azure location information in a Bicep file, for example, chances are that this
is the value that you're looking for.

```powershell
Location
--------
eastus
eastus2
```

If you wanted to expand your returned results to also include the 'friendly'
version of each location, you can.

```powershell
Get-AzLocation | Select DisplayName,Location
```

This will return a formatted table containing the 'friendly' and 'unfriendly'
version of each location.

```powershell
DisplayName          Location
-----------          --------
East US              eastus
East US 2            eastus2
```

## Further reading

Further information on the `Get-AzLocation` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/az.resources/get-azlocation).
