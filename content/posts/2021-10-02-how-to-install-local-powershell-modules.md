---
title: "How to lnstall local Powershell Modules"
date: 2021-10-02T14:16:33+01:00
draft: false
---

I keep some custom PowerShell modules stored locally on different machines,
depending on the type of machine. For example, my work laptop has modules
for setup and teardown of my development environment, which are modules that
I don't keep around on my personal desktop machine.

Rather than have all of this live in a PowerShell profile which I _do_ share
between different machines, I keep a tiny bit of code in my shared profile
which will import any custom modules found locally.

For this, I create a `LocalModules` directory which sits alongside `Modules`
and `Scripts` inside my `PowerShell` directory. As the name suggests, this
is where I keep those custom modules.

Then, within my shared PowerShell profile, I do the following:

* Check for the presence of the `LocalModules` directory.
* If found, get each module file within this directory.
* For each module file found, run the `Import-Module` cmdlet.

It's very basic, but this section of my profile looks like this:

```PowerShell
if (Test-Path ~\OneDrive\Documents\PowerShell\LocalModules)
{

  $localModules = Get-Item ~\OneDrive\Documents\PowerShell\LocalModules\*

  ForEach ($m in $localModules)
  {
    Import-Module $m.FullName
  }

}
```

For something more robust, you might specifically look for files with a
`pmsl` extension, to ensure you don't accidentally try to run the
`Import-Module` cmdlet against something that isn't a PowerShell module.
