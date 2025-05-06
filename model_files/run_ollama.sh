#!/bin/bash

# Start Ollama in the background
echo "Starting Ollama server..."
ollama serve &

# Wait for server to be ready
echo "Waiting for Ollama to start..."
while ! curl -s http://localhost:11434 > /dev/null; do
  sleep 1
done

# Create and run the model
echo "Ollama is ready, creating the model..."
ollama create finetuned_mistral -f /model_files/Modelfile

# Keep the container running
echo "Model created. Server is running..."
wait