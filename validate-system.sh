#!/bin/bash

# Script de validació per al sistema DBM Pump Control
# Verifica que tots els components estiguin correctament configurats

echo "🔍 Validant configuració del sistema DBM Pump Control..."
echo "=================================================="

# Verificar Node.js
echo -n "Node.js: "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Instal·lat ($NODE_VERSION)"
else
    echo "❌ No trobat - Cal instal·lar Node.js"
    exit 1
fi

# Verificar npm
echo -n "npm: "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ Instal·lat ($NPM_VERSION)"
else
    echo "❌ No trobat - Cal instal·lar npm"
    exit 1
fi

# Verificar Node-RED
echo -n "Node-RED: "
if command -v node-red &> /dev/null; then
    NODERED_VERSION=$(node-red --version 2>/dev/null | head -1)
    echo "✅ Instal·lat ($NODERED_VERSION)"
else
    echo "❌ No trobat - Cal instal·lar Node-RED"
    exit 1
fi

# Verificar fitxers del projecte
echo -n "flows.json: "
if [ -f "flows.json" ]; then
    FLOW_SIZE=$(wc -c < flows.json)
    echo "✅ Trobat (${FLOW_SIZE} bytes)"
else
    echo "❌ No trobat"
    exit 1
fi

echo -n "config-parametres-logica.json: "
if [ -f "config-parametres-logica.json" ]; then
    echo "✅ Trobat"
    # Validar JSON
    if jq empty config-parametres-logica.json 2>/dev/null; then
        echo "   ✅ JSON vàlid"
    else
        echo "   ⚠️  JSON pot tenir errors de sintaxi"
    fi
else
    echo "❌ No trobat"
    exit 1
fi

echo -n "historic-maniobres.csv: "
if [ -f "historic-maniobres.csv" ]; then
    LINES=$(wc -l < historic-maniobres.csv)
    echo "✅ Trobat ($LINES línies)"
else
    echo "❌ No trobat"
    exit 1
fi

echo -n "package.json: "
if [ -f "package.json" ]; then
    echo "✅ Trobat"
else
    echo "❌ No trobat"
    exit 1
fi

# Verificar dependències
echo ""
echo "📦 Verificant dependències..."
if [ -f "package.json" ]; then
    if [ -d "node_modules" ]; then
        echo "✅ node_modules present"
    else
        echo "⚠️  node_modules no trobat - Executeu 'npm install'"
    fi
else
    echo "❌ package.json no trobat"
fi

# Verificar GPIO (només a Raspberry Pi)
echo ""
echo "🔌 Verificant GPIO..."
if [ -d "/sys/class/gpio" ]; then
    echo "✅ Sistema GPIO disponible"
    
    # Verificar pins específics
    for pin in 5 6; do
        if [ -d "/sys/class/gpio/gpio${pin}" ]; then
            echo "   ✅ GPIO${pin} configurat"
        else
            echo "   ⚠️  GPIO${pin} no configurat (es configurarà automàticament)"
        fi
    done
else
    echo "⚠️  Sistema GPIO no disponible (normal si no és una Raspberry Pi)"
fi

# Verificar connectivitat MQTT (opcional)
echo ""
echo "📡 Verificant configuració MQTT..."
MQTT_HOST=$(jq -r '.mqtt.broker_host // "cerbo-gx.local"' config-parametres-logica.json 2>/dev/null)
if command -v ping &> /dev/null; then
    if ping -c 1 "$MQTT_HOST" &> /dev/null; then
        echo "✅ Host MQTT ($MQTT_HOST) accessible"
    else
        echo "⚠️  Host MQTT ($MQTT_HOST) no accessible - Verificar configuració de xarxa"
    fi
else
    echo "⚠️  No es pot verificar connectivitat MQTT (ping no disponible)"
fi

echo ""
echo "🚀 Instruccions per executar:"
echo "   node-red flows.json"
echo ""
echo "📊 Dashboard disponible a:"
echo "   http://$(hostname -I | awk '{print $1}'):1880/ui"
echo ""
echo "=================================================="

# Resum final
ERRORS=0
if ! command -v node-red &> /dev/null; then
    ((ERRORS++))
fi
if [ ! -f "flows.json" ]; then
    ((ERRORS++))
fi
if [ ! -f "config-parametres-logica.json" ]; then
    ((ERRORS++))
fi

if [ $ERRORS -eq 0 ]; then
    echo "✅ Sistema validat correctament!"
    exit 0
else
    echo "❌ S'han trobat $ERRORS errors. Reviseu la configuració."
    exit 1
fi