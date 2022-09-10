---
categories:
  - Automation
  - Microsoft Azure
  - Azure Functions
  - PowerShell
date: 2022-09-10T23:00:00+01:00
draft: false
lastMod: 2022-06-11T23:00:00+01:00
tags:
  - Automation
  - Microsoft Azure
  - Azure Functions
  - PowerShell
title: Maintain an Azure Container Registry using a PowerShell Azure Function
---

This year I created a small C# CLI application that scrapes this website and
stores the results in Azure Blob Storage. It's essentially a not-very-good
version of the the [Internet Archive](https://archive.org/)'s
[Wayback Machine](https://web.archive.org/), but specific only to this website.

The process happens in two parts. If I merge any pull requests on the
[website-archiver](https://github.com/stuartmccoll/website-archiver) into
`main`, then a GitHub Actions workflow pushes the latest Docker image to an
Azure Container Registry. If I merge any pull requests on the repository that
holds the codebase for this website, then another GitHub Actions workflow
triggers the deployment of an Azure Container Instance using the `latest`
tagged image in the aforementioned Azure Container Registry. The container
runs, the website is scraped and stored in Azure Blob Storage, and then
the container exits.

So far, this is working well. When I update this website, within a minute or
two I can see the most recently scraped version land in Azure Blob Storage.
Whilst I plan to hang on to all of these 'scrapes', what I don't need to hang
onto in the long term is outdated container images for the website archiver
itself. I could manually drop into the Azure Container Registry every once
in a while and remove any that aren't needed - it's not as if I'm frequently
uploading updated images - but this seems like something that should be easy
enough to automate.

## Removing images from Azure Container Registry using PowerShell

Rather than head straight for an Azure Function, we'll test the theory in our
local [Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/)
first. I want to:

* List the available images in an Azure Container Registry repository, ordered
by when they were last updated.
* If there are more than five images available, then I want to remove all
_except_ the most recently updated five images.

We'll use two cmdlets, one for each action above;
[`Get-AzContainerRegistryTag`](https://docs.microsoft.com/en-us/powershell/module/az.containerregistry/get-azcontainerregistrytag) and
[`Remove-AzContainerRegistryTag`](https://docs.microsoft.com/en-us/powershell/module/az.containerregistry/remove-azcontainerregistrytag).

First, we retrieve _all_ available tagged images in an Azure Container Registry
repository.

```powershell
$Tags = (Get-AzContainerRegistryTag -RepositoryName "RepoName" `
-RegistryName "RegName").Tags | Sort-Object LastUpdateTime | Select-Object Name
```

Now, if `$Tags` contains more than five tagged images, we want to remove all
but the five most recent.

```powershell
if ($Tags.Length -gt 5)
{

  Foreach ($Tag in $Tags[0..($Tags.Length - 5)])
  {
    Remove-AzContainerRegistryTag -RepositoryName "RepoName" `
    -RegistryName "RegName" -Name $Tag.Name
  }

}
```

That's the extent of the PowerShell we'll write here, other than a bit of
logging output for our Azure Function.

## Running an Azure Function on a timer

After creating an Azure Function App (using the PowerShell Core runtime stack),
we've got an extra step before we add our code or configure our timer. We'll
need to make the `Az.ContainerRegistry` PowerShell module available to our
Function. This can be done by heading to 'App files', and adding the following
line to `requirements.psd1`:

```powershell
'Az.ContainerRegistry' = '3.0.0'
```

Configuring the timer is done when creating the Azure Function itself; select
'Timer trigger' from the available templates. Give it a name, and enter a
cron expression to specify the schedule that the Azure Function will run on.
I've gone with `0 30 23 * * Sat`, which equates to 23:30 every Saturday. The
cron format in Azure is `{second} {minute} {hour} {day} {month} {day of week}`.

Azure will pre-populate our Azure Function with some boilerplate, which we'll
leave for now, inserting our full code in the middle:

```powershell
# Input bindings are passed in via param block.
param($Timer)

# Get the current universal time in the default string format.
$currentUTCtime = (Get-Date).ToUniversalTime()

# The 'IsPastDue' property is 'true' when the current function invocation is
# later than scheduled.
if ($Timer.IsPastDue) {
    Write-Host "PowerShell timer is running late!"
}

Write-Host "Retrieving Azure Container Registry Repository Tags in "`
"descending order of LastUpdatedTime"

$Tags = (Get-AzContainerRegistryTag -RepositoryName "RepoName" `
-RegistryName "RegName").Tags | Sort-Object LastUpdateTime | `
Select-Object Name

Write-Host "Finished retrieving $($Tags.Length) Azure Container Registry " `
"Repository Tags in descending order of LastUpdatedTime"

if ($Tags.Length -gt 5)
{

    Write-Host "More than 5 tags found for Azure Container Registry Repository"

    Foreach ($Tag in $Tags[0..($Tags.Length - 5)])
    {
        Write-Host "Removing Tag $($Tag.Name)"
        Remove-AzContainerRegistryTag -RepositoryName "RepoName" `
        -RegistryName "RegName" -Name $Tag.Name
    }

}

# Write an information log with the current time.
Write-Host "PowerShell timer trigger function ran! TIME: $currentUTCtime"

```

This is now happily running in my Azure account, limiting the amount of storage
that I'm using in this particular Azure Container Registry.
