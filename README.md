# IronRouterSecurity

Authentication and authorization for Iron.Router Meteor plugin.

#####Dependencies
    iron:router@1.0.0 or above
    alanning:roles@1.2.0 or above

#####Usage

On client:
```js
var securityConfig = {
    loginTemplate: "login",
    notAuthorizedTemplate: "notAuthorized",
    authenticate: true
}
Router.plugin("security", securityConfig);
```

On route:
