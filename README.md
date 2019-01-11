# LampControl
Third Semester Project, Hue Lamp Control

Mandler Rene

Web Application to control Philips Hue lights

User should be able to:

- <s>connect to Hue Bridge</s>
- <s>see all owned lights</s>
- <s>change light state</s>, <s>name</s>
- <s>add new lights</s>
- <s>show all groups</s>
- delete <s>light</s>, group, scene
- change <s>group state</s>, <s>name</s>
- add lights to groups
- switch to add light to groups mode if group doesn't have lights
- add new groups
- remove lights from groups
- control <s>light</s> <s>color</s> and <s>brightness</s> of group or <s>individual lights</s>
- create new scene or choose standard scene

Technologies used: Java EE backend with Wildfly 12 deployment server, MySQL database, Angular frontend, Hue API.
Backend currently unused. I initially thought about saving scenes and rooms there but I'm not so sure anymore that even works. If I use it at all, it will be for saving user data.