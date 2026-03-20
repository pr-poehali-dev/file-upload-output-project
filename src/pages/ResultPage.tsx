import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Icon from "@/components/ui/icon";

interface FileInfo {
  name: string;
  size: string;
}

const FORMAT_OPTIONS = ["PDF", "DOCX", "TXT", "PNG", "JPG", "CSV", "JSON", "XML"];

function getExtension(name: string): string {
  return name.split(".").pop()?.toUpperCase() || "—";
}

function FileCard({ file, label }: { file: FileInfo; label: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-foreground/8 flex items-center gap-5">
      <div className="w-11 h-11 rounded-xl bg-foreground/5 flex items-center justify-center flex-shrink-0">
        <Icon name="File" size={20} className="text-foreground/50" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground/35 mb-1 font-medium tracking-wide uppercase">{label}</p>
        <p className="font-medium text-[14px] truncate leading-snug">{file.name}</p>
        <p className="text-xs text-foreground/35 mt-0.5">{file.size}</p>
      </div>
      <span className="text-xs font-semibold tracking-wider text-foreground/30 bg-foreground/5 px-2 py-1 rounded-lg">
        {getExtension(file.name)}
      </span>
    </div>
  );
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { file1: FileInfo | null; file2: FileInfo | null } | null;

  const [targetFormat, setTargetFormat] = useState<string>("");
  const [converted, setConverted] = useState(false);
  const [loading, setLoading] = useState(false);

  const files = [state?.file1, state?.file2].filter(Boolean) as FileInfo[];

  if (!state || files.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <Icon name="FileX" size={40} className="text-foreground/20 mx-auto mb-4" />
          <p className="text-foreground/40 mb-6">Файлы не найдены</p>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-foreground/50 hover:text-foreground transition-colors underline underline-offset-4"
          >
            Вернуться к загрузке
          </button>
        </div>
      </div>
    );
  }

  const handleConvert = () => {
    if (!targetFormat) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConverted(true);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl animate-fade-in">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-foreground/35 hover:text-foreground/60 transition-colors mb-12 group"
        >
          <Icon name="ArrowLeft" size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Загрузить другие файлы
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-foreground/30 mb-5 font-medium">
            <span className="w-6 h-px bg-foreground/20" />
            Результат
            <span className="w-6 h-px bg-foreground/20" />
          </div>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            {converted ? "Готово к скачиванию" : "Ваши файлы"}
          </h1>
          <p className="text-foreground/40 mt-2 text-[15px]">
            {converted
              ? `Конвертировано в формат ${targetFormat}`
              : "Выберите формат для конвертации или скачайте как есть"}
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {state.file1 && (
            <div className="animate-fade-in" style={{ animationDelay: "60ms" }}>
              <FileCard file={state.file1} label="Файл 1" />
            </div>
          )}
          {state.file2 && (
            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <FileCard file={state.file2} label="Файл 2" />
            </div>
          )}
        </div>

        {!converted && (
          <div className="bg-white rounded-2xl border border-foreground/8 p-6 mb-6 animate-fade-in" style={{ animationDelay: "140ms" }}>
            <p className="text-sm font-medium text-foreground/60 mb-4">Конвертировать в формат</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {FORMAT_OPTIONS.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setTargetFormat(fmt)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${targetFormat === fmt
                      ? "bg-foreground text-background"
                      : "bg-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground/70"
                    }
                  `}
                >
                  {fmt}
                </button>
              ))}
            </div>
            <button
              onClick={handleConvert}
              disabled={!targetFormat || loading}
              className={`
                w-full py-3.5 rounded-xl font-medium text-[15px] transition-all duration-300
                ${targetFormat && !loading
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-foreground/8 text-foreground/25 cursor-not-allowed"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Конвертирую...
                </span>
              ) : targetFormat ? `Конвертировать в ${targetFormat}` : "Выберите формат"}
            </button>
          </div>
        )}

        {converted && (
          <div className="animate-scale-in">
            <div className="bg-foreground rounded-2xl p-6 mb-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center flex-shrink-0">
                <Icon name="CheckCircle" size={20} className="text-background" />
              </div>
              <div className="flex-1">
                <p className="text-background font-medium text-[15px]">Файл готов</p>
                <p className="text-background/50 text-sm mt-0.5">Конвертирован в {targetFormat}</p>
              </div>
            </div>
            <button className="w-full py-4 rounded-2xl bg-white border border-foreground/12 font-medium text-[15px] text-foreground hover:bg-foreground/4 transition-colors flex items-center justify-center gap-2">
              <Icon name="Download" size={18} />
              Скачать результат
            </button>
          </div>
        )}

        {!converted && (
          <div className="animate-fade-in" style={{ animationDelay: "180ms" }}>
            <button className="w-full py-4 rounded-2xl bg-white border border-foreground/12 font-medium text-[15px] text-foreground hover:bg-foreground/4 transition-colors flex items-center justify-center gap-2">
              <Icon name="Download" size={18} />
              Скачать без конвертации
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
