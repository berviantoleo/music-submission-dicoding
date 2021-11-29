import InvariantError from "../../../src/exceptions/InvariantError";
import SongService from "../../../src/services/db/SongService";
import CacheService from "../../../src/services/redis/CacheService";
import sequelize from "../../../src/sequelize";
import { SongRequest } from "../../../src/models/requests/SongRequest";
import NotFoundError from "../../../src/exceptions/NotFoundError";

jest.mock('../../../src/services/redis/CacheService');

let songService: SongService;

describe("SongService Test", () => {
  beforeAll(async () => {
    await sequelize.sync();
    const cacheService = new CacheService();
    songService = new SongService(cacheService, sequelize);
  });

  afterEach(async () => {
    await sequelize.truncate();
  })

  test("addSong test success", async () => {
    const songData: SongRequest = {
      title: "my-music-is-good",
      year: 2001,
      performer: "Berv Band",
      genre: "lo-fi",
      duration: 9999
    }
    const createdSongId = await songService.addSong(songData);
    expect(createdSongId).not.toBeNull();
  })

  test("getSongs test success", async () => {
    const songData: SongRequest = {
      title: "my-music-is-good",
      year: 2001,
      performer: "Berv Band",
      genre: "lo-fi",
      duration: 9999
    }
    await songService.addSong(songData);
    const allSong = await songService.getSongs();
    expect(allSong).toHaveLength(1);
    const firstData = allSong[0];
    expect(firstData.title).toBe(songData.title);
  })

  test("getSongById test success", async () => {
    const songData: SongRequest = {
      title: "my-music-is-good",
      year: 2001,
      performer: "Berv Band",
      genre: "lo-fi",
      duration: 9999
    }
    const createdSongId = await songService.addSong(songData);
    const foundedSong = await songService.getSongById(createdSongId);
    expect(foundedSong).not.toBeNull();
    expect(foundedSong.title).toBe(songData.title);
  })

  test("getSongById test failed", async () => {
    await expect(songService.getSongById('randomonly')).rejects.toThrow(InvariantError);
  })

  test("editSongById test success", async () => {
    const songData: SongRequest = {
      title: "my-music-is-good",
      year: 2001,
      performer: "Berv Band",
      genre: "lo-fi",
      duration: 9999
    }
    const createdSongId = await songService.addSong(songData);
    const updatedTitle = 'test-test-test';
    const editedData = Object.assign({}, songData);
    editedData.title = updatedTitle;
    await songService.editSongById(createdSongId, editedData);
    const foundedSong = await songService.getSongById(createdSongId);
    expect(foundedSong).not.toBeNull();
    expect(foundedSong.title).not.toBe(songData.title);
    expect(foundedSong.title).toBe(updatedTitle);
  })

  test("editSongById test failed", async () => {
    const songData: SongRequest = {
      title: "my-music-is-good",
      year: 2001,
      performer: "Berv Band",
      genre: "lo-fi",
      duration: 9999
    }
    await expect(songService.editSongById('randomonly', songData)).rejects.toThrow(InvariantError);
  })

  test("deleteSongById test success", async () => {
    const songData: SongRequest = {
      title: "my-music-is-good",
      year: 2001,
      performer: "Berv Band",
      genre: "lo-fi",
      duration: 9999
    }
    const createdSongId = await songService.addSong(songData);
    await expect(songService.deleteSongById(createdSongId)).resolves.not.toThrow();
  })

  test("deleteSongById test failed", async () => {
    await expect(songService.deleteSongById('randomonly')).rejects.toThrow(NotFoundError);
  })

})