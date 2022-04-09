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
## Statements

### Key syntax

## Ownerships


## Restrictions