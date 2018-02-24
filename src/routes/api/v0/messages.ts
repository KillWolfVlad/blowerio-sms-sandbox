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

import {Router} from "express";

import {Env, Message} from "src";

const router = Router();
export default router;

router.post("/", async (req, res) => {
    const to = req.body.to;
    const message = req.body.message;
    if (!Message.isMobilePhone(to)) {
        return res.status(400).json({
            code: "WRONG_TO",
            message: "Wrong mobile phone!",
        });
    }
    if (!Message.isMessage(message)) {
        return res.status(400).json({
            code: "WRONG_MESSAGE",
            message: "Wrong message!",
        });
    }
    try {
        await Message.send(to, message);
    } catch (error) {
        return res.status(500).json({
            code: "ERROR",
            message: error.message,
        });
    }
    return res.status(201).json({
        code: "CREATED",
        message: "Message sent!",
    });
});

router.delete("/", async (req, res) => {
    const root_password = req.body.root_password;
    if (root_password !== Env.ROOT_PASSWORD) {
        return res.status(400).json({
            code: "WRONG_ROOT_PASSWORD",
            message: "Wrong password!",
        });
    }
    try {
        await Message.erase();
    } catch (error) {
        return res.status(500).json({
            code: "ERROR",
            message: error.message,
        });
    }
    return res.status(200).json({
        code: "OK",
        message: "OK!",
    });
});
