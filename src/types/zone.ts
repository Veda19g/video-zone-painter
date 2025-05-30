
export interface Point {
  x: number;
  y: number;
}

export interface Zone {
  id: string;
  name: string;
  points: Point[];
  color: string;
}
