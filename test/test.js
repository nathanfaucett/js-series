var assert = require("assert"),
    series = require("../src/index");


describe("series(tasks, callback)", function() {
    describe("#(tasks : Array, callback)", function() {
        it("should call array of tasks in order", function() {
            series([
                function(next) {
                    process.nextTick(function() {
                        next(undefined, {
                            id: 1
                        });
                    });
                },
                function(next) {
                    process.nextTick(function() {
                        next(undefined, {
                            id: 2
                        });
                    });
                },
                function(next) {
                    process.nextTick(function() {
                        next(undefined, {
                            id: 3
                        });
                    });
                }
            ], function(err, results) {
                assert.equal(err, undefined);
                assert.deepEqual(results, [{
                    id: 1
                }, {
                    id: 2
                }, {
                    id: 3
                }]);
            });
        });

        it("should exit and call callback with error", function() {
            series([
                function(next) {
                    process.nextTick(function() {
                        next(new Error("not found"));
                    });
                },
                function(next) {
                    process.nextTick(function() {
                        next(undefined, {
                            id: 2
                        });
                    });
                }
            ], function(err) {
                assert.equal(err.message, "not found");
            });
        });
    });
    describe("#(tasks : Object, callback)", function() {
        it("should call object tasks in order", function() {
            series({
                "first": function(next) {
                    process.nextTick(function() {
                        next(undefined, {
                            id: 1
                        });
                    });
                },
                "second": function(next) {
                    process.nextTick(function() {
                        next(undefined, {
                            id: 2
                        });
                    });
                },
                "last": function(next) {
                    process.nextTick(function() {
                        next(undefined, {
                            id: 3
                        });
                    });
                }
            }, function(err, results) {
                assert.equal(err, undefined);
                assert.deepEqual(results, {
                    "first": {
                        id: 1
                    },
                    "second": {
                        id: 2
                    },
                    "last": {
                        id: 3
                    }
                });
            });
        });

        it("should exit and call callback with error", function() {
            series({
                "first": function(next) {
                    process.nextTick(function() {
                        next(new Error("not found"));
                    });
                },
                "last": function(next) {
                    process.nextTick(function() {
                        next(undefined, {
                            id: 2
                        });
                    });
                }
            }, function(err) {
                assert.equal(err.message, "not found");
            });
        });
    });
});
