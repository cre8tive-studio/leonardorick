export interface AllQuotesQuery {
  allQuote: {
    _id: string;
    text: {
      _key: string;
      value: string;
    }[];
  }[];
}
