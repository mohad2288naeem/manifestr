import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { RefreshToken } from '../models/RefreshToken';

import { MotivationQuote } from '../models/MotivationQuote';
import { GenerationJob } from '../models/GenerationJob';
import { VaultItem } from '../models/VaultItem';
import { StyleGuide } from '../models/StyleGuide';

const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: databaseUrl,
    host: databaseUrl ? undefined : process.env.DB_HOST || 'localhost',
    port: databaseUrl ? undefined : Number(process.env.DB_PORT || 5432),
    username: databaseUrl ? undefined : process.env.DB_USER || 'postgres',
    password: databaseUrl ? undefined : process.env.DB_PASSWORD || 'postgres',
    database: databaseUrl ? undefined : process.env.DB_NAME || 'manifestr',
    synchronize: true,
    logging: false,
    entities: [
        User,
        RefreshToken,
        MotivationQuote,
        GenerationJob,
        VaultItem,
        StyleGuide
    ],
    migrations: [],
    subscribers: [],
});
