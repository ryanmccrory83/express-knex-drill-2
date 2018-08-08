const express =  require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const morgan = require('morgan');
const queries = require('./queries.js');

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (request, response, next) => {
    queries.list().then(coffee => {
        response.json({coffee});
    }).catch(next);
});

app.get('/:id', (request, response, next) => {
    queries.read(request.params.id).then(coffee => {
        coffee
            ? response.json({coffee})
            : response.status(404).json({message: 'Not found'})
    }).catch(next);
});

app.post('/', (request, response, next) => {
    queries.create(request.body).then(coffee => {
        response.status(201).json({coffee: coffee});
    }).catch(next);
});

app.delete('/:id', (request, response, next) => {
    queries.delete(request.params.id, request.body).then(coffee => {
        response.json({coffee: coffee[0]});
    }).catch(next);
});

app.put('/:id', (request, response, next) => {
    queries.update(request.params.id, request.body).then(coffee => {
        response.json({coffee: coffee[0]});
    }).catch(next);
});

app.use((err, request, response, next) => {
    const err = new Error('Not Found');
    error.status = 404;
    next(err);
});

app.use((err, request, response, next) => {
    response.status(err.status || 500);
    response.json({
        message: err.message,
        error: request.app.get('env') === 'development' ? error. stack : {}
    });
});

app.listen(port)
    .on('error', console.error.bind(console))
    .on('listening', console.log.bind(console, 'Listening on ' + port));