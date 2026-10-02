#!/bin/bash
set -e

# ------------------------------------------------------------------------------
# PostgreSQL Initialization Script for HAPI FHIR Database
# Separates the FHIR persistence store from the primary clinical application DB.
# ------------------------------------------------------------------------------

FHIR_DB="${POSTGRES_FHIR_DB:-adhya_fhir}"
FHIR_USER="${POSTGRES_FHIR_USER:-adhya_fhir}"
FHIR_PASSWORD="${POSTGRES_FHIR_PASSWORD:-change-me}"

echo "Configuring dedicated FHIR persistence database: ${FHIR_DB} with owner: ${FHIR_USER}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${FHIR_USER}') THEN
            CREATE ROLE ${FHIR_USER} WITH LOGIN PASSWORD '${FHIR_PASSWORD}';
        END IF;
    END
    \$\$;

    SELECT 'CREATE DATABASE ${FHIR_DB} OWNER ${FHIR_USER}'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${FHIR_DB}')\gexec

    GRANT ALL PRIVILEGES ON DATABASE ${FHIR_DB} TO ${FHIR_USER};
EOSQL

echo "Dedicated FHIR database ${FHIR_DB} successfully configured."
