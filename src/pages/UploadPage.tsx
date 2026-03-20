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
          ? "border-foreground bg-foreground/5 scale-[1.01]"
          : file
          ? "border-foreground/40 bg-white"
          : "border-dashed border-foreground/20 hover:border-foreground/40 bg-white/60 hover:bg-white"
        }
      `}
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
          <div className="w-12 h-12 rounded-xl bg-foreground/8 flex items-center justify-center">
            <Icon name="FileCheck" size={22} />
          </div>
          <div className="text-center">
            <p className="font-medium text-[15px] leading-snug">{file.name}</p>
            <p className="text-sm text-foreground/40 mt-1">{file.size}</p>
          </div>
          <span className="text-xs text-foreground/30 mt-1">нажмите чтобы заменить</span>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-xl border border-dashed border-foreground/20 flex items-center justify-center group-hover:border-foreground/40 transition-colors">
            <Icon name="Upload" size={20} className="text-foreground/40 group-hover:text-foreground/60 transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-medium text-[15px]">Файл {index}</p>
            <p className="text-sm text-foreground/40 mt-1">{label}</p>
          </div>
          <span className="text-xs text-foreground/25">перетащите или нажмите</span>
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-xl animate-fade-in">

        <div className="mb-14 text-center" style={{ animationDelay: "0ms" }}>
          <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-foreground/30 mb-5 font-medium">
            <span className="w-6 h-px bg-foreground/20" />
            Конвертер файлов
            <span className="w-6 h-px bg-foreground/20" />
          </div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Загрузите файлы
          </h1>
          <p className="text-foreground/45 mt-3 text-[15px] leading-relaxed">
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
            <div className="flex-1 h-px bg-foreground/8" />
            <div className="w-7 h-7 rounded-full border border-foreground/12 flex items-center justify-center">
              <Icon name="Plus" size={12} className="text-foreground/25" />
            </div>
            <div className="flex-1 h-px bg-foreground/8" />
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
                ? "bg-foreground text-background hover:opacity-90 active:scale-[0.99]"
                : "bg-foreground/8 text-foreground/25 cursor-not-allowed"
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
              className="text-xs text-foreground/30 hover:text-foreground/50 transition-colors"
            >
              очистить всё
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
