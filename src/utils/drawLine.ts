export const drawLine = ({ prevPoint, currentPoint, ctx, color, line }: DrawLineProps) => {
  const { x: currX, y: currY } = currentPoint;
  const lineColor = color;
  const lineWidth = line;

  let startPoint = prevPoint ?? currentPoint;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();
};
