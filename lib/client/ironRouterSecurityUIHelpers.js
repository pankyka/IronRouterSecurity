var securityHelper = {
    context: function() {
        return Router.current();
    },

    regex: function(expression) {
        return new RegExp(expression, "i");
    },

    testRoutes: function(routeNames) {
        var reg = this.regex(routeNames);
        return this.context() && this.context().route && reg.test(this.context().route.getName());
    }
};

Template.registerHelper("isActiveRoute", function(route, className) {
    if(securityHelper.context()){
        className = (className.hash) ? "active" : className;
        return securityHelper.testRoutes(route) ? className : "";
    }
});

Router.prototype.isActiveRoute = function (route) {
    if(securityHelper.context()){
        return securityHelper.testRoutes(route)
    }
};