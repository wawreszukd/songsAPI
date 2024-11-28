FROM golang:1.23-alpine

WORKDIR /app

COPY backend/go.mod ./
RUN go mod download


COPY ./backend/* .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

RUN chmod +x main
EXPOSE 8080

# Run
CMD ["./main"]