# IronRouterSecurity

Authentication and authorization for Iron.Router Meteor plugin.

#####Dependencies
    iron:router@1.0.0 or above
    alanning:roles@1.2.0 or above

#####Configuration
```js
var securityConfig = {
    loginTemplate: "login",
    notAuthorizedTemplate: "notAuthorized",
    //authenticate: true
    authenticate: {
        except: ["faq", "about", "contact"]
    }
}
Router.plugin("security", securityConfig);
```
|Property | Description|
|---------|------------|
|`loginTemplate` | *String* Name of the login screen template|
|`notAuthorizedTemplate` | *String* Name of the 'not authorized' template|
|`authenticate` | *Boolean, Object* If not exist, authentication not required only if `authorization` is defined on the route|
|`authenticate.except` | *[String]* An Array of route names, which doesn't need authentication|


#####Authorize route

Routes now can have a property named `authorization`, with this we can define which permissions is needed to access the route. 
This property can be a *Function* (custom logic for authorization) or an *Object*.
 
 ```js
Router.route("/accounts/edit/:_id?", {
    name: "accounts.edit",
    template: "editAccount",
    authorize: {
        allow: ["admin", "manager"],
        deny: ["client"]
    }   
});
```

Not necessary to define each property (`allow`, `deny`).

#####UI Helpers



