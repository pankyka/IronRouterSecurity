var ROLESPUBLISH_NAME = "IronRouterSecurity:roles";

if (Meteor.isServer) {
    Meteor.publish(ROLESPUBLISH_NAME, function () {
        return Meteor.roles.find();
    });
}

IronRouterSecurity = {
    pluginOps: {},
    routeOps: {},
    init: function (routeOps, pluginOps) {
        var self = this;
        self.pluginOps = pluginOps || self.pluginOps;
        self.routeOps = routeOps || self.routeOps;
    },
    guard: function (context) {
        var self = this;

        if (_.isFunction(self.routeOps.authorize)) {
            self.routeOps.authorize();
        } else if (self.routeOps.authorize) {
            var roles = Meteor.roles.find().map(function (r) { return r.name; });

            allowedRoles = self.routeOps.authorize.allow || _.difference(roles, self.routeOps.authorize.deny);
            deniedRoles = self.routeOps.authorize.deny || _.difference(roles, allowedRoles);

            if (allowedRoles && !_.isArray(allowedRoles))
                throw new Meteor.Error("Array is excepted for allowed roles.");
            if (deniedRoles && !_.isArray(deniedRoles))
                throw new Meteor.Error("Array is excepted for denied roles.");

            self.guardByRouteOption(allowedRoles, deniedRoles, context);
        }
    },
    guardByRouteOption: function (allowedRoles, deniedRoles, context) {
        var self = this;
        var userId = Meteor.userId();
        var allow = Roles.userIsInRole(userId, allowedRoles);
        var deny = Roles.userIsInRole(userId, deniedRoles);

        if (allow || !deny) {
            context.next();
        } else {
            self.renderTemplate(self.pluginOps.notAuthorizedTemplate, context);
            throw new Meteor.Error(403, "Access denied");
        }
    },
    renderTemplate: function (template, context) {
        context.renderRegions();
        if (template) context.render(template);
        else context.location.go("/");
    }
};

Iron.Router.plugins.security = function (router, pluginOps) {

    var ready = new Tracker.Dependency();

    router.onRun(function () {
        this.subscribe(ROLESPUBLISH_NAME).wait();
        this.next();
    }, pluginOps);

    router.onBeforeAction(function () {
            var routeOps = this.route.options;

            if (pluginOps.authenticate || routeOps.authenticate || routeOps.authorize) {
                if (pluginOps.authenticate.except && _.isArray(pluginOps.authenticate.except)) {
                    if (_.contains(pluginOps.authenticate.except, routeOps.getName())) {
                        this.next();
                    }
                } else {
                    if (!Meteor.user()) {
                        this.renderRegions();
                        if (Meteor.loggingIn()) {
                            ready.changed();
                        } else {
                            this.render(pluginOps.loginTemplate);
                            throw new Meteor.Error(401, "Unauthorized");
                        }
                    } else {
                        if (routeOps.authenticate || routeOps.authorize) {
                            ready.depend();
                            if (this.ready()) {
                                IronRouterSecurity.init(routeOps, pluginOps);
                                IronRouterSecurity.guard(this);
                                if (this.next) this.next();
                            } else {
                                _.delay(function () {
                                    ready.changed();
                                }, 0); //dispatch
                            }
                        } else {
                            this.next();
                        }
                    }
                }
            } else {
                this.next();
            }
        },
        pluginOps
    );
};