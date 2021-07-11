---
title: "How to install Windows Package Manager (WinGet) on Windows 10"
date: 2021-07-11T11:55:02+01:00
draft: false
---

The Windows Package Manager client (also known as WinGet)
celebrated it's v1.0 release in May of 2021, after announcing at
[Microsoft Build 2020](https://channel9.msdn.com/Events/Build/2020).

At the time of writing, although the client is distributed within the
App Installer package, it isn't generally available unless you're running
a Windows 10 Insider build, or have signed up to the Preview flight ring.

However, it's simple to download and install the package from the
[official GitHub repository](https://github.com/microsoft/winget-cli).
The only downside to this is that it won't enable automatic updates from
the Microsoft Store.

Hit the [releases page](https://github.com/microsoft/winget-cli/releases)
of the repository, and within the 'Assets' section of the latest release
you should spot a `.misxbundle` file. Download and install this as
you would any other application.

To confirm that installation was successful, open a terminal and enter:

```powershell
winget --info
```

If WinGet was installed successfully, you should see something like the
following returned:

```powershell
Windows Package Manager v1.0.11692
Copyright (c) Microsoft Corporation. All rights reserved.

Windows: Windows.Desktop v10.0.19043.1083
Package: Microsoft.DesktopAppInstaller v1.12.11692.0

Logs: %LOCALAPPDATA%\Packages\Microsoft.DesktopAppInstaller_8wekyb3d8bbwe\
LocalState\DiagOutputDir

Links
--------------------------------------------------------
Privacy Statement   https://aka.ms/winget-privacy
Licence Agreement   https://aka.ms/winget-license
Third Party Notices https://aka.ms/winget-3rdPartyNotice
Homepage            https://aka.ms/winget
```

## Using WinGet

You can run `winget --help` to return all available commands. For example,
`winget list` will return a list of all installed applications and packages.

To install a new package, first we can search for it. For example, let's say
that we want to install the latest version of the Microsoft Azure CLI. We'll
search for 'Azure' with the following command:

```powershell
winget search azure
```

Which returns the following:

```powershell
Name                             Id                                Version         Match
---------------------------------------------------------------------------------------------
Bicep CLI                        Microsoft.Bicep                   0.4.63.48766    Tag: azure
Microsoft Azure Storage Explorer Microsoft.AzureStorageExplorer    1.20.0          Tag: Azure
Microsoft Azure Storage Emulator Microsoft.AzureStorageEmulator    5.10.19227.2113 Tag: Azure
Azure Functions Core Tools       Microsoft.AzureFunctionsCoreTools 3.0.3477        Tag: Azure
Azure Data Studio                Microsoft.AzureDataStudio         1.30.0          Tag: azure
Azure Cosmos DB Emulator         Microsoft.AzureCosmosEmulator     2.14.1          Tag: Azure
Azure IoT Explorer (preview)     Microsoft.azure-iot-explorer      0.14.3.0        Tag: azure
Microsoft Azure CLI              Microsoft.AzureCLI                2.26.0
Meazure                          CThingSoftware.Meazure            2.0.1
Microsoft Azure Service Fabric   Microsoft.ServiceFabricRuntime    8.0.521.9590
```

We can then install our package using either the name or ID returned. In this
case, we'll use the name:

```powershell
winget install "Microsoft Azure CLI"
```

With our install complete, you should see something similar to the following
in your terminal:

```powershell
Found Microsoft Azure CLI [Microsoft.AzureCLI]
This application is licensed to you by its owner.
Microsoft is not responsible for, nor does it grant any licences to, third-party packages.
Downloading https://azcliprod.azureedge.net/msi/azure-cli-2.26.0.msi
  ██████████████████████████████  48.1 MB / 48.1 MB
Successfully verified installer hash
Starting package install...
Successfully installed
```

You can find out more about Windows Package Manager over at the [official
Microsoft documentation](https://docs.microsoft.com/en-us/windows/package-manager/).
