var Hapi = require('hapi');

var server = new Hapi.Server();

server.connection({ port: 4000, labels: ['service'] }); // Your service
server.connection({ port: 5000, labels: ['upstream']}); // Pretend upstream API

server.state('session', {
    ttl: 24 * 60 * 60 * 1000,
    isSecure: false,
    path: '/',
    encoding: 'base64json'
});

server.register([{
    register: require('./service')
}, {
    register: require('./upstream')
}], 
function (err) {

    if (err) {
        throw err;
    }

    server.start(function () {

        console.log('Started!');
    });

});
