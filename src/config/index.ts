import dotenv from 'dotenv';
dotenv.config();


const config: { [key: string]: string } = {
    mlite_token: process.env.MLITE_TOKEN || '59103fd9906c970004605ab4',
}
export default config;