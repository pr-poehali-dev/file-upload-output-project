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
    <div className="bg-black/30 rounded-2xl p-6 border border-green-900/40 flex items-center gap-5 green-glow" style={{ backdropFilter: "blur(8px)" }}>
      <div className="w-11 h-11 rounded-xl bg-green-950/60 border border-green-800/30 flex items-center justify-center flex-shrink-0">
        <Icon name="File" size={20} className="text-green-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-green-700 mb-1 font-medium tracking-wide uppercase">{label}</p>
        <p className="font-medium text-[14px] truncate leading-snug text-green-100">{file.name}</p>
        <p className="text-xs text-green-700 mt-0.5">{file.size}</p>
      </div>
      <span className="text-xs font-semibold tracking-wider text-green-600 bg-green-950/60 border border-green-900/50 px-2 py-1 rounded-lg">
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
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center animate-fade-in">
          <Icon name="FileX" size={40} className="text-green-900 mx-auto mb-4" />
          <p className="text-green-700 mb-6">Файлы не найдены</p>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-green-600 hover:text-green-400 transition-colors underline underline-offset-4"
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl animate-fade-in">

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-green-800 hover:text-green-500 transition-colors mb-12 group"
        >
          <Icon name="ArrowLeft" size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Загрузить другие файлы
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-green-700 mb-6 font-medium" style={{ fontFamily: "'Unbounded', sans-serif" }}>
            <span className="w-8 h-px bg-green-900" />
            Результат
            <span className="w-8 h-px bg-green-900" />
          </div>
          <h1 className="text-4xl font-bold leading-[1.15] text-green-100">
            {converted ? "Готово к скачиванию" : "Ваши файлы"}
          </h1>
          <p className="text-green-600 mt-4 text-base">
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
          <div
            className="bg-black/30 rounded-2xl border border-green-900/40 p-6 mb-6 animate-fade-in"
            style={{ backdropFilter: "blur(8px)", animationDelay: "140ms" }}
          >
            <p className="text-sm font-medium text-green-600 mb-4">Конвертировать в формат</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {FORMAT_OPTIONS.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setTargetFormat(fmt)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${targetFormat === fmt
                      ? "bg-green-500 text-black green-glow-btn"
                      : "bg-green-950/40 text-green-600 border border-green-900/40 hover:border-green-700/60 hover:text-green-400"
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
                  ? "bg-green-500 text-black hover:bg-green-400 green-glow-btn"
                  : "bg-green-950/40 text-green-800 cursor-not-allowed border border-green-900/30"
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
            <div
              className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 mb-4 flex items-center gap-4"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <Icon name="CheckCircle" size={20} className="text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-green-200 font-medium text-[15px]">Файл готов</p>
                <p className="text-green-600 text-sm mt-0.5">Конвертирован в {targetFormat}</p>
              </div>
            </div>
            <button className="w-full py-4 rounded-2xl bg-green-500 text-black font-medium text-[15px] hover:bg-green-400 transition-colors green-glow-btn flex items-center justify-center gap-2">
              <Icon name="Download" size={18} />
              Скачать результат
            </button>
          </div>
        )}

        {!converted && (
          <div className="animate-fade-in" style={{ animationDelay: "180ms" }}>
            <button className="w-full py-4 rounded-2xl bg-transparent border border-green-900/50 font-medium text-[15px] text-green-600 hover:border-green-700/70 hover:text-green-400 transition-all flex items-center justify-center gap-2">
              <Icon name="Download" size={18} />
              Скачать без конвертации
            </button>
          </div>
        )}
      </div>
    </div>
  );
}