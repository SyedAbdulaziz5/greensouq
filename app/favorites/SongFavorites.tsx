"use client";

import { useState, useEffect } from "react";
import { Music, Plus, Trash2, Loader2, X, AlertCircle, CheckCircle2, RefreshCw, Edit2, Save } from "lucide-react";

interface Song {
  id: string;
  songName: string;
  createdAt: string;
}

export default function SongFavorites() {
  const [songName, setSongName] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const fetchSongs = async () => {
    try {
      setIsFetching(true);
      setError("");
      const response = await fetch("/api/favorites/songs");
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to load songs (${response.status})`);
      }
      
      const data = await response.json();
      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load songs. Please try again.";
      setError(errorMessage);
      console.error("Error fetching songs:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songName.trim() || isLoading) return;

    setIsLoading(true);
    clearMessages();

    try {
      const response = await fetch("/api/favorites/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songName: songName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to add song (${response.status})`);
      }

      const data = await response.json();
      setSongs([data.song, ...songs]);
      setSongName("");
      setSuccess("Song added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add song. Please try again.";
      setError(errorMessage);
      console.error("Error adding song:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (deletingIds.has(songId)) return;

    setDeletingIds((prev) => new Set(prev).add(songId));
    clearMessages();

    try {
      const response = await fetch(`/api/favorites/songs?songId=${songId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to delete song (${response.status})`);
      }

      setSongs(songs.filter((song) => song.id !== songId));
      setSuccess("Song removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete song. Please try again.";
      setError(errorMessage);
      console.error("Error deleting song:", err);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(songId);
        return next;
      });
    }
  };

  const handleStartEdit = (song: Song) => {
    setEditingId(song.id);
    setEditValue(song.songName);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleSaveEdit = async (songId: string) => {
    if (!editValue.trim() || editValue.trim() === songs.find(s => s.id === songId)?.songName) {
      handleCancelEdit();
      return;
    }

    setIsSaving(true);
    clearMessages();

    try {
      const song = songs.find(s => s.id === songId);
      if (!song) return;

      await fetch(`/api/favorites/songs?songId=${songId}`, {
        method: "DELETE",
      });

      const response = await fetch("/api/favorites/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songName: editValue.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update song");
      }

      const data = await response.json();
      setSongs(songs.map(s => s.id === songId ? data.song : s));
      setEditingId(null);
      setEditValue("");
      setSuccess("Song updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update song. Please try again.");
      console.error("Error updating song:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button
            onClick={clearMessages}
            className="text-red-600 hover:text-red-800 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">{success}</p>
          </div>
          <button
            onClick={clearMessages}
            className="text-green-600 hover:text-green-800 transition-colors"
            aria-label="Dismiss success"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Add Favorite Song
        </h2>
        <form onSubmit={handleAddSong} className="flex gap-2">
          <input
            type="text"
            value={songName}
            onChange={(e) => {
              setSongName(e.target.value);
              clearMessages();
            }}
            placeholder="Enter song name..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !songName.trim()}
            className="flex items-center gap-2 cursor-pointer bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            My Favorite Songs
          </h2>
          {!isFetching && error && (
            <button
              onClick={fetchSongs}
              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 transition-colors"
              aria-label="Retry loading songs"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Retry</span>
            </button>
          )}
        </div>
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mb-3" />
            <p className="text-sm text-gray-600">Loading your favorite songs...</p>
          </div>
        ) : error && songs.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchSongs}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : songs.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No favorite songs yet. Add your first song above!</p>
          </div>
          ) : (
          <ul className="space-y-2">
            {songs.map((song) => {
              const isDeleting = deletingIds.has(song.id);
              const isEditing = editingId === song.id;
              return (
                <li
                  key={song.id}
                  className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-colors ${
                    isDeleting ? "opacity-50" : "hover:bg-gray-100"
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(song.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="flex-1 px-3 py-1.5 border border-green-500 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                        autoFocus
                        disabled={isSaving}
                      />
                      <button
                        onClick={() => handleSaveEdit(song.id)}
                        disabled={isSaving || !editValue.trim()}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                        aria-label="Save"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                        aria-label="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 flex-1">
                        <Music className="w-5 h-5 text-green-600 shrink-0" />
                        <span className="text-gray-900 font-medium">{song.songName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(song)}
                          disabled={isDeleting}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Edit song"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSong(song.id)}
                          disabled={isDeleting}
                          className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Delete song"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

