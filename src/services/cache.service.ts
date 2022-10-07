import NodeCache from 'node-cache';

class CacheService {
  client: NodeCache;
  constructor() {
    this.client = new NodeCache({ stdTTL: 600 });
  }

  set(key: string, data: unknown) {
    this.client.set(key, data);
  }

  get<T>(key: string): T | undefined {
    return this.client.get(key);
  }
}

export default CacheService;
