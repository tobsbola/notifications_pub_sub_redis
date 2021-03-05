Notification Service
==============

> **Note:** You need to have Docker installed.


This service consists two part viz: 
- publish  
- subscribe 

### Endpoints

```console
[POST] /subscribe/{topic}
```

```console
[POST] /publish/{topic}
```

Quick Start
-----------
### Run:

To start both publisher and subscriber
```
sh start-server.sh
```

### Stop

```
sh stop-server.sh
```
