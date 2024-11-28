import React from "react";
import "./App.css";
import Card from "./components/Card";
import SongItem from "./components/SongItem";
import { Song } from "./state/songSlice";
import { addSong } from "./state/songSlice";
import { useDispatch, useSelector } from "react-redux";
function App(): React.ReactElement {
  const [inputValue, setInputValue] = React.useState("");
  const dispatch = useDispatch();
  const Songs = useSelector((state: RootState) => state.songs.songs);
  const SubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/?q=${inputValue}`);
    const data = await response.json();
    const song = { id: Songs.length + 1, ...data };
    dispatch(addSong(song));
    console.log(song)
    setInputValue("");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <h1>XD</h1>
      <Card>
        {Songs.map((song: Song) => {
          return <SongItem key={song.id} song={song} />;
        })}
        <form onSubmit={SubmitForm}>
          <input
            onChange={handleChange}
            value={inputValue}
            type="text"
            name="name"
            placeholder="Song Name"
          />
          <button type="submit">Add Song</button>
        </form>
      </Card>
    </>
  );
}

export default App;
