(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('../../js/stardog.js'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['stardog', 'async'], factory);
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root.Stardog, async);
    }
}(this, function (Stardog, Async) {
	var self = this;

	describe ("Assign Permissions to Users Test Suite", function() {
		var conn;

		if (typeof Async !== 'undefined') {
			self = new Async(this);
		}

		beforeEach(function() {
			conn = new Stardog.Connection();
			conn.setEndpoint("http://localhost:5820/");
			conn.setCredentials("admin", "admin");
		});

		afterEach(function() {
			conn = null;
		});

		self.it ("should fail trying to assign a permssion to a non-existent user.", function (done) {

			var aNewPermission = {
				'action' : 'write',
				'resource_type' : 'db',
				'resource' : 'nodeDB'
			};

			conn.assignPermissionToUser({ user: 'myuser', permissionObj: aNewPermission }, function (data, response) {
				expect(response.statusCode).toBe(404);
				done();
			});
		});

		self.it ("should pass assinging a Permissions to a new user.", function (done) {

			var aNewUser = aNewUserPwd = 'newpermuser';
			var aNewPermission = {
				'action' : 'write',
				'resource_type' : 'db',
				'resource' : 'nodeDB'
			};

			conn.deleteUser({ user: aNewUser }, function (data, res) {
				// delete user if exists

				conn.createUser({ username: aNewUser, password: aNewUserPwd, superuser: true }, function (data, response1) {
					expect(response1.statusCode).toBe(201);

					conn.assignPermissionToUser({ user: aNewUser, permissionObj: aNewPermission }, function (data, response2) {

						expect(response2.statusCode).toBe(201);

						// delete role
						conn.deleteUser({ user: aNewUser }, function (data, response3) {
							expect(response3.statusCode).toBe(200);
							done();
						});
					});
				});
			});
		});
	});

    // Just return a value to define the module export.
    return {};
}));
