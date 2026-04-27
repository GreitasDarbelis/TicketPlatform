FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Start Vite dev server with host enabled so it's accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]
