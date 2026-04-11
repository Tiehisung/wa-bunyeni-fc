import { LucideProps } from "lucide-react";
import { IFileProps } from "./file.interface";
import { IMiniUser, IUser } from "./user";

export interface INewsProps {
  _id: string;
  slug: string;
  stats?: {
    isTrending: boolean;
    isLatest: boolean;
  };
  headline: {
    text: string;
    image: string;
    hasVideo?: boolean;
    sponsor?: Partial<IFileProps>;
  };
  details: {
    _id?: string;
    text?: string;
    media?: Partial<IFileProps>[];
  }[];
  metaDetails?: unknown; //ISquad etc
  isPublished?: boolean;
  type?: "squad" | "signing" | "match" | "training" | "general";
  summary?: string;
  tags?: string[];

  likes?: IInteraction[];
  views: IInteraction[];
  shares?: IInteraction[];
  comments?: IComment[];
  reactions?: number//sum likes,views,shares and comments

  createdAt: string;
  updatedAt: string;

  createdBy?: IMiniUser
  reporter?: IUser & { about?: string }

}

interface IInteraction {
  user?: IMiniUser;
  date: string;
  device: string;
  _id: string
}
export interface IComment extends IInteraction {
  comment: string;
}


export interface IPostNews {
  details: {
    text?: string;
    media?: IFileProps[];
  }[];

  headline: {
    text: string;
    image: string;
    hasVideo?: boolean;

  };
  sponsor?: Partial<IFileProps>;
}

export interface INewsItem {
  _id: string | number;
  title: string;
  image: string;
  category: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  slug?: string;
  excerpt?: string;
  date?: string;
  author?: string;
}
export interface INewsSection {
  tag?: string
  mainImage: string;
  title: string;
  subtitle: string;
  items: {
    _id: string | number;
    title: string;
    image: string;
    category: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    slug?: string;
    excerpt?: string;
    date?: string;
    author?: string;
  }[];
}