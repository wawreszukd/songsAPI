FROM golang:1.23

WORKDIR /app

COPY backend/go.mod .

COPY backend/* .

RUN go build -o main .

EXPOSE 5000

CMD ["./main"]
