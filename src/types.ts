export interface TourStop {
  id: string;
  body?: string;
  line: number;
  relPath: string;
  repository: string;
  title: string;
  childStops: Array<{ tourId: string; stopNum: number }>;
}

export interface AbsoluteTourStop {
  id?: string;
  absPath: string;
  body?: string;
  line: number;
  title: string;
  childStops: Array<{ tourId: string; stopNum: number }>;
}

export type BrokenError = "FileNotFound" | "LineNotFound";

export interface BrokenTourStop {
  id: string;
  errors: BrokenError[];
  body?: string;
  title: string;
  childStops: Array<{ tourId: string; stopNum: number }>;
}

export function isNotBroken(
  obj: AbsoluteTourStop | BrokenTourStop,
): obj is AbsoluteTourStop {
  return (obj as BrokenTourStop).errors === undefined;
}

export interface TourStopPos {
  absPath: string;
  line: number;
}

export interface TourStopEdit {
  body?: string;
  title?: string;
}

export interface RepoState {
  repository: string;
  commit: string;
}

export interface TourFile {
  protocolVersion: string;
  generator?: number;
  id: string;
  repositories: RepoState[];
  stops: TourStop[];
  title: string;
  description: string;
  version: string;
}

export interface Tour {
  stops: Array<AbsoluteTourStop | BrokenTourStop>;
  title: string;
}

export interface RepoIndex {
  [key: string]: string;
}

export function validTourFile(obj: any): obj is TourFile {
  try {
    return [
      typeof obj.title === "string",
      typeof obj.version === "string",
      obj.stops.every(validTourStop),
      obj.repositories.every(validRepoState),
    ].reduce((x, y) => x && y, true);
  } catch (_) {
    return false;
  }
}

export function validTourStop(obj: any): obj is TourStop {
  try {
    return [
      typeof obj.title === "string",
      typeof obj.line === "number",
      typeof obj.relPath === "string",
      typeof obj.repository === "string",
    ].reduce((x, y) => x && y, true);
  } catch (_) {
    return false;
  }
}

export function validRepoState(obj: any): obj is RepoState {
  try {
    return [
      typeof obj.repository === "string",
      typeof obj.commit === "string",
    ].reduce((x, y) => x && y, true);
  } catch (_) {
    return false;
  }
}

export class TouristError extends Error {
  public code: number;
  public message: string;

  public repoName?: string;

  constructor(code: number, message: string, repoName?: string) {
    super(message);
    Object.setPrototypeOf(this, TouristError.prototype);
    this.code = code;
    this.message = message;
    this.repoName = repoName;
  }
}
