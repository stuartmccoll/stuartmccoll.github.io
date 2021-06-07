---
title: "AppleScript for Configuring External Displays"
date: 2020-04-27T20:00:00Z
tags: ["applescript", "display", "external", "resolution", "macos"]
draft: false
---

AppleScript is a scripting language bundled within all versions of macOS, which allows for scripting of elements of the operating system and compatible applications.

I'd never touched it before, but decided to try to use it to automate setting the resolutions of my external displays when switching between my personal and work MacBook Pros.
Sometimes the resolutions stick when switching between the two, sometimes they don't. Rather than have to go into `System Preferences > Displays` and set them whenever the 
settings don't stick, I quite liked the idea of just running a script and having something else take care of it for me. That's where AppleScript comes in.

There are different ways of running AppleScripts - I'm not going to cover that here. Options include running from the command line, running as a bundled application, running 
from [Alfred](https://www.alfredapp.com), etc.

I managed to cobble together a sloppy script to automate setting the resolution of my displays, which I'll detail below. Prior warning - I haven't done any cleanup; there's 
plenty that could be refactored - for example, it could be one function which you pass parameters to and call for each display you want to set. Go with it for now.

```applescript
tell application "System Preferences"
	reveal anchor "displaysDisplayTab" of pane id "com.apple.preference.displays"
end tell
```

This opens `System Preferences > Displays` and then ensures that the `Display` tab is open.

![System Preferences > Displays](/img/20200427-display.png)

```applescript
tell application "System Events" to tell process "System Preferences" to tell window "Built-in Retina Display"
	set is_scaled to value of radio button "Scaled" of tab group 1
	if is_scaled = 0 then
		click radio button "Scaled" of tab group 1
		click radio button 5 of radio group 1 of group 1 of tab group 1
	else
		set scale_value to value of radio group 1 of group 1 of tab group 1
		if scale_value is not equal to 5 then
			click radio button 5 of radio group 1 of group 1 of tab group 1
		end if
	end if
end tell
```

This is the bulk of the script, which I essentially duplicate this for both external displays. Let's break down what's happening here.

```applescript
tell application "System Events" to tell process "System Preferences" to tell window "Built-in Retina Display"
...
end tell
```

This `tell` block ensures that I'm targeting the "Built-in Retina Display" window. I also have two separate `tell` blocks for my external displays, where instead of using 
`tell window "Built-in Retina Display"`, I use `tell window "U28E590 (1)"` and `tell window "U28E590 (2)"`. This is what I meant about my lack of refactoring; you could easily 
make this a function and pass the display name as an argument.

```applescript
set is_scaled to value of radio button "Scaled" of tab group 1
```

This sets the value of the "Scaled" radio button to a variable, which we can then check.

```applescript
if is_scaled = 0 then
		click radio button "Scaled" of tab group 1
		click radio button 5 of radio group 1 of group 1 of tab group 1
	else
		...
	end if
```

If the "Scaled" radio button has a value of `0`, then that means that it hasn't been clicked. We click the "Scaled" radio button and then select the appropriate resolution 
size from within the "Scaled" submenu. In this code example, `radio button 5` is the "More Space" setting.

```applescript
if is_scaled = 0 then
		...
	else
		set scale_value to value of radio group 1 of group 1 of tab group 1
		if scale_value is not equal to 5 then
			click radio button 5 of radio group 1 of group 1 of tab group 1
		end if
	end if
```

In the `else` block, "Scaled" was already selected. In this case, we want to make sure that the appropriate resolution size from within the "Scaled" submenu is selected. Here, 
we set the currently selected resolution size to the `scale_value` variable. We then check whether it's equal to the value we want (in this case `5`). If it isn't, then we set it. If it's already set to `5`, then we don't need to click it again.

```applescript
quit application "System Preferences"
```

This line is self-explanatory.

And that's it.