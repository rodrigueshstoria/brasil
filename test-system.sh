#!/bin/bash

echo "🧪 Teste Automático do Sistema Brasil Quiz"
echo "=========================================="
echo ""

# Teste 1: Verificar arquivos críticos
echo "✅ Teste 1: Verificar arquivos críticos"
files=(
  "config.js"
  "database.js"
  "github-sync.js"
  "index.html"
  "script.js"
  "candidates.js"
  "congresso/index.html"
  "congresso/candidate-setup.js"
  "admin/index.html"
  "admin/admin.js"
  "apuracao.html"
  "apuracao/apuracao.js"
  "data/candidates.json"
  "data/users.json"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (FALTANDO)"
  fi
done

echo ""
echo "✅ Teste 2: Verificar Token GitHub"
if grep -q "GITHUB_TOKEN = '" config.js && ! grep -q "SEU_TOKEN_AQUI" config.js; then
  echo "  ✓ Token configurado"
else
  echo "  ✗ Token não configurado"
fi

echo ""
echo "✅ Teste 3: Verificar Senhas de Candidato"
if grep -q "validPasswords" candidates.js; then
  echo "  ✓ Senhas de candidato encontradas"
  echo "  Senhas disponíveis:"
  grep -A 25 "const validPasswords" candidates.js | head -30
else
  echo "  ✗ Senhas não encontradas"
fi

echo ""
echo "✅ Teste 4: Verificar Senha Admin"
if grep -q "Pinguelo1" admin/admin.js; then
  echo "  ✓ Senha admin: Pinguelo1"
else
  echo "  ✗ Senha admin não encontrada"
fi

echo ""
echo "✅ Teste 5: Verificar Git Commits"
echo "Últimos 5 commits:"
git log --oneline -5

echo ""
echo "✅ Teste 6: Verificar Status do Repositório"
git status --short

echo ""
echo "=========================================="
echo "🎯 Status: PRONTO PARA TESTE MANUAL"
echo ""
echo "📝 Próximos passos:"
echo "1. Abra: http://localhost:3000/test-system.html"
echo "2. Ou execute: python3 -m http.server 3000"
echo "3. Acesse /congresso/ para cadastrar candidato teste"
echo "4. Acesse /admin/ com senha 'Pinguelo1'"
echo "=================================================="
