// blowerio-sms-sandbox
// Sandbox for Blower.io SMS
//
// Copyright (C) 2018  https://github.com/KillWolfVlad
//
// This file is part of blowerio-sms-sandbox.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import "mocha";
import request = require("supertest");

import {app} from "src";

describe("/api/v0/messages", () => {
    it("POST - 201", (done) => {
        request(app)
            .post("/api/v0/messages")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .set("Accept", "application/json")
            .send(`to=${encodeURI("+79123456789")}&message=${encodeURI("Supertest!")}`)
            .expect("Content-Type", /json/)
            .expect(201)
            .end(done);
    });

    it("POST - 400 - Bad phone", (done) => {
        request(app)
            .post("/api/v0/messages")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .set("Accept", "application/json")
            .send(`to=${encodeURI("Bad phone")}&message=${encodeURI("Supertest!")}`)
            .expect("Content-Type", /json/)
            .expect(400)
            .end(done);
    });

    it("POST - 400 - Bad message", (done) => {
        request(app)
            .post("/api/v0/messages")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .set("Accept", "application/json")
            .send(`to=${encodeURI("+79123456789")}&message=${encodeURI("")}`)
            .expect("Content-Type", /json/)
            .expect(400)
            .end(done);
    });
});
