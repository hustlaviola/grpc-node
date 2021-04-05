const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo('localhost:4040', grpc.credentials.createInsecure());
const text = process.argv[2]
client.createTodo({ id: -1, text }, (err, res) => {
    console.log(JSON.stringify(res));
});

client.readTodos({}, (err, res) => {
    console.log(res);
});

const call = client.readTodosStream();
call.on('data', item => console.log(item));
call.on('end', e => console.log('Done', e));

