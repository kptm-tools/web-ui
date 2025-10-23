#!/bin/sh
set -e

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  # Export variables from .env, ignoring comments and empty lines
  export $(grep -v '^#' .env | grep -v '^$' | xargs)
fi

# Set default values if not provided
: ${API_BASE_URL:="http://localhost:8000"}
: ${WS_BASE_URL:="ws://localhost:8000/api/core"}
: ${FEATURE_COMPLIANCE_FRAMEWORK_ENABLED:="false"}

echo "Generating public/config.js from template..."
echo "  API_BASE_URL: $API_BASE_URL"
echo "  WS_BASE_URL: $WS_BASE_URL"
echo "  FEATURE_COMPLIANCE_FRAMEWORK_ENABLED: $FEATURE_COMPLIANCE_FRAMEWORK_ENABLED"

# Check if template exists
if [ ! -f public/config.js.template ]; then
  echo "Error: public/config.js.template not found!"
  exit 1
fi

# Generate config.js from template using envsubst
if command -v envsubst >/dev/null 2>&1; then
  # Use envsubst if available (Linux/Mac with gettext)
  envsubst < public/config.js.template > public/config.js
else
  # Fallback to sed for basic substitution (works on all systems)
  sed -e "s|\${API_BASE_URL}|$API_BASE_URL|g" \
      -e "s|\${WS_BASE_URL}|$WS_BASE_URL|g" \
      -e "s|\${FEATURE_COMPLIANCE_FRAMEWORK_ENABLED}|$FEATURE_COMPLIANCE_FRAMEWORK_ENABLED|g" \
      public/config.js.template > public/config.js
fi

echo "✓ Successfully generated public/config.js"
