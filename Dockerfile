FROM denoland/deno:latest

# Create working directory
WORKDIR /app

# Copy source
COPY deno.json .
COPY deno.lock .
COPY api .
COPY front .
COPY Shared .

RUN deno install


CMD["deno", "task", "start"]