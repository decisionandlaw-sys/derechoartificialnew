#!/bin/bash

# Script de revalidación para DerechoArtificial.com
# Uso: ./scripts/revalidate-home.sh [opciones]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Variables de entorno
REVALIDATE_SECRET="${REVALIDATE_SECRET:-}"
BASE_URL="${BASE_URL:-https://www.derechoartificial.com}"
API_ENDPOINT="${BASE_URL}/api/revalidate"

# Función de ayuda
show_help() {
    echo -e "${BLUE}Script de Revalidación - DerechoArtificial.com${NC}"
    echo ""
    echo -e "${YELLOW}Uso:${NC} $0 [opciones]"
    echo ""
    echo -e "${YELLOW}Opciones:${NC}"
    echo "  -h, --help          Muestra esta ayuda"
    echo "  -p, --paths         Rutas específicas a revalidar (separadas por comas)"
    echo "  -t, --tags          Tags específicos a revalidar (separados por comas)"
    echo "  -a, --all           Revalida todas las rutas y tags por defecto"
    echo "  -v, --verbose       Modo verbose"
    echo ""
    echo -e "${YELLOW}Variables de entorno:${NC}"
    echo "  REVALIDATE_SECRET    Token secreto para autenticación (requerido)"
    echo "  BASE_URL           URL base del sitio (default: https://www.derechoartificial.com)"
    echo ""
    echo -e "${YELLOW}Ejemplos:${NC}"
    echo "  # Revalidar todo"
    echo "  REVALIDATE_SECRET=tu_secreto $0 --all"
    echo ""
    echo "  # Revalidar rutas específicas"
    echo "  REVALIDATE_SECRET=tu_secreto $0 --paths '/firma-scarpa,/actualidad-ia'"
    echo ""
    echo "  # Revalidar tags específicos"
    echo "  REVALIDATE_SECRET=tu_secreto $0 --tags 'firma-scarpa-posts,actualidad-posts'"
    echo ""
    echo -e "${YELLOW}Integración con CI/CD:${NC}"
    echo "  # GitHub Actions"
    echo "  - name: Revalidate Home"
    echo "    run: ./scripts/revalidate-home.sh --all"
    echo "    env:"
    echo "      REVALIDATE_SECRET: \${{ secrets.REVALIDATE_SECRET }}"
}

# Función para validar configuración
validate_config() {
    if [[ -z "$REVALIDATE_SECRET" ]]; then
        echo -e "${RED}❌ Error: REVALIDATE_SECRET no está configurado${NC}"
        echo -e "${YELLOW}💡 Solución: export REVALIDATE_SECRET=tu_token_secreto${NC}"
        echo -e "${YELLOW}💡 O configura en .env.local o secrets de CI/CD${NC}"
        exit 1
    fi

    # Verificar si curl está disponible
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}❌ Error: curl no está instalado${NC}"
        exit 1
    fi
}

# Función para revalidar
revalidate() {
    local paths="$1"
    local tags="$2"
    local verbose="$3"

    echo -e "${BLUE}🔄 Iniciando revalidación...${NC}"
    echo -e "${BLUE}🌐 Endpoint: ${API_ENDPOINT}${NC}"
    
    if [[ "$verbose" == "true" ]]; then
        echo -e "${BLUE}📂 Paths: ${paths:-'todos por defecto'}${NC}"
        echo -e "${BLUE}🏷️ Tags: ${tags:-'todos por defecto'}${NC}"
    fi

    # Construir el payload JSON
    local payload='{}'
    if [[ -n "$paths" ]]; then
        payload=$(echo "$payload" | jq --arg paths "$paths" '. + {paths: ($paths | split(","))}')
    fi
    if [[ -n "$tags" ]]; then
        payload=$(echo "$payload" | jq --arg tags "$tags" '. + {tags: ($tags | split(","))}')
    fi

    if [[ "$verbose" == "true" ]]; then
        echo -e "${BLUE}📤 Payload: ${payload}${NC}"
    fi

    # Ejecutar la petición
    local response
    response=$(curl -s -w "\n%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "x-revalidate-secret: $REVALIDATE_SECRET" \
        -d "$payload" \
        "$API_ENDPOINT")

    # Separar el código HTTP del cuerpo de la respuesta
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n -1)

    echo -e "${BLUE}📊 Código HTTP: ${http_code}${NC}"

    # Procesar respuesta
    case "$http_code" in
        200)
            echo -e "${GREEN}✅ Revalidación exitosa${NC}"
            if [[ "$verbose" == "true" ]]; then
                echo "$body" | jq '.' 2>/dev/null || echo "$body"
            fi
            ;;
        401)
            echo -e "${RED}❌ Error: Token inválido${NC}"
            echo -e "${YELLOW}💡 Verifica que REVALIDATE_SECRET sea correcto${NC}"
            exit 1
            ;;
        500)
            echo -e "${RED}❌ Error interno del servidor${NC}"
            if [[ "$verbose" == "true" ]]; then
                echo "$body" | jq '.' 2>/dev/null || echo "$body"
            fi
            exit 1
            ;;
        *)
            echo -e "${RED}❌ Error inesperado: ${http_code}${NC}"
            if [[ "$verbose" == "true" ]]; then
                echo "$body"
            fi
            exit 1
            ;;
    esac
}

# Parsear argumentos
paths=""
tags=""
verbose="false"
all="false"

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -p|--paths)
            paths="$2"
            shift 2
            ;;
        -t|--tags)
            tags="$2"
            shift 2
            ;;
        -a|--all)
            all="true"
            shift
            ;;
        -v|--verbose)
            verbose="true"
            shift
            ;;
        *)
            echo -e "${RED}❌ Opción desconocida: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Validar configuración
validate_config

# Ejecutar revalidación
if [[ "$all" == "true" ]]; then
    revalidate "" "" "$verbose"
else
    revalidate "$paths" "$tags" "$verbose"
fi

echo -e "${GREEN}🎉 Proceso de revalidación completado${NC}"
