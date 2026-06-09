#!/bin/sh
set -e

until pg_isready -h postgres -U postgres -d contexto >/dev/null 2>&1; do
  echo "Waiting for postgres..."
  sleep 2
done

exec "$@"
