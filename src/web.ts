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

import * as http from "http";
import * as path from "path";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as morgan from "morgan";
import * as socket from "socket.io";

import {Env} from "./env";

/**
 * Express application
 * @type {Express}
 */
const app = express();
export {app};

/**
 * Http server
 * @type {"http".Server}
 */
const server = http.createServer(app);
export {server};

/**
 * IO server
 * @type {SocketIO.Server}
 */
const io = socket(server, {
    transports: ["websocket"],
});
export {io};

import routes from "./routes";

app.use(morgan("tiny"));
app.use(express.static(path.resolve(__dirname, "../../public")));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: Env.BODYPARSER_LIMIT,
}));

app.use("/", routes);

import connection from "./connection";

io.on("connection", connection);
