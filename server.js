const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind('0.0.0.0:4040', grpc.ServerCredentials.createInsecure());
server.addService(todoPackage.Todo.service, {
    createTodo,
    readTodos,
    readTodosStream
});

server.start();
const todos = [];
function createTodo(call, callback) {
    console.log(call.request);
    const todoItem = {
        id: todos.length + 1,
        text: call.request.text
    }
    todos.push(todoItem);
    callback(null, todoItem);
}

function readTodosStream(call, callback) {
    todos.forEach(t => call.write(t));
    call.end();
}

function readTodos(call, callback) {
    callback(null, { items: todos });
}
