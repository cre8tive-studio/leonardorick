export interface AllRecommendationsQuery {
  allRecommendation: {
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
