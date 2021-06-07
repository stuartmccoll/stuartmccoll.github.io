---
title: "Automate the shutdown of a Windows 10 PC"
date: 2020-10-14T10:00:00+01:00
draft: false
images:
- img/microsoft-windows-logo.png
tags: ["microsoft", "windows", "windows 10", "automation", "PowerShell"]
---

## Using the `shutdown` command

Setting a single, non-repeatable shutdown timer can be done using the `shutdown` command, which can be run in the Command Prompt or PowerShell. Let's use PowerShell as an example.

1. Search for '*PowerShell*' in the start menu and open the app that is returned.
2. Run the command `shutdown -s -t TimeInSeconds` where `TimeInSeconds` is replaced with the number of seconds after which you want the Windows 10 PC to shutdown. For example, if you want it to shutdown after 30 minutes, then replace `TimeInSeconds` with `1800`. The `-s` flag is simply telling the command to shutdown, as opposed to logging out, or restarting, etc.

That's it - you've scheduled a one-time shutdown of your Windows 10 PC.

If you'd like to cancel your scheduled one-time shutdown, you can run the `shutdown` command again, this time only passing the `-a` flag: `shutdown -a`.

What about if you want to automate your shutdown schedule? That's where the Windows Task Scheduler comes in.

## Using Task Scheduler

1. Search for '*Task Scheduler*' in the start menu and open the app that is returned.
2. Once opened, select the '*Create basic task*' option. This will open a '*Basic Task Creation Wizard*'.
3. Within the wizard, enter a name for this task. The description field is optional. Let's call ours '**Shutdown**', then click the '*Next*' button.
4. The wizard will present you with a list of radio button options for how often you want your task to run. You can choose options such as daily or weekly, as well as other more specific options such as '*one time*' or '*when the computer starts*'. Choose the option appropriate to your use case, here we'll go with '*one time*'.
5. The wizard will present you with the option of specifying a date and time for the task to run. Again, choose the option appropriate to your use case.
6. Finally, the wizard will present you with the option of a program or script to run, as well as aguments to pass when running. As we're creating a task to shutdown our Windows 10 PC, enter `shutdown.exe` in the *'Program/script*' field, and then enter `/s` in the '*Add arguments (optional)*' field. Click the '*Next*' button.
7. The wizard will present you with an overview of your task. Confirm that everything is okay by clicking the '*Finish*' button.

That's all there is to it. If necessary you can test your created task by finding it in the Task Scheduler, right clicking it and then selecting '*Run*' from the menu that appears. Likewise, to disable your task, right click it and select '*Disable*' from the menu that appears.
