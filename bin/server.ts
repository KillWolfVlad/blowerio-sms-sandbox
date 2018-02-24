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

import {Debug, Env, Migrate, server} from "../";

Env.ValidateSync();

Migrate.migrate().then(() => {
    server.listen(Env.PORT);
    Debug.log(`Server started on port ${Env.PORT}`);
}).catch((error) => {
    Debug.log(error);
    process.exit(1);
});
