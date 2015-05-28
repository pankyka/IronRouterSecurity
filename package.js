Package.describe({
    name: "pankyka:iron-router-security",
    version: "0.0.1",
    summary: "",
    git: "",
    documentation: "README.md"
});

Package.onUse(function (api) {
    api.versionsFrom("1.1.0.2");
    api.use("templating");
    api.use("underscore", "server");
    api.use("iron:router@1.0.0");
    api.use("alanning:roles@1.2.0");
    api.addFiles([
        "lib/ironRouterSecurity.js",
        "lib/client/ironRouterSecurityUIHelpers.js"
    ], "client");
});

Package.onTest(function (api) {
    api.use("tinytest");
    api.use("pankyka:iron-router-security");
    api.addFiles("iron-router-security-tests.js");
});
