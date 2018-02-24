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

import * as validator from "validator";

import {pool} from "./db";
import {io} from "./web";

/**
 * Message
 */
export class Message {
    /**
     * Validate message
     * @param input Text
     * @returns {boolean}
     */
    public static isMessage(input: any): boolean {
        return (typeof input === "string" || input instanceof String) && input && input.length <= 70;
    }

    /**
     * Validate phone
     * @param {string} input
     * @returns {boolean}
     */
    public static isMobilePhone(input: string): boolean {
        try {
            return validator.isMobilePhone(input, "any");
        } catch {
            return false;
        }
    }

    /**
     * Send message
     * @param {string} to Receiver phone
     * @param {string} text Message
     * @returns {Promise<Message>}
     * @throws Error
     */
    public static async send(to: string, text: string): Promise<Message> {
        // language=PostgreSQL
        const result = (await pool.query(
            "INSERT INTO messages(receiver, message, date) VALUES ($1,$2,$3) RETURNING id,receiver,message,date;",
            [to, text, new Date()])).rows[0];
        const message = new Message(result.date, result.id, result.message, result.receiver);
        io.emit("messages", [message]);
        return message;
    }

    /**
     * Get message history
     * @returns {Promise<Message[]>}
     * @throws Error
     */
    public static async history(): Promise<Message[]> {
        // language=PostgreSQL
        const result = await pool.query("SELECT * FROM messages ORDER BY date ASC;");
        return result.rows.map((item) => {
            return new Message(item.date, item.id, item.message, item.receiver);
        });
    }

    /**
     * Erase messages
     * @returns {Promise<void>}
     * @throws Error
     */
    public static async erase(): Promise<void> {
        // language=PostgreSQL
        await pool.query(`
          DELETE FROM messages;
          UPDATE row_limits
          SET value = 0
          WHERE key = 'current';
          ALTER SEQUENCE messages_id_seq RESTART;`);
        io.emit("clear");
    }

    /**
     * Date
     */
    public readonly date: string;

    /**
     * ID
     */
    public readonly id: string;

    /**
     * Message
     */
    public readonly message: string;

    /**
     * Receiver
     */
    public readonly receiver: string;

    private constructor(date: string, id: string, message: string, receiver: string) {
        this.date = date;
        this.id = id;
        this.message = message;
        this.receiver = receiver;
    }
}
