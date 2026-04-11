import { Trophy, User } from "lucide-react";

export const trendingNewsData = {
  mainImage:
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&h=450&fit=crop", // Soccer/football action image
  title: "5 things to look out for this international break",
  subtitle:
    "World Cup qualifiers and potential milestones await for those Gunners representing their countries",
  items: [
    {
      _id: '1',
      title: "The Dispatch: Carabao Cup, Kim Little and NLD",
      image:
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&h=300&fit=crop", // Stadium/cup image
      icon: Trophy,
      category: "Match Preview",
    },
    {
      _id: '2',
      title: "Olivia Smith: Tearing the Super League apart",
      image:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop", // Female football player
      icon: User,
      category: "Player Feature",
    },
    {
      _id: '3',
      title: "Soskode: Tearing the Super League apart",
      image:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop", // Female football player
      icon: User,
      category: "Player Feature",
    },
  ],
};
