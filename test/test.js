var assert = require("assert"),
    series = require("../src/index");


describe("series(tasks, callback)", function() {
    describe("#(tasks : Array, callback)", function() {
        it("should call array of tasks in order", function(done) {
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
                done();
            });
        });

        it("should exit and call callback with error", function(done) {
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
                done();
            });
        });

        it("should throw an error if a task is not a function", function(done) {
            try {
                series([
                    "string",
                    function(next) {
                        next();
                    }
                ], function() {});
            } catch (err) {
                assert.equal(err.message, "series(tasks, callback) tasks must be functions");
            }

            try {
                series([
                    function(next) {
                        next();
                    },
                    "string"
                ], function() {});
            } catch (err) {
                assert.equal(err.message, "series(tasks, callback) tasks must be functions");
            }

            done();
        });
    });
    describe("#(tasks : Object, callback)", function() {
        it("should call object tasks in order", function(done) {
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
                done();
            });
        });

        it("should exit and call callback with error", function(done) {
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
                done();
            });
        });

        it("should throw an error if a task is not a function", function(done) {
            try {
                series({
                    "first": "string",
                    "second": function(next) {
                        next();
                    }
                }, function() {});
            } catch (err) {
                assert.equal(err.message, "series(tasks, callback) tasks must be functions");
            }

            try {
                series({
                    "first": function(next) {
                        next();
                    },
                    "second": "string"
                }, function() {});
            } catch (err) {
                assert.equal(err.message, "series(tasks, callback) tasks must be functions");
            }

            done();
        });
    });
});
