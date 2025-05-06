#!/bin/bash

git add .

# Verifica se há mudanças para commitar
if git diff-index --quiet HEAD --; then
    echo "Nenhuma mudança para commitar."
    exit 0
fi

# Faz o commit com uma mensagem padrão ou personalizada
if [ -z "$1" ]; then
    git commit -m "Commit automático em $(date +'%d/%m/%Y %H:%M:%S')"
else
    git commit -m "$1"
fi

# Mostra o status após o commit
git status
git push
