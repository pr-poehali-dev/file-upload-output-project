import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface FileWithPreview {
  file: File;
  name: string;
  size: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function FileDropZone({
  label,
  index,
  file,
  onFile,
}: {
  label: string;
  index: number;
  file: FileWithPreview | null;
  onFile: (f: File) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [onFile]
  );

  return (
    <div
      className={`
        relative group cursor-pointer select-none
        border transition-all duration-300 rounded-2xl p-10
        flex flex-col items-center justify-center gap-4 min-h-[220px]
        ${dragging
          ? "border-green-400/60 bg-green-950/20 scale-[1.01]"
          : file
          ? "border-green-500/30 bg-black/40 green-glow"
          : "border-dashed border-green-900/50 hover:border-green-500/40 bg-black/20 hover:bg-black/30"
        }
      `}
      style={{ backdropFilter: "blur(8px)" }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />

      {file ? (
        <>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Icon name="FileCheck" size={22} className="text-green-400" />
          </div>
          <div className="text-center">
            <p className="font-medium text-base leading-snug text-green-100">{file.name}</p>
            <p className="text-sm text-green-600 mt-1">{file.size}</p>
          </div>
          <span className="text-xs text-green-800 mt-1">нажмите чтобы заменить</span>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-xl border border-dashed border-green-800/50 flex items-center justify-center group-hover:border-green-500/50 transition-colors">
            <Icon name="Upload" size={20} className="text-green-700 group-hover:text-green-500 transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-base text-green-200">Файл {index}</p>
            <p className="text-sm text-green-700 mt-1">{label}</p>
          </div>
          <span className="text-xs text-green-900">перетащите или нажмите</span>
        </>
      )}
    </div>
  );
}

export default function UploadPage() {
  const [file1, setFile1] = useState<FileWithPreview | null>(null);
  const [file2, setFile2] = useState<FileWithPreview | null>(null);
  const navigate = useNavigate();

  const handleFile = (setter: (f: FileWithPreview) => void) => (f: File) => {
    setter({ file: f, name: f.name, size: formatSize(f.size) });
  };

  const handleSubmit = () => {
    if (!file1 && !file2) return;
    navigate("/result", {
      state: {
        file1: file1 ? { name: file1.name, size: file1.size } : null,
        file2: file2 ? { name: file2.name, size: file2.size } : null,
      },
    });
  };

  const canSubmit = file1 || file2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xl animate-fade-in">

        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-green-700 mb-6 font-medium" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            <span className="w-8 h-px bg-green-900" />
            Конвертер файлов
            <span className="w-8 h-px bg-green-900" />
          </div>
          <h1 className="text-4xl font-bold leading-[1.15] text-green-100">
            Загрузите файлы
          </h1>
          <p className="text-green-600 mt-4 text-base leading-relaxed">
            Один или два файла — преобразуем в нужный формат
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="animate-fade-in" style={{ animationDelay: "80ms" }}>
            <FileDropZone
              label="основной или исходный файл"
              index={1}
              file={file1}
              onFile={handleFile(setFile1)}
            />
          </div>

          <div className="flex items-center gap-4 py-1">
            <div className="flex-1 h-px bg-green-950" />
            <div className="w-7 h-7 rounded-full border border-green-900/60 flex items-center justify-center">
              <Icon name="Plus" size={12} className="text-green-800" />
            </div>
            <div className="flex-1 h-px bg-green-950" />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "140ms" }}>
            <FileDropZone
              label="дополнительный файл (опционально)"
              index={2}
              file={file2}
              onFile={handleFile(setFile2)}
            />
          </div>
        </div>

        <div className="mt-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
              w-full py-4 rounded-2xl font-medium text-[15px] transition-all duration-300
              ${canSubmit
                ? "bg-green-500 text-black hover:bg-green-400 green-glow-btn active:scale-[0.99]"
                : "bg-green-950/40 text-green-800 cursor-not-allowed border border-green-900/30"
              }
            `}
          >
            {canSubmit ? "Перейти к результату" : "Загрузите хотя бы один файл"}
          </button>
        </div>

        {(file1 || file2) && (
          <div className="mt-4 text-center animate-fade-in">
            <button
              onClick={() => { setFile1(null); setFile2(null); }}
              className="text-xs text-green-900 hover:text-green-700 transition-colors"
            >
              очистить всё
            </button>
          </div>
        )}
      </div>
    </div>
  );
}