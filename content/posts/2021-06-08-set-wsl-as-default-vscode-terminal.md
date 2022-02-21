---
title: "Set WSL as the default integrated terminal in Visual Studio Code"
date: 2021-06-08T10:00:13+01:00
draft: false
tags: [
  "microsoft", "windows", "windows 10", "automation", "PowerShell", "linux",
  "wsl"
]
---

If you're using [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about)
(WSL) in tandem with Visual Studio Code, you might be wondering how to change
your default integrated terminal from PowerShell to WSL.

Previously, you could set this in a single line in your `settings.json` file
using `terminal.integrated.shell.windows`, but this has since been deprecated
in a later version of Visual Studio Code.

Add the following snippet of JSON to your `settings.json` file in Visual Studio
Code (you can access this file by clicking the gear icon in the bottom left
hand corner of the screen, selecting the 'Settings' menu option, and then
clicking on the 'Open settings (JSON)' icon in the top right hand corner
of the subsequent screen - alternatively you can open the Command Palette
with CTRL + Shift + P and then type in 'Open settings (JSON)'):

```json
{
  "terminal.integrated.defaultProfile.windows": "WSL",
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell"
    },
    "Command Prompt": {
      "path": [
        "${env:windir}\\Sysnative\\cmd.exe",
        "${env:windir}\\System32\\cmd.exe"
      ],
      "args": [],
      "icon": "terminal-cmd"
    },
    "Git Bash": {
      "source": "Git Bash"
    },
    "WSL": {
      "path": [
        "C:\\WINDOWS\\System32\\wsl.exe"
      ],
      "args": [],
      "icon": "terminal-ubuntu-wsl"
    }
  }
}
```

Close any integrated terminals you had open in Visual Studio Code, and then
open a new integrated terminal - WSL should now open by default, rather than
PowerShell.
