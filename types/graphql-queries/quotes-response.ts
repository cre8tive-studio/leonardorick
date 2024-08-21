import type { QuoteModel } from '../quote.model';

export interface QuotesResponse {
  Quotes: {
    docs: QuoteModel[];
  };
}
