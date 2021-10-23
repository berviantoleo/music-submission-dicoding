import PlaylistService from "../src/PlaylistService";
import { cleanUp } from "./helpers/playlist";

describe("PlaylistService Test", () => {
  afterEach(() => {
    cleanUp();
  });
  it("getSongsfromPlaylist Empty", async () => {
    const playlistService = new PlaylistService();
    const result = await playlistService.getSongsfromPlaylist("");
    expect(result).toEqual([]);
  });
});
