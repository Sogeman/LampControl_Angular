# LampControl
Third Semester Project, Hue Lamp Control

Mandler Rene

Web Application to control Philips Hue lights

You can:

- create new user on Hue Bridge or recall user by nickname
- see and control all lights (color, brightness)
- add new lights and remove lights
- see and controll all groups (color, brightness)
- add new group and remove group
- add lights to groups and remove lights from groups
- choose a scene for a group, create own scenes and delete those scenes

Technologies used: Java EE backend with Wildfly 12 deployment server, MySQL database, Angular frontend, Hue API.
Backend is used for own scene API instead of using HUE Scene API, also saving users

TODO: return to sign in if there's no user for some reason

TODO maybe: make back button into component, set lightstate in group independently, change scene, expand app to include departure times for bus in front of my appartment
