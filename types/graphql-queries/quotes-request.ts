import type { QuoteModel } from '../quote.model';

export interface QuotesRequest {
  Quotes: {
    docs: QuoteModel[];
  };
}
