package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"time"
)

type Track struct {
	TrackName string `json:"track_name"`
	Url       string `json:"url"`
}

func main() {
	clientId := os.Getenv("client_id")
	clientSecret := os.Getenv("client_secret")
	accesToken := ""
	go refreshToken(clientId, clientSecret, &accesToken)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handleGet(w, r, accesToken)
	})
	fmt.Println("Server is running on port 5000")
	http.ListenAndServe(":5000", nil)
}
func refreshToken(clientId string, clientSecret string, spotiToken *string) {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()
	for {
		token, err := getSpotifyToken(clientId, clientSecret)
		if err != nil {
			fmt.Println("Failed to get Spotify token: ", err)
		} else {
			*spotiToken = token
		}
		<-ticker.C
	}
}
func handleGet(w http.ResponseWriter, r *http.Request, accesToken string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "missing query parameter", http.StatusBadRequest)
		return
	}

	track, err := searchTrack(accesToken, query)
	if err != nil {
		http.Error(w, "failed to search track: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(track)
}
func getSpotifyToken(clientID, clientSecret string) (string, error) {
	// Prepare URL and form data
	tokenURL := "https://accounts.spotify.com/api/token"
	formData := url.Values{
		"grant_type":    {"client_credentials"},
		"client_id":     {clientID},
		"client_secret": {clientSecret},
	}

	// Create the HTTP request
	req, err := http.NewRequest("POST", tokenURL, bytes.NewBufferString(formData.Encode()))
	if err != nil {
		return "", err
	}

	// Set headers
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// Make the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Read and parse the response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var result map[string]interface{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		return "", err
	}

	// Extract the access token
	token, ok := result["access_token"].(string)
	if !ok {
		return "", fmt.Errorf("failed to parse access token")
	}

	return token, nil
}
func searchTrack(token string, query string) (*Track, error) {
	searchURL := fmt.Sprintf("https://api.spotify.com/v1/search?q=%s&type=track&market=PL&limit=1", url.QueryEscape(query))

	// Create request
	req, err := http.NewRequest("GET", searchURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token)

	// Make request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Parse response
	var result struct {
		Tracks struct {
			Items []struct {
				Name         string `json:"name"`
				ExternalURLs struct {
					Spotify string `json:"spotify"`
				} `json:"external_urls"`
			} `json:"items"`
		} `json:"tracks"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	// Extract track details
	if len(result.Tracks.Items) == 0 {
		return nil, fmt.Errorf("no tracks found for query: %s", query)
	}

	track := result.Tracks.Items[0]
	return &Track{
		TrackName: track.Name,
		Url:       track.ExternalURLs.Spotify,
	}, nil
}
