---
categories:
  - PowerShell
date: 2023-05-01T11:15:00+01:00
draft: false
lastMod: 2023-05-01T11:15:00+01:00
tags:
  - PowerShell
title: Use PowerShell to monitor system performance
---

In this post, I'll show you how to monitor system performance using PowerShell.
I'll introduce you to a few different cmdlets and some examples of how you
might use them to monitor the performance of a system.

## `Get-Process`

This cmdlet provides information about all of the running processes on a
system, including their process ID, their CPU usages, and their memory usage.

You might use this cmdlet to:

- Get the five processes using the most CPU:
`Get-Process | Sort-Object -Property CPU | Select-Object Name,CPU -Last 5`.
- Get the five processes using the most memory:
`Get-Process | Sort-Object -Property WorkingSet | Select-Object Name,WorkingSet -Last 5`
- Get the total CPU time of a specific process:
`(Get-Process -Name msedge).TotalProcessorTime`

## `Get-Counter`

This cmdlet provides information about system performance counters, such as
CPU, memory, and disk usage.

You might use this cmdlet to:

- Check free space on a drive:
`(Get-Counter '\LogicalDisk(C:)\% Free Megabytes').CounterSamples.CookedValue/1024`
- Check the amount of available memory: `Get-Counter '\Memory\Available MBytes'`
- Check network traffic: `Get-Counter '\Network Interface(*)\Bytes Total/sec'`

## `Get-WmiObject`

This cmdlet provides access to the Windows Management Instrumentation (WMI)
database, which contains information about system resources.

You might use this cmdlet to:

- Check system uptime:
`Get-WmiObject -Class Win32_OperatingSystem | Select-Object -Property LastBootUpTime | ForEach-Object {[System.Management.ManagementDateTimeConverter]::ToDateTime($_.LastBootUpTime)} | Select-Object -ExpandProperty DateTime`
- Check system battery status:
`Get-WmiObject -Class Win32_Battery | Select-Object -Property BatteryStatus,EstimatedChargeRemaining`
- Check system fan speeds:
`Get-WmiObject -Namespace "root\cimv2" -Class "Win32_Fan" | Select-Object -Property DeviceID, CurrentSpeed`

## Further reading

Further information on the `Get-Process` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-process).

Further information on the `Get-Counter` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.diagnostics/get-counter).

Further information on the `Get-WmiObject` cmdlet can be found on
[Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-wmiobject).
