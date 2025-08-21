#!/bin/bash
cd /home/kavia/workspace/code-generation/eventmaster-162273-162282/event_management_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

