export interface AllQuotesQuery {
  allQuote: {
    _id: string;
    author: {
      name: string;
    };
    text: {
      _key: string;
      value: string;
    }[];
  }[];
}
