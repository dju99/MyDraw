import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { io } from "socket.io-client";
import "../style/home.scss";
import { useDraw } from "../hooks/useDraw";
import { drawLine } from "../utils/drawLine";
import { useDispatch, useSelector } from "react-redux";
import { setColor, setLine } from "../redux/action";
import { RootState } from "../redux/reducer";

const socket = io("http://13.125.220.11:3000");
//http://localhost:3000

function Home() {
  const [saveData, setSaveData] = useState<string[]>([]);
  const [saveCount, setSaveCount] = useState<number>(-1);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
  const downloadRef = useRef<HTMLAnchorElement | null>(null);

  const dispatch = useDispatch();
  const color = useSelector((state: RootState) => state.color);
  const line = useSelector((state: RootState) => state.line);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.on("draw-line", ({ prevPoint, currentPoint, color, line }: DrawLineProps) => {
      if (!ctx) return;
      drawLine({ prevPoint, currentPoint, ctx, color, line });
    });

    socket.on("clear", () => {
      clear();
      Save();
    });

    return () => {
      socket.off("draw-line");
      socket.off("clear");
    };
  }, [clear, canvasRef]);

  useEffect(() => {
    Save();
  }, []);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, color, line });
    drawLine({ prevPoint, currentPoint, ctx, color, line });
  }

  const Save = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const newData = canvas.toDataURL();
      setSaveData((prevData) => [...prevData, newData]);
      setSaveCount((prevCount) => prevCount + 1);
    }
  };

  const Undo = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (saveCount > 0) {
      setSaveCount((prevCount) => prevCount - 1);
      const img = new Image();
      img.src = saveData[saveCount - 1];
      img.onload = () => {
        if (canvasRef.current && ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  };

  const Redo = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (saveCount < saveData.length - 1) {
      setSaveCount((prevCount) => prevCount + 1);
      const img = new Image();
      img.src = saveData[saveCount + 1];
      img.onload = () => {
        if (canvasRef.current && ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      if (downloadRef.current) {
        downloadRef.current.href = url;
        downloadRef.current.download = "canvas_image.png";
        downloadRef.current.click();
      }
    }
  };

  return (
    <div
      className="home"
      onClick={() => {
        setShowColorPicker(false);
      }}
    >
      <div className="toolbar">
        {/* Clear */}
        <svg onClick={() => socket.emit("clear")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(255, 255, 255)">
          <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
        </svg>
        {/* Undo */}
        <svg onClick={Undo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(255, 255, 255)">
          <path d="M8 7V11L2 6L8 1V5H13C17.4183 5 21 8.58172 21 13C21 17.4183 17.4183 21 13 21H4V19H13C16.3137 19 19 16.3137 19 13C19 9.68629 16.3137 7 13 7H8Z"></path>
        </svg>
        {/* Redo */}
        <svg onClick={Redo} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(255, 255, 255)">
          <path d="M16 7H11C7.68629 7 5 9.68629 5 13C5 16.3137 7.68629 19 11 19H20V21H11C6.58172 21 3 17.4183 3 13C3 8.58172 6.58172 5 11 5H16V1L22 6L16 11V7Z"></path>
        </svg>
        <div className="underline" />
        {/* Palette */}
        <svg
          className="palette"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="rgb(255, 255, 255)"
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
          }}
        >
          <path d="M12 2C17.5222 2 22 5.97778 22 10.8889C22 13.9556 19.5111 16.4444 16.4444 16.4444H14.4778C13.5556 16.4444 12.8111 17.1889 12.8111 18.1111C12.8111 18.5333 12.9778 18.9222 13.2333 19.2111C13.5 19.5111 13.6667 19.9 13.6667 20.3333C13.6667 21.2556 12.9 22 12 22C6.47778 22 2 17.5222 2 12C2 6.47778 6.47778 2 12 2ZM10.8111 18.1111C10.8111 16.0843 12.451 14.4444 14.4778 14.4444H16.4444C18.4065 14.4444 20 12.851 20 10.8889C20 7.1392 16.4677 4 12 4C7.58235 4 4 7.58235 4 12C4 16.19 7.2226 19.6285 11.324 19.9718C10.9948 19.4168 10.8111 18.7761 10.8111 18.1111ZM7.5 12C6.67157 12 6 11.3284 6 10.5C6 9.67157 6.67157 9 7.5 9C8.32843 9 9 9.67157 9 10.5C9 11.3284 8.32843 12 7.5 12ZM16.5 12C15.6716 12 15 11.3284 15 10.5C15 9.67157 15.6716 9 16.5 9C17.3284 9 18 9.67157 18 10.5C18 11.3284 17.3284 12 16.5 12ZM12 9C11.1716 9 10.5 8.32843 10.5 7.5C10.5 6.67157 11.1716 6 12 6C12.8284 6 13.5 6.67157 13.5 7.5C13.5 8.32843 12.8284 9 12 9Z"></path>
        </svg>
        {showColorPicker && (
          <div
            className="colorPicker"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ChromePicker color={color} onChange={(e: { hex: string }) => dispatch(setColor(e.hex))} />
          </div>
        )}
        {/* Eraser */}
        <svg
          onClick={() => {
            dispatch(setColor("#FFFFFF"));
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="rgb(255, 255, 255)"
        >
          <path d="M8.58564 8.85449L3.63589 13.8042L8.83021 18.9985L9.99985 18.9978V18.9966H11.1714L14.9496 15.2184L8.58564 8.85449ZM9.99985 7.44027L16.3638 13.8042L19.1922 10.9758L12.8283 4.61185L9.99985 7.44027ZM13.9999 18.9966H20.9999V20.9966H11.9999L8.00229 20.9991L1.51457 14.5113C1.12405 14.1208 1.12405 13.4877 1.51457 13.0971L12.1212 2.49053C12.5117 2.1 13.1449 2.1 13.5354 2.49053L21.3136 10.2687C21.7041 10.6592 21.7041 11.2924 21.3136 11.6829L13.9999 18.9966Z"></path>
        </svg>
        {/* Pen */}
        <svg
          onClick={() => {
            dispatch(setColor("#000000"));
            dispatch(setLine(5));
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="rgb(255, 255, 255)"
        >
          <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
        </svg>
        {/* Bold */}
        <svg
          onClick={() => {
            dispatch(setLine(15));
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="rgb(255, 255, 255)"
        >
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
        </svg>
        <div className="underline" />
        {/* Download */}
        <svg onClick={downloadImage} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(255, 255, 255)">
          <path d="M13 10H18L12 16L6 10H11V3H13V10ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z"></path>
        </svg>
      </div>
      <canvas width={3000} height={3000} ref={canvasRef} onMouseDown={onMouseDown} onMouseUp={Save} />
    </div>
  );
}

export default Home;
