export default function SongItem({ song }) {
  return (
    <div className="song-item">
      <a href={song.url}>{song.track_name}</a>
    </div>
  );
}
