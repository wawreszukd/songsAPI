import { Song } from "../state/songSlice";
import LinkIcon from "../assets/link.svg";
import Edit from "../assets/edit.svg";
import Remove from "../assets/remove.svg";
export default function SongItem({
  song,
  cb,
  rm,
}: {
  song: Song;
  cb: (songId: number) => void;
  rm: (songId: number) => void;
}): React.ReactElement {
  return (
    <div className="song-item bg-slate-400 text-gray-500 border-b-2 border-slate-800 flex justify-between">
      <a className="flex" href={song.url} target="_blank">
        <img alt="link" className="h-5" src={LinkIcon} />
        {song.track_name}
      </a>
      <div className="flex-row flex">
        <img
          src={Edit}
          onClick={() => cb(song.id)}
          alt="edit"
          className="h-5 hover:cursor-pointer"
        />
        <img
          src={Remove}
          onClick={() => rm(song.id)}
          alt="edit"
          className="h-5 hover:cursor-pointer"
        />
      </div>
    </div>
  );
}
