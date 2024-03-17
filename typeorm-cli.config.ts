import { DataSource } from "typeorm";

import { Coffee } from "src/coffees/entities/coffee.entity";
import { Flavor } from "src/coffees/entities/flavor.entity";
import { CoffeeRefactor1710701923188 } from "./src/migrations/1710701923188-CoffeeRefactor";
import { SchemaSync1710703030845 } from "./src/migrations/1710703030845-SchemaSync";

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  entities: [Coffee, Flavor],
  migrations: [CoffeeRefactor1710701923188, SchemaSync1710703030845],
});