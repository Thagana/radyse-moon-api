class NewsResponse {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly source: string,
    public readonly author: string,
    public readonly url: string,
    public readonly urlToImage: string,
    public readonly dateCreated: string,
    public readonly category: string,
    public readonly description: string,
    public readonly publishedAt: string,
    public readonly country: string
  ) {}
}

/**
 * This is the News model it is decoupled from the entities
 */
export class News {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly source: string,
    public readonly author: string,
    public readonly url: string,
    public readonly urlToImage: string,
    public readonly dateCreated: string,
    public readonly category: string,
    public readonly description: string,
    public readonly publishedAt: string,
    public readonly country: string
  ) {}
  public response() {
    return new NewsResponse(
      this.id,
      this.title,
      this.source,
      this.author,
      this.url,
      this.urlToImage,
      this.dateCreated,
      this.category,
      this.description,
      this.publishedAt,
      this.country
    );
  }
}
