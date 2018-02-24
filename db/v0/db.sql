-- blowerio-sms-sandbox
-- Sandbox for Blower.io SMS
--
-- Copyright (C) 2018  https://github.com/KillWolfVlad
--
-- This file is part of blowerio-sms-sandbox.
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU Affero General Public License as published
-- by the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU Affero General Public License for more details.
--
-- You should have received a copy of the GNU Affero General Public License
-- along with this program.  If not, see <http://www.gnu.org/licenses/>.

--  ____                 __                        ____    _____   __
-- /\  _`\              /\ \__                    /\  _`\ /\  __`\/\ \
-- \ \ \L\ \___     ____\ \ ,_\    __   _ __    __\ \,\L\_\ \ \/\ \ \ \
--  \ \ ,__/ __`\  /',__\\ \ \/  /'_ `\/\`'__\/'__`\/_\__ \\ \ \ \ \ \ \  __
--   \ \ \/\ \L\ \/\__, `\\ \ \_/\ \L\ \ \ \//\  __/ /\ \L\ \ \ \\'\\ \ \L\ \
--    \ \_\ \____/\/\____/ \ \__\ \____ \ \_\\ \____\\ `\____\ \___\_\ \____/
--     \/_/\/___/  \/___/   \/__/\/___L\ \/_/ \/____/ \/_____/\/__//_/\/___/
--                                 /\____/                             v10.2
--                                 \_/__/                Font Name: Larry 3D

CREATE TABLE meta (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE row_limits (
  key   TEXT PRIMARY KEY,
  value INT NOT NULL
);

CREATE TABLE messages (
  id       BIGSERIAL PRIMARY KEY,
  receiver TEXT        NOT NULL,
  message  TEXT        NOT NULL,
  date     TIMESTAMPTZ NOT NULL
);

CREATE INDEX messages_date_btree
  ON messages USING BTREE (date);

INSERT INTO meta (key, value) VALUES ('version', '0');

INSERT INTO row_limits (key, value) VALUES ('max', 9990);
INSERT INTO row_limits (key, value) VALUES ('current', 0);

CREATE FUNCTION row_cleaner()
  RETURNS TRIGGER AS $$
DECLARE
  max     INT;
  current INT;
BEGIN
  SELECT value
  FROM row_limits
  WHERE key = 'max'
  INTO max;

  SELECT value
  FROM row_limits
  WHERE key = 'current'
  INTO current;

  IF (current + 1 > max)
  THEN
    DELETE FROM messages
    WHERE date = (SELECT MIN(date)
                  FROM messages);
  ELSE
    UPDATE row_limits
    SET value = value + 1
    WHERE key = 'current';
  END IF;

  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER row_cleaner
  BEFORE INSERT
  ON messages
  FOR EACH ROW
EXECUTE PROCEDURE row_cleaner();
