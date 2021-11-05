import redis from 'redis';

class CacheService {
  private client: redis.RedisClient;
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_SERVER || "",
    });
    this.client.on('error', (error) => {
      console.error(error);
    });
  }

  set(key: string, value: string, expirationInSecond = 3600): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.client.set(key, value, 'EX', expirationInSecond, (error, ok) => {
        if (error) {
          return reject(error);
        }
        return resolve(ok || "OK");
      });
    });
  }

  get(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.client.get(key, (error, reply) => {
        if (error) {
          return reject(error);
        }
        if (reply === null) {
          return reject(new Error('Cache tidak ditemukan'));
        }
        return resolve(reply.toString());
      });
    });
  }

  delete(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.client.del(key, (error, count) => {
        if (error) {
          return reject(error);
        }
        console.log(`Deleted cache key: ${key}`);
        return resolve(count);
      });
    });
  }
}

export default CacheService;
