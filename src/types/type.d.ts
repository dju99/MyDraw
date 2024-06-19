type Point = { x: number; y: number };

type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

type DrawLineProps = {
  ctx: CanvasRenderingContext2D;
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
  line: number;
};
