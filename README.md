mockapi
=======

# Installation

```sh
$ git clone https://github.com/swallentin/mockapi
$ cd mockapi
$ npm install
$ npm start
$ open http://localhost:5001

# How to use with admincms

Set your environment to local by issuing this shell command

```sh
$ export NODE_ENV
```

Add a config.local.json and add this content to it,

```json
{
	"apiBaseUrl": "https://api.local.like.tv",
	"adminApiBaseUrl": "http://adminapi.local.like.tv:5001",
	"imageBaseUrl": "http://api.stage.like.tv/images/se"
}
```
Add the following hosts to your /etc/hosts file

127.0.0.1		local.like.tv
127.0.0.1       admin.local.like.tv
127.0.0.1		api.local.like.tv
127.0.0.1		adminapi.local.like.tv
127.0.0.1    	admin.local.like.tv

# Routes

GET - /authentication/me - Returns 'authentication.json' User Context Object, will only output if login state is set to logged in.
GET - /authentication/login - Changes login state to logged in.
GET - /authentication/logout  - Change login state to logged out.
GET - /schedule/se - Returns 'schedule.json' 
GET - /broadcast/se/:broadcastId -  Returns 'broadcast.json'
POST - /broadcast/se/:broadcastId
GET - /channel/se/:channelId - Returns 'channel.json'
