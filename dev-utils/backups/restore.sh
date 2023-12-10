# Enter backup file name (File must be near this script in the same directory)
BACKUP_NAME=xxx.dump

# Hint: Variables are provided from the docker compose file
export PGUSER=$POSTGRES_USER
export PGPASSWORD=$POSTGRES_PASSWORD

# Drop public schema to avoid conflicts
psql -d $POSTGRES_DB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Restore backup
pg_restore --no-owner -d $POSTGRES_DB /opt/backups/$BACKUP_NAME
