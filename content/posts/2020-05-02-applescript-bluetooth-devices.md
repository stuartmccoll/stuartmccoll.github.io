---
title: "AppleScript for Connecting Bluetooth Devices"
date: 2020-05-02T10:50:44+01:00
draft: false
---

Last week I wrote another AppleScript for automating a manual task I have to carry out each time I switch between my personal MacBook Pro and my work device. This time, I needed 
to write a script which would connect to my Bluetooth devices - a Magic Mouse, Magic Keyboard and my AirPods.

Rather than accessing the System Preferences application, which I demonstrated in [my last AppleScript](/posts/2020-04-27-applescript-external-displays), this script needed to directly access the Bluetooth icon in the 
menu bar. If you're repurposing anything within this script, you'll need to make sure that you have the Bluetooth icon within your own menu bar.

{{< highlight applescript >}}
-- Subroutine to connect to Bluetooth devices
-- @param bluetooth_devices : List(String) - the device names
on connect_bluetooth_devices(bluetooth_devices)
    ...
end connect_bluetooth_devices
{{< / highlight >}}



I've written a [handler](https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_about_handlers.html#//apple_ref/doc/uid/TP40000983-CH206-SW3) (think 'function'), which takes an array of Bluetooth device names. The idea here is that we'll pass all of the Bluetooth devices which we want 
to connect to into the handler, loop through them and for each one connect to it using the Bluetooth icon in the menu bar.

{{< highlight applescript >}}
activate application "SystemUIServer"
{{< / highlight >}}

SystemUIServer is responsible for the system tray side of the menu bar - things like Bluetooth, Networking, Clock, etc.

{{< highlight applescript >}}
tell application "System Events" to tell process "SystemUIServer"
    ...
end tell
{{< / highlight >}}

This is us enabling ourselves to be able to access items within the menu bar.

{{< highlight applescript >}}
set bluetooth_menu_bar_item to (menu bar item 1 of menu bar 1 whose description contains "bluetooth")
tell bluetooth_menu_bar_item
    ...
end tell
{{< / highlight >}}

Here, we're getting the Bluetooth menu bar item and setting it to a variable.

{{< highlight applescript >}}
repeat with bluetooth_device in bluetooth_devices

end repeat
{{< / highlight >}}

This is the loop I mentioned earlier - we're looping through each item in the array, and assigning the item to the `bluetooth_device` variable.

{{< highlight applescript >}}
click
if exists menu item bluetooth_device of menu 1 then
    tell (menu item bluetooth_device of menu 1)
        click
        if exists menu item "Connect" of menu 1 then
            click menu item "Connect" of menu 1
        else
            -- Exit Bluetooth menu bar item
            key code 53
        end if
    end tell
end if
{{< / highlight >}}

This is really the bulk of the script. We `click` the Bluetooth menu bar icon. We then check whether our `bluetooth_device` is present in the list that is displayed. If it is, 
then we click the device name. If the submenu that opens contains a `Connect` option, then we click it. Otherwise, we use `key code 53` (Escape), to exit the menu.

After exiting our loop we hit `key code 53` one last time to ensure that we've closed the Bluetooth menu.

We can call our handler like so:

{{< highlight applescript >}}
connect_bluetooth_devices({"Stuart’s AirPods", "Stuart’s Keyboard", "Stuart’s Mouse"})
{{< / highlight >}}

The important thing to note here is the difference between the `’` character used in the device name string and the `'` character on your keyboard. 

Here's the script in full:

{{< highlight applescript >}}
-- Connect to Bluetooth devices
connect_bluetooth_devices({"Stuart’s AirPods", "Stuart’s Keyboard", "Stuart’s Mouse"})

-- Handler to connect to Bluetooth devices
-- @param bluetooth_devices : List(String) - the device names
on connect_bluetooth_devices(bluetooth_devices)
	activate application "SystemUIServer"
	tell application "System Events" to tell process "SystemUIServer"
		set bluetooth_menu_bar_item to (menu bar item 1 of menu bar 1 whose description contains "bluetooth")
		tell bluetooth_menu_bar_item
			repeat with bluetooth_device in bluetooth_devices
				click
				if exists menu item bluetooth_device of menu 1 then
					tell (menu item bluetooth_device of menu 1)
						click
						if exists menu item "Connect" of menu 1 then
							click menu item "Connect" of menu 1
						else
							-- Exit Bluetooth menu bar item
							key code 53
						end if
					end tell
				end if
			end repeat
			-- Exit Bluetooth menu bar item
			key code 53
		end tell
	end tell
end connect_bluetooth_devices
{{< / highlight >}}