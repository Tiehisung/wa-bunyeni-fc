

export interface ISelectOptionLV {
  value: string;
  label: string;
}

export type TConvertedFile = {
  name: string;
  type: string;
  path: string;
  bytes?: number;
};


export interface IDeleteFile {
  _id?: string; //Trace any saved file data on db
  public_id: string;
  resource_type?: string;
}

//Cloudinary
export enum EPresetType {
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated"
}

export enum EPreset {
  KFC_SIGNED = "kfc-signed",
  KFC_UNSIGNED = 'kfc-unsigned'
};
export type TResourceType = "image" | "video" | "audio" | "auto";
// export type TFolders = "images/logos" | "images" | "videos" | "audios";

export type IRecord<T = string | string[] | undefined> = Record<string, T>
export interface IQueryResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  pagination?: IPagination
}
export interface IPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
  params: Promise<Record<string, string | undefined>>;
  [k: string]: any
}

export interface IFormEvents<
  TSuccess = any,
  TError = any,
  TClose = any
> {
  onError?: (error?: TError) => void;
  onSuccess?: (data?: TSuccess) => void;
  onClose?: (data?: TClose) => void;
}
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;
}

export interface IQueryParams extends IBaseQueryParams {
  [k: string]: any
  status?: string
  role?: string,
  date?: string
  endDate?: string
  type?: string;
}
export interface IBaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}


export type TSearchKey =
  'search'
  | 'captain_search'
  | 'player_search'
  | 'manager_search'
  | 'match_search'
  | 'squad_search'
  | 'sponsor_search'
  | 'card_search'
  | 'injury_search'
  | 'news_search'
  | 'goal_search'
  | 'team_search'
  | 'gallery_search'
  | 'training_search'
  | 'transaction_search'
  | 'log_search'
  | 'doc_search'
  | 'highlight_search'
  | 'user_search'
  | 'mvp_search'