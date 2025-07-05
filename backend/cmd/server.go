package main

// import (
// 	"encoding/json"
// 	"log"
// 	"net/http"
// 	"strconv"
// 	"strings"
// )

// type Actor struct {
// 	Id         int    `json:"id"`
// 	Familyname string `json:"familyname"`
// 	Givenname  string `json:"givenname"`
// 	Nation     string `json:"nation"`
// 	Number     string `json:"number"`
// 	Honorar    string `json:"honorar"`
// }

// // Пример базы данных актеров
// var actors = []Actor{
// 	{Id: 1, Familyname: "Ди Каприо", Givenname: "Леонардо", Nation: "США", Number: "45", Honorar: "250000000"},
// 	{Id: 2, Familyname: "Питт", Givenname: "Брэд", Nation: "США", Number: "60", Honorar: "300000000"},
// 	{Id: 3, Familyname: "Джоли", Givenname: "Анджелина", Nation: "США", Number: "40", Honorar: "280000000"},
// 	{Id: 4, Familyname: "Харди", Givenname: "Том", Nation: "Великобритания", Number: "35", Honorar: "150000000"},
// }

// func searchActors(w http.ResponseWriter, r *http.Request) {
// 	query := strings.ToLower(r.URL.Query().Get("q"))
// 	minMovies, _ := strconv.Atoi(r.URL.Query().Get("minMovies"))
// 	minHonorar, _ := strconv.Atoi(r.URL.Query().Get("minHonorar"))
// 	nation := strings.ToLower(r.URL.Query().Get("nation"))

// 	var results []Actor

// 	for _, actor := range actors {
// 		// Проверка поискового запроса
// 		matchesQuery := query == "" ||
// 			strings.Contains(strings.ToLower(actor.Familyname), query) ||
// 			strings.Contains(strings.ToLower(actor.Givenname), query) ||
// 			strings.Contains(strings.ToLower(actor.Nation), query)

// 		// Проверка минимального числа фильмов
// 		actorMovies, _ := strconv.Atoi(actor.Number)
// 		matchesMovies := minMovies == 0 || actorMovies >= minMovies

// 		// Проверка минимального гонорара
// 		actorHonorar, _ := strconv.Atoi(actor.Honorar)
// 		matchesHonorar := minHonorar == 0 || actorHonorar >= minHonorar

// 		// Проверка национальности
// 		matchesNation := nation == "" || strings.Contains(strings.ToLower(actor.Nation), nation)

// 		if matchesQuery && matchesMovies && matchesHonorar && matchesNation {
// 			results = append(results, actor)
// 		}
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	json.NewEncoder(w).Encode(results)
// }

// func main() {
// 	http.HandleFunc("/api/actors/search", searchActors)
// 	log.Println("Сервер актеров запущен на :8080")
// 	log.Fatal(http.ListenAndServe(":8080", nil))
// }
