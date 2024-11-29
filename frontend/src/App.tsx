import React from "react";
import "./App.css";
import Card from "./components/Card";
import SongItem from "./components/SongItem";
import { Song } from "./state/songSlice";
import { addSong, updateSong, deleteSong } from "./state/songSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./state/store";
function App(): React.ReactElement {
  const [inputValue, setInputValue] = React.useState("");
  const [editToggle, setEditToggle] = React.useState(false);
  const dispatch = useDispatch();
  const [editedSongId, setEditedSongId] = React.useState(-1);

  const Songs = useSelector((state: RootState) => state.songs.songs);
  const SubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/?q=${inputValue}`);
    const data = await response.json();
    const song = { id: Songs.length + 1, ...data };
    dispatch(addSong(song));
    console.log(song);
    setInputValue("");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleEditToggle = (songId: number) => {
    setEditedSongId(songId);
    setEditToggle(!editToggle);
  };
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/?q=${inputValue}`);
    const data = await response.json();
    const song = { id: editedSongId, ...data };
    dispatch(updateSong(song));
    setEditToggle(!editToggle);
    setInputValue("");
  };
  const handleRemove = (songId: number) => {
    dispatch(deleteSong(songId));
  };
  return (
    <>
      <Card>
        <div className="rounded border-slate-800 border-2 border-t-4 mb-2">
          {Songs.map((song: Song) => {
            return (
              <SongItem
                key={song.id}
                song={song}
                cb={handleEditToggle}
                rm={handleRemove}
              />
            );
          })}
        </div>
        <form
          onSubmit={editToggle ? handleEdit : SubmitForm}
          className="flex flex-col "
        >
          <input
            onChange={handleChange}
            value={inputValue}
            type="text"
            name="name"
            placeholder="Song Name"
            className="pb-1 pt-1 bg-slate-500 h-8 border-slate-800 border-2 border-y-0"
          />
          <button
            type="submit"
            className={
              "bg-slate-500 rounded-b h-8 border-slate-800 border-2 mt-2 rounded" +
              (editToggle ? ` bg-red-500` : ` bg-green-500`)
            }
          >
            {editToggle ? `Edit` : `Add song`}
          </button>
        </form>
      </Card>
    </>
  );
}

export default App;
