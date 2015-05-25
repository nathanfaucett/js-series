var keys = require("keys"),
    isArrayLike = require("is_array_like"),
    isFunction = require("is_function"),
    emptyFunction = require("empty_function"),
    fastSlice = require("fast_slice");


module.exports = series;


function series(tasks, callback) {
    return (
        isArrayLike(tasks) ?
        arraySeries(tasks, callback || emptyFunction) :
        objectSeries(Object(tasks), callback || emptyFunction)
    );
}

function arraySeries(tasks, callback) {
    var index = 0,
        length = tasks.length,
        results = new Array(length),
        called = false,
        task;

    function next(err) {
        var argsLength, task;

        if (called !== true) {
            if (err) {
                called = true;
                callback(err);
            } else {
                argsLength = arguments.length;
                if (argsLength > 1) {
                    results[index] = argsLength > 2 ? fastSlice(arguments, 1) : arguments[1];
                }

                index += 1;
                if (index === length) {
                    called = true;
                    callback(undefined, results);
                } else {
                    task = tasks[index];

                    if (isFunction(task)) {
                        task(next);
                    } else {
                        throw new TypeError("series(tasks, callback) tasks must be functions");
                    }
                }
            }
        }
    }

    task = tasks[index];

    if (isFunction(task)) {
        task(next);
    } else {
        throw new TypeError("series(tasks, callback) tasks must be functions");
    }
}

function objectSeries(tasks, callback) {
    var index = 0,
        objectKeys = keys(tasks),
        length = objectKeys.length,
        results = {},
        called = false,
        task;

    function next(err) {
        var argsLength, task;

        if (called !== true) {
            if (err) {
                called = true;
                callback(err);
            } else {
                argsLength = arguments.length;
                if (argsLength > 1) {
                    results[objectKeys[index]] = argsLength > 2 ? fastSlice(arguments, 1) : arguments[1];
                }

                index += 1;
                if (index === length) {
                    called = true;
                    callback(undefined, results);
                } else {
                    task = tasks[objectKeys[index]];

                    if (isFunction(task)) {
                        task(next);
                    } else {
                        throw new TypeError("series(tasks, callback) tasks must be functions");
                    }
                }
            }
        }
    }

    task = tasks[objectKeys[index]];

    if (isFunction(task)) {
        task(next);
    } else {
        throw new TypeError("series(tasks, callback) tasks must be functions");
    }
}
