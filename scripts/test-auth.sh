#!/bin/bash
# Test script for Auth-enabled Genie Multicluster
# Run this after starting all services with auth enabled

set -e

echo "=========================================="
echo "Genie Multicluster Auth Test"
echo "=========================================="

# Check if logged in to OpenShift
echo ""
echo "1. Checking OpenShift login status..."
if ! oc whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to OpenShift. Please run: oc login <cluster-url>"
    exit 1
fi

CURRENT_USER=$(oc whoami)
echo "✅ Logged in as: $CURRENT_USER"

# Get token
echo ""
echo "2. Getting OpenShift token..."
TOKEN=$(oc whoami -t)
if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get token"
    exit 1
fi
echo "✅ Token obtained (${#TOKEN} chars)"

# Test search-mcp-server health (no auth required)
echo ""
echo "3. Testing search-mcp-server health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:9082/health 2>/dev/null || echo "FAILED")
if [[ "$HEALTH_RESPONSE" == *"ok"* ]]; then
    echo "✅ search-mcp-server is healthy"
else
    echo "❌ search-mcp-server health check failed: $HEALTH_RESPONSE"
    echo "   Make sure search-mcp-server is running on port 9082"
fi

# Test search-mcp-server with auth
echo ""
echo "4. Testing search-mcp-server /info endpoint WITH auth..."
INFO_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:9082/info 2>/dev/null || echo "FAILED")
if [[ "$INFO_RESPONSE" == *"PostgreSQL"* ]] || [[ "$INFO_RESPONSE" == *"MCP"* ]]; then
    echo "✅ search-mcp-server auth working!"
    echo "   Response: ${INFO_RESPONSE:0:100}..."
else
    echo "⚠️  search-mcp-server /info response: $INFO_RESPONSE"
fi

# Test search-mcp-server WITHOUT auth (should fail if auth is enabled)
echo ""
echo "5. Testing search-mcp-server /info WITHOUT auth (should fail if auth enabled)..."
NO_AUTH_RESPONSE=$(curl -s http://localhost:9082/info 2>/dev/null || echo "FAILED")
if [[ "$NO_AUTH_RESPONSE" == *"Missing authorization"* ]] || [[ "$NO_AUTH_RESPONSE" == *"401"* ]]; then
    echo "✅ Auth is properly enforced - request without token was rejected"
else
    echo "⚠️  Response without auth: ${NO_AUTH_RESPONSE:0:100}..."
    echo "   (If you see data, auth may still be disabled with SKIP_AUTH=true)"
fi

# Test lightspeed-stack health
echo ""
echo "6. Testing lightspeed-stack health endpoint..."
LS_HEALTH=$(curl -s http://localhost:8080/health 2>/dev/null || echo "FAILED")
if [[ "$LS_HEALTH" == *"healthy"* ]] || [[ "$LS_HEALTH" == *"ok"* ]]; then
    echo "✅ lightspeed-stack is healthy"
else
    echo "❌ lightspeed-stack health check failed: $LS_HEALTH"
fi

# Test lightspeed-stack with auth
echo ""
echo "7. Testing lightspeed-stack /v1/models WITH auth..."
MODELS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/v1/models 2>/dev/null || echo "FAILED")
if [[ "$MODELS_RESPONSE" == *"gpt"* ]] || [[ "$MODELS_RESPONSE" == *"model"* ]]; then
    echo "✅ lightspeed-stack auth working!"
else
    echo "⚠️  lightspeed-stack /v1/models response: ${MODELS_RESPONSE:0:100}..."
fi

# Test lightspeed-stack WITHOUT auth
echo ""
echo "8. Testing lightspeed-stack /v1/models WITHOUT auth (should fail if auth enabled)..."
LS_NO_AUTH=$(curl -s http://localhost:8080/v1/models 2>/dev/null || echo "FAILED")
if [[ "$LS_NO_AUTH" == *"Unauthorized"* ]] || [[ "$LS_NO_AUTH" == *"401"* ]] || [[ "$LS_NO_AUTH" == *"Invalid"* ]]; then
    echo "✅ Auth is properly enforced on lightspeed-stack"
else
    echo "⚠️  Response without auth: ${LS_NO_AUTH:0:100}..."
    echo "   (If you see data, auth may still use 'noop' module)"
fi

echo ""
echo "=========================================="
echo "Auth Test Complete"
echo "=========================================="
echo ""
echo "Summary:"
echo "- User: $CURRENT_USER"
echo "- To test the full flow, open http://localhost:9000/genie"
echo "- The UI should send the token from the console session"
echo ""
