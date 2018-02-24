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

import * as fs from "fs";
import * as path from "path";

import {pool} from "./db";

/**
 * Simple db migration
 */
export class Migrate {
    /**
     * Version
     */
    public static readonly version = {
        /**
         * Actual version
         */
        actual: -1,

        /**
         * Current version
         */
        current: -1,
    };

    /**
     * Migrate (or create) db
     * @returns {Promise<void>}
     */
    public static async migrate() {
        Migrate.setActualVersionSync();
        if (await Migrate.isMetaTableExists()) {
            await Migrate.setCurrentVersion();
            for (let i = Migrate.version.current + 1; i <= Migrate.version.actual; ++i) {
                await Migrate.execSql(path.join(Migrate.dbDir, `v${i}`, "migrate.sql"));
            }
        } else {
            await Migrate.execSql(path.join(Migrate.dbDir, `v${Migrate.version.actual}`, "db.sql"));
        }
        Migrate.version.current = Migrate.version.actual;
    }

    /**
     * Drop db
     * @returns {Promise<void>}
     */
    public static async drop() {
        if (await Migrate.isMetaTableExists()) {
            await Migrate.setCurrentVersion();
            await Migrate.execSql(path.join(Migrate.dbDir, `v${Migrate.version.current}`, "drop.sql"));
        }
    }

    private static dbDir: string = path.resolve(__dirname, "../../db/");

    private static async isMetaTableExists(): Promise<boolean> {
        // language=PostgreSQL
        const result = await pool.query("SELECT to_regclass($1);", [`${"meta"}`]);
        return result.rows[0].to_regclass;
    }

    private static setActualVersionSync() {
        Migrate.version.actual = require(path.join(Migrate.dbDir, "version.json")).actual;
    }

    private static async setCurrentVersion() {
        // language=PostgreSQL
        const result = await pool.query("SELECT value FROM meta WHERE key=$1;", [`${"version"}`]);
        Migrate.version.current = parseInt(result.rows[0].value, 10);
    }

    private static async execSql(fileName: string) {
        await pool.query(await Migrate.readSql(fileName));
    }

    private static readSql(fileName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(fileName, "utf8", (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }
}
