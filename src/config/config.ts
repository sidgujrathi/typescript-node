import * as dotenv from 'dotenv';

dotenv.config();

const env: string = process.env.NODE_ENV || 'development';

const config: any = {
  development: {
    env,
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_DEBUG: process.env.MONGO_DEBUG,
  },
  production: {
    env,
    port: '3003',
    mongoURL: 'mongodb://bat-mongodb:BySP7C9a9XLQ@node211203-lacunappd1.j.layershift.co.uk/lacuna_bat',
    JWT_SECRET: 'skdjhf23897@&@%@$@&dkjde7hj237wnesdhfkjJHWHJDNK',
    MONGO_DEBUG: false,
  },
};

export default config[env];
