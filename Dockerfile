FROM node:22-alpine

WORKDIR /app

COPY .output .output

ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=80

EXPOSE 80

CMD ["node", ".output/server/index.mjs"]
