import DemoServer from './DemoServer';

// Start the server or run tests
if (process.argv[2] !== 'test') {
    let server: DemoServer = new DemoServer();
    server.start(3001);
} else {

}