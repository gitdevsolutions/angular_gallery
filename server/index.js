const server = require('./server.js');
const path = require('path');
const low = require('lowdb');

let serverSetup = {
  httpPort: 3000,
  httpsPort: 3443,
  keyFile: '../https/impaqgroup_key.key',
  certFile: '../https/554b809416b1591e.crt',
  caFile: '../https/gd_bundle-g2-g1.crt'
};
let appOptions = {
  distDir: path.join(__dirname, '..', 'dist'),
  adminPath: "/LQVe5yY6ktI3GQybfSlLfg/",
  surveysDb:  low(path.join(__dirname, '..', 'db', 'surveys.json')),
  usersDb:  low(path.join(__dirname, '..', 'db', 'users.json')),
  systemDb:  low(path.join(__dirname, '..', 'db', 'system.json')),
}
const app = require('./app.js')(appOptions);
server(serverSetup, app);
