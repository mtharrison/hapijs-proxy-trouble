
exports.register = function (server, options, next) {

    server.select('upstream').route([{
        method: '*',
        path: '/{p*}',
        handler: function (request, reply) {

            // Just prints out what it received for headers and payload
            // To prove we got send the original payload and the sessionID header

            reply({
                originalHeaders: request.headers,
                originalPayload: request.payload,
            })
        }
    }, {
        method: 'GET',
        path: '/sessionId',
        handler: function (request, reply) {

            // Returns a random session id

            reply({ id: (Math.floor(Math.random() * 1000)) });
        }
    }]);

    next();    
};

exports.register.attributes = {
    name: 'upstream'    
};