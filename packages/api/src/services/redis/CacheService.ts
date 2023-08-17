import { createClient } from 'redis';

class CacheService {
  private client;
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_SERVER || "",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.client.on('error', (error: any) => {
      console.log(error);
    });
  }

  async set(key: string, value: string, expirationInSecond = 3600): Promise<void> {
    await this.client.connect();
    await this.client.set(key, value, {
      EX: expirationInSecond,
    });
    await this.client.disconnect();
  }

  async get(key: string): Promise<string> {
    await this.client.connect();
    const value = await this.client.get(key);
    if (value === null) {
      throw new Error('Cache tidak ditemukan');
    }
    await this.client.disconnect();
    return value;
  }

  async delete(key: string): Promise<number> {
    await this.client.connect();
    const result = await this.client.del(key);
    await this.client.disconnect();
    return result;
  }
}

export default CacheService;
