---
categories:
  - Automation
  - PowerShell
date: 2022-06-02T11:05:00+01:00
draft: false
lastMod: 2022-06-02T11:05:00+01:00
tags:
  - PowerShell
title: Use PowerShell to generate a GUID
---

Another quick automation using PowerShell, this time to solve the problem of
quickly adding a new GUID to the clipboard.

The `New-Guid` cmdlet will quickly create a random globally unique identifier,
with the below output.

```powershell
Guid
----
8c312165-113b-4c30-91e9-e4e6edebcf0b
```

This is great, but I've got a couple of extra needs; I don't need the `-`
characters, and I want the GUID to be added straight to my clipboard.

Ignoring the header is simple:

```powershell
(New-Guid).Guid
```

That'll result in just the below output.

```powershell
8c312165-113b-4c30-91e9-e4e6edebcf0b
```

Removing the `-` characters is simple as well.

```powershell
(New-Guid).Guid.Replace('-', '')
```

Which results in the below.

```powershell
8c312165113b4c3091e9e4e6edebcf0b
```

Finally, to add it to our clipboard, we can pipe our output to the
`Set-Clipboard` cmdlet.

```powershell
(New-Guid).Guid.Replace('-', '') | Set-Clipboard
```
