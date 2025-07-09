package main

import (
	"database/sql"
	"log"
	"net/http"

	handlers "react/backend/internal/handlers"

	_ "github.com/lib/pq"
)

func runServer() {
	db, err := sql.Open("postgres", "user=postgres password=password dbname=actorsdb sslmode=disable")
	if err != nil {
		log.Println(err)
	}
	handlers.DB = db
	defer handlers.DB.Close()
	http.HandleFunc("/api/create", handlers.CreateActor)
	http.HandleFunc("/api/table", handlers.GetActors)
	http.HandleFunc("/api/table/", handlers.DeleteActorHandler)
	http.HandleFunc("/api/search", handlers.SearchActors)
	http.ListenAndServe("localhost:8080", nil)
}

func main() {
	runServer()
}
