var Wreck = require('wreck');

exports.register = function (server, options, next) {

    // This is where the magic happens!

    server.select('service').ext('onPreHandler', function (request, reply) {

        var sessionId = request.state.session;

        var _done = function () {

            // Set the cookie and proceed to the route

            request.headers['X-Session-Id'] = sessionId;
            reply.state('session', sessionId);
            reply.continue();
        }

        if (typeof sessionId !== 'undefined')
            return _done();

        // We don't have a sessionId, let's get one

        Wreck.get('http://localhost:5000/sessionId', {json: true}, function (err, res, payload) {

            if(err) {
                throw err;
            }

            sessionId = payload.id;

            _done();
        });
    });

    server.select('service').route({
        method: '*',
        path: '/{p*}',  // Proxies all routes and methods
        handler: {
            proxy: {
                host: 'localhost',
                port: 5000,
                protocol: 'http',
                passThrough: true
            }
        }
    });

    next();
};

exports.register.attributes = {
    name: 'your-service'    
};