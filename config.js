var connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin@172.16.0.56:5432/placement';

module.exports = connectionString;
