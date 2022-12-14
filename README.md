
## Description

- Add and Deploy features.


## Installation

```bash
$ npm install
```

## Running the app

- Add a file .env to the root folder with the following content
  - SERVICE_ACCOUNT_JSON=/path/to/ServiceAccount.json
  - DB_URL=https://zeotap-qa-microsvcs-default-rtdb.firebaseio.com
  - JFROG_API_KEY=abcde

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Routes

```json
  {
    "routes": [
        {
            "route": {
                "path": "/unity-config/jfrog/:env",
                "method": "get"
            }
        },
        {
            "route": {
                "path": "/unity-config/feature",
                "method": "post",
                "params": {
                    "featureKey": "string",
                    "description": "string"
                }
            }
        },
        {
            "route": {
                "path": "/unity-config/feature",
                "method": "get"
            }
        },
        {
            "route": {
                "path": "/unity-config/feature/:id",
                "method": "get"
            }
        },
        {
            "route": {
                "path": "/unity-config/feature/:id",
                "method": "patch",
                "params": {
                    "description": "string"
                }
            }
        },
        {
            "route": {
                "path": "/unity-config/feature/:id",
                "method": "delete"
            }
        },
        {
            "route": {
                "path": "/unity-config/deployment",
                "method": "post",
                "params": {
                    "features": {
                        "key": {
                            "enabled": "boolean",
                            "config": "object"
                        },
                        "env": "string"
                    }
                }
            }
        },
        {
            "route": {
                "path": "/unity-config/deployment",
                "method": "get"
            }
        },
        {
            "route": {
                "path": "/unity-config/deployment/:id",
                "method": "get"
            }
        },
        {
            "route": {
                "path": "/unity-config/deployment/:id",
                "method": "delete"
            }
        }
    ]
}
```
