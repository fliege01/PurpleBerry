# Introduction

# Installation

```shell
npm install --save @fliege01/purpleberry
yarn install @fliege01/purpleberry
```

# Examples

```typescript
import PermissionManager from '@fliege01/purpleberry';

const myRoleSchema = {
    $version: 1,
    statements: [
        {
            "action": "some.action",
            "resource": "*"
        },
        {
            "action": "another.action:any",
            "resource": "a.special.resource"
        }
    ]
}

const PM = new PermissionManager();
PM.addRoleSchema('myRole', myRoleSchema);

const roleCtx = PM.createRoleContext('myRole');

roleCtx.can('some.action', 'some.resource', true); // returns true
roleCtx.can('some.action', 'some.resource', false); // returns false since is not owner

roleCtx.can('another.action', 'another.resource', false); // returns false
roleCtx.can('another.action', 'a.special.resource', false); // returns true 

```
## Policies
PurpleBerry uses role and permission policies to manage single statements of the application. 
A role can reference to other roles and permission policies. Permission policies can only reference to other permission policies.

### Simple dependency schema
```text
   Permission
    /    \
Role   Permission
    \  /
   Role  --  Permission
```
## Ownerships

Each action can points to ressources which are owned or not. If no further informations provided, PurpleBerry will work as the action only matches to owned ressources.

If you want the action to also apply to not owned ressources you need to add a `:any` at the end of te action definition. `posts.*:any` or `user.updatePassword:any`

The ownerships are not handled by PurpleBerry. To determine if the ressource is owned you need to pass the boolean parameter to the `.can(string, string[, boolean])` function
## Statements
A statement is a combination of one or multiple actions AND one or multiple resources. The permission is granted if both elements hits inside one single statement. Role and permission policies can store multiple statements.

```json
{
    "action": [
        "updateProfile"
    ],
    "resource": [
        "profile.*"
    ]
}
```