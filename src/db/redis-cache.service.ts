import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  cacheSet(key: string, value: string, ttl: number) {
    this.cacheManager
      .set(key, value)
      .then(() => {
        return ttl;
      })
      .catch((err) => {
        if (err) throw err;
      });
  }

  async cacheGet(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }
}
