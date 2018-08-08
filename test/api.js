const {assert} = require("chai");
const request = require("supertest");
const app = require("../app");
const knex = require("../database-connection");

describe("API requests", () => {
    beforeEach(done => {
        knex.seed.run().then(() => {
            done();
        });
    });
    describe("#Read", () => {
        it("reads a coffee", done => {
            request(app)
                .get("/coffee/2")
                .expect(200)
                .then(response => {
                    assert.deepEqual(response.body.coffee, {
                        id: 2,
                        name: "Holiday Roast",
                        roaster: "Starbucks",
                        aroma: 9
                    });
                }).then(done).catch(done);
        });
    });
    describe("#List", () => {
        it("lists coffees", done => {
            request(app)
                .get("/coffee")
                .expect(200)
                .then(response => {
                    assert.deepEqual(response.body.coffee, [{
                        id: 1,
                        name: "Black and Tan",
                        roaster: "Ink",
                        aroma: 3
                    },{
                        id: 2,
                        name: "Holiday Roast",
                        roaster: "Starbucks",
                        aroma: 9
                    },{
                        id: 3,
                        name: "House Quake",
                        roaster: "Denver Coffee",
                        aroma: 6
                    }]);
                }).then(done).catch(done);
        });
    });
    describe("#Create", () => {
        it("creates a coffee", done => {
            request(app)
                .post("/coffees")
                .send({
                    name: "Burning Love",
                    roaster: "Seattle's Best Coffee",
                    aroma: 1
                }).expect(201)
                .then(response => {
                    assert.deepEqual(response.body.coffee, {
                        id: 4,
                        name: "Burning Love",
                        roaster: "Seattle's Best Coffee",
                        aroma: 1
                    });
                }).then(done).catch(done);
        });
    });
    describe("#Delete", () => {
        it("deletes a coffee", done => {
            request(app)
                .delete("/coffees/2")
                .expect(204)
                .then(response => {
                    return request(app)
                        .get("/coffees/2")
                        .expect(404);
                }).then(() => done()).catch(done);
        });
    });
    describe("#Update", () => {
        it("updates a coffee", done => {
            request(app)
                .put("/coffees/2")
                .send({
                    aroma: 4
                }).expect(200)
                .then(response => {
                    return request(app)
                        .get("/coffee/2")
                        .expect(200)
                }).then(response => {
                    assert.deepEqual(response.body.coffee, {
                        id: 2,
                        name: "Holiday Roast",
                        roaster: "Starbucks",
                        aroma: 4
                    });
                    return;
                }).then(done).catch(done);
        });
    });
});