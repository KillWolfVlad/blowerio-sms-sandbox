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

/**
 * Environment variables
 */
export class Env {
    /**
     * Node.js environment
     * @type {string}
     */
    public static readonly NODE_ENV: string = process.env.NODE_ENV || "";

    /**
     * Maximum request body size (in https://www.npmjs.com/package/bytes notation)
     * @type {string}
     */
    public static readonly BODYPARSER_LIMIT: string = process.env.BODYPARSER_LIMIT || "";

    /**
     * Web application port
     * @type {number}
     */
    public static readonly PORT: number = parseInt(process.env.PORT || "", 10);

    /**
     * Database url in format "postgresql://dbuser:secretpassword@database.server.com:3211/mydb"
     * @type {string}
     */
    public static readonly DATABASE_URL: string = process.env.DATABASE_URL || "";

    /**
     * Maximum number of clients the pool should contain
     * @type {number}
     */
    public static readonly DATABASE_MAX: number = parseInt(process.env.DATABASE_MAX || "", 10);

    /**
     * Use secure connection?
     * @type {boolean}
     */
    public static readonly DATABASE_SSL: boolean = !!process.env.DATABASE_SSL;

    /**
     * Password for root access
     * @type {(string | undefined) & string}
     */
    public static readonly ROOT_PASSWORD: string = process.env.ROOT_PASSWORD || "";

    /**
     * Validate variables
     * @throws Error
     */
    public static ValidateSync() {
        if (Env.NODE_ENV !== "production" && Env.NODE_ENV !== "staging") {
            throw new Error(`Environment variable "NODE_ENV" should be "production" or "staging"!`);
        }
        if (!Env.BODYPARSER_LIMIT) {
            throw new Error(`Environment variable "BODYPARSER_LIMIT" is required!`);
        }
        if (isNaN(Env.PORT)) {
            throw new Error(`Environment variable "PORT" is required!`);
        }
        if (!Env.DATABASE_URL) {
            throw new Error(`Environment variable "DATABASE_URL" is required!`);
        }
        if (isNaN(Env.DATABASE_MAX)) {
            throw new Error(`Environment variable "DATABASE_MAX" is required!`);
        }
        if (!Env.ROOT_PASSWORD) {
            throw new Error(`Environment variable "ROOT_PASSWORD" is required!`);
        }
    }
}
