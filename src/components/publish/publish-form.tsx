"use client";

// ============================================================================
// Formulario de publicación de notas (/publicar). Flujo en tres pasos al
// enviar: 1) sube la imagen destacada a /api/media, 2) resuelve cada tag a
// su ID vía /api/tags y 3) crea la nota con /api/publicar. Incluye:
//   - Imagen con arrastrar y soltar + vista previa.
//   - Tags tipo "chips" (Enter agrega, × elimina).
//   - Editor contentEditable con barra flotante de formato (negrita,
//     itálica, cita y enlace) que aparece al seleccionar texto.
//   - Validación visual de campos obligatorios y pantalla de éxito.
// ============================================================================

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/** Opción del selector de categorías (respuesta de /api/categorias). */
type WpCategoryOption = {
  id: number;
  name: string;
};

/** Respuesta de /api/publicar: URL pública de la nota creada. */
type PublishResult = {
  url: string;
};

/** Posición de la barra flotante relativa al contenedor del editor. */
type ToolbarPosition = {
  top: number;
  left: number;
};

/** Extrae el mensaje de error del cuerpo JSON de una respuesta fallida. */
async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? `Error ${response.status}`;
  } catch {
    return `Error ${response.status}`;
  }
}

export function PublishForm() {
  // --- Datos del formulario ---
  const [categories, setCategories] = useState<WpCategoryOption[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // --- Estado del envío ---
  const [publishing, setPublishing] = useState(false);
  const [step, setStep] = useState<string | null>(null); // paso actual mostrado en el botón
  const [result, setResult] = useState<PublishResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [invalid, setInvalid] = useState<{
    title?: boolean;
    category?: boolean;
    body?: boolean;
  }>({});

  // El cuerpo se edita en un div contentEditable (no controlado por React);
  // su HTML se lee directamente del DOM al publicar.
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [toolbar, setToolbar] = useState<ToolbarPosition | null>(null);

  // Carga las categorías reales de WordPress al montar el formulario
  useEffect(() => {
    fetch("/api/categorias")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: WpCategoryOption[]) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // Libera la URL de la vista previa al desmontar o reemplazar la imagen
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /** Acepta un archivo (del input o de arrastrar y soltar) si es imagen. */
  const acceptFile = useCallback(
    (selected: File | undefined | null) => {
      if (!selected || !selected.type.startsWith("image/")) {
        return;
      }
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    },
    [preview],
  );

  /**
   * Recalcula la posición de la barra flotante de formato.
   * Se muestra centrada sobre el texto seleccionado; si no hay selección
   * (o está fuera del editor) se oculta.
   */
  const updateToolbar = useCallback(() => {
    const selection = window.getSelection();
    const editor = editorRef.current;
    const container = containerRef.current;

    if (
      !selection ||
      selection.isCollapsed ||
      !editor ||
      !container ||
      !editor.contains(selection.anchorNode)
    ) {
      setToolbar(null);
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setToolbar({
      top: rect.top - containerRect.top - 46,
      left: Math.max(
        0,
        rect.left - containerRect.left + rect.width / 2 - 80,
      ),
    });
  }, []);

  /**
   * Aplica formato al texto seleccionado. Se usa document.execCommand:
   * aunque está marcado como obsoleto, sigue siendo el mecanismo más
   * simple y compatible para editores contentEditable ligeros.
   */
  const applyFormat = (command: string) => {
    if (command === "createLink") {
      const url = window.prompt("URL del enlace:");
      if (!url) {
        return;
      }
      document.execCommand(command, false, url);
    } else if (command === "blockquote") {
      document.execCommand("formatBlock", false, "blockquote");
    } else {
      document.execCommand(command, false);
    }
    updateToolbar();
  };

  /** Agrega el tag escrito a la lista (ignorando duplicados). */
  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.some((tag) => tag.toLowerCase() === value.toLowerCase())) {
      setTags([...tags, value]);
    }
    setTagInput("");
  };

  /** Restablece todo el formulario ("Publicar otra nota"). */
  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
    setExcerpt("");
    setCategoryId("");
    setTags([]);
    setTagInput("");
    setResult(null);
    setError(null);
    setInvalid({});
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  /** Orquesta el flujo completo de publicación (validar → media → tags → post). */
  const handlePublish = async () => {
    const bodyHtml = editorRef.current?.innerHTML.trim() ?? "";
    // innerHTML puede contener etiquetas vacías; textContent confirma
    // que realmente hay texto escrito
    const bodyEmpty =
      !bodyHtml || editorRef.current?.textContent?.trim() === "";

    const validation = {
      title: !title.trim(),
      category: categoryId === "",
      body: bodyEmpty,
    };
    setInvalid(validation);

    if (validation.title || validation.category || validation.body) {
      setError("Completa los campos obligatorios marcados en rojo.");
      return;
    }

    setPublishing(true);
    setError(null);

    try {
      // 1. Subir imagen destacada (opcional)
      let featuredMediaId: number | undefined;
      if (file) {
        setStep("Subiendo imagen...");
        const formData = new FormData();
        formData.append("file", file);
        const mediaResponse = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });
        if (!mediaResponse.ok) {
          throw new Error(await readError(mediaResponse));
        }
        const media = (await mediaResponse.json()) as { id: number };
        featuredMediaId = media.id;
      }

      // 2. Resolver cada tag a su ID de WordPress (se crea si no existe)
      const tagIds: number[] = [];
      for (const tag of tags) {
        setStep(`Procesando tag "${tag}"...`);
        const tagResponse = await fetch(
          `/api/tags?name=${encodeURIComponent(tag)}`,
        );
        if (!tagResponse.ok) {
          throw new Error(await readError(tagResponse));
        }
        const tagData = (await tagResponse.json()) as { id: number };
        tagIds.push(tagData.id);
      }

      // 3. Crear la nota en WordPress con todo lo anterior
      setStep("Publicando nota...");
      const publishResponse = await fetch("/api/publicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          excerpt: excerpt.trim(),
          content: bodyHtml,
          categoryId,
          tags: tagIds,
          featuredMediaId,
        }),
      });

      if (!publishResponse.ok) {
        throw new Error(await readError(publishResponse));
      }

      const published = (await publishResponse.json()) as PublishResult;
      setResult(published);
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "Error desconocido al publicar.",
      );
    } finally {
      setPublishing(false);
      setStep(null);
    }
  };

  // Pantalla de éxito: sustituye el formulario tras publicar
  if (result) {
    return (
      <div className="animate-fade-up mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </span>
        <h2 className="mt-6 font-helvetica text-2xl font-bold text-n33-blue">
          ¡Nota publicada!
        </h2>
        <p className="mt-2 text-n33-muted">
          La nota ya está disponible en el sitio.
        </p>
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 rounded-[9px] bg-n33-blue px-6 py-3 text-[13px] font-bold uppercase text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          Ver la nota publicada
        </a>
        <button
          type="button"
          onClick={resetForm}
          className="mt-4 cursor-pointer text-sm font-medium text-n33-primary underline-offset-2 hover:underline"
        >
          Publicar otra nota
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-helvetica text-3xl font-bold text-n33-blue">
        Publicar nota
      </h1>
      <p className="mt-2 text-sm text-n33-muted">
        Los campos marcados con * son obligatorios.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {/* Imagen destacada */}
        <div>
          <span className="mb-2 block text-sm font-bold text-n33-foreground">
            Imagen destacada
          </span>
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              acceptFile(event.dataTransfer.files?.[0]);
            }}
            className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-white transition-all duration-300 ${
              dragging
                ? "border-n33-blue bg-n33-blue/5"
                : "border-n33-border hover:border-n33-blue/60"
            }`}
          >
            {preview ? (
              <Image
                src={preview}
                alt="Vista previa de la imagen destacada"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="px-4 text-center text-sm text-n33-muted">
                Arrastra la imagen aquí o haz click para seleccionarla
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => acceptFile(event.target.files?.[0])}
            />
          </label>
          {file && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="mt-2 cursor-pointer text-xs font-medium text-n33-primary hover:underline"
            >
              Quitar imagen
            </button>
          )}
        </div>

        {/* Título */}
        <div>
          <label
            htmlFor="pub-title"
            className="mb-2 block text-sm font-bold text-n33-foreground"
          >
            Título *
          </label>
          <input
            id="pub-title"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setInvalid((prev) => ({ ...prev, title: false }));
            }}
            className={`h-[46px] w-full rounded-xl border bg-white px-4 shadow-sm outline-none ring-n33-blue transition-all duration-300 focus:shadow-md focus:ring-2 ${
              invalid.title ? "border-n33-primary ring-1 ring-n33-primary" : "border-n33-border"
            }`}
          />
        </div>

        {/* Subtítulo */}
        <div>
          <label
            htmlFor="pub-excerpt"
            className="mb-2 block text-sm font-bold text-n33-foreground"
          >
            Subtítulo o resumen breve
          </label>
          <input
            id="pub-excerpt"
            type="text"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            className="h-[46px] w-full rounded-xl border border-n33-border bg-white px-4 shadow-sm outline-none ring-n33-blue transition-all duration-300 focus:shadow-md focus:ring-2"
          />
        </div>

        {/* Categoría */}
        <div>
          <label
            htmlFor="pub-category"
            className="mb-2 block text-sm font-bold text-n33-foreground"
          >
            Categoría *
          </label>
          <select
            id="pub-category"
            value={categoryId}
            onChange={(event) => {
              setCategoryId(Number(event.target.value) || "");
              setInvalid((prev) => ({ ...prev, category: false }));
            }}
            className={`h-[46px] w-full cursor-pointer rounded-xl border bg-white px-4 shadow-sm outline-none ring-n33-blue transition-all duration-300 focus:shadow-md focus:ring-2 ${
              invalid.category ? "border-n33-primary ring-1 ring-n33-primary" : "border-n33-border"
            }`}
          >
            <option value="">Selecciona una categoría...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="pub-tags"
            className="mb-2 block text-sm font-bold text-n33-foreground"
          >
            Tags
          </label>
          <input
            id="pub-tags"
            type="text"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTag();
              }
            }}
            placeholder="Escribe un tag y presiona Enter"
            className="h-[46px] w-full rounded-xl border border-n33-border bg-white px-4 shadow-sm outline-none ring-n33-blue transition-all duration-300 placeholder:text-n33-muted focus:shadow-md focus:ring-2"
          />
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full bg-n33-blue px-3 py-1 text-xs font-bold text-white shadow-sm"
                >
                  {tag}
                  <button
                    type="button"
                    aria-label={`Eliminar tag ${tag}`}
                    onClick={() => setTags(tags.filter((item) => item !== tag))}
                    className="cursor-pointer text-white/80 transition-colors hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cuerpo */}
        <div>
          <span className="mb-2 block text-sm font-bold text-n33-foreground">
            Cuerpo de la nota *
          </span>
          <p className="mb-2 text-xs text-n33-muted">
            Selecciona texto para aplicar formato: negrita, itálica, cita o
            enlace.
          </p>
          <div ref={containerRef} className="relative">
            {toolbar && (
              <div
                style={{ top: toolbar.top, left: toolbar.left }}
                className="animate-menu-down absolute z-10 flex items-center gap-1 rounded-lg bg-n33-foreground/95 p-1 shadow-xl backdrop-blur-sm"
              >
                <button
                  type="button"
                  title="Negrita"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    applyFormat("bold");
                  }}
                  className="size-8 cursor-pointer rounded font-bold text-white transition-colors hover:bg-white/20"
                >
                  N
                </button>
                <button
                  type="button"
                  title="Itálica"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    applyFormat("italic");
                  }}
                  className="size-8 cursor-pointer rounded italic text-white transition-colors hover:bg-white/20"
                >
                  I
                </button>
                <button
                  type="button"
                  title="Cita"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    applyFormat("blockquote");
                  }}
                  className="size-8 cursor-pointer rounded text-white transition-colors hover:bg-white/20"
                >
                  ❝
                </button>
                <button
                  type="button"
                  title="Enlace"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    applyFormat("createLink");
                  }}
                  className="size-8 cursor-pointer rounded text-white transition-colors hover:bg-white/20"
                >
                  🔗
                </button>
              </div>
            )}
            <div
              ref={editorRef}
              contentEditable
              role="textbox"
              aria-multiline="true"
              aria-label="Cuerpo de la nota"
              onMouseUp={updateToolbar}
              onKeyUp={updateToolbar}
              onBlur={() => setTimeout(() => setToolbar(null), 150)}
              onInput={() => setInvalid((prev) => ({ ...prev, body: false }))}
              className={`prose-n33 min-h-[280px] w-full rounded-xl border bg-white p-4 shadow-sm outline-none ring-n33-blue transition-all duration-300 focus:shadow-md focus:ring-2 ${
                invalid.body ? "border-n33-primary ring-1 ring-n33-primary" : "border-n33-border"
              }`}
            />
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-n33-primary/10 px-4 py-3 text-sm font-medium text-n33-primary-dark">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={publishing}
          onClick={handlePublish}
          className="h-[50px] cursor-pointer rounded-[9px] bg-n33-primary text-[14px] font-bold uppercase text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-n33-primary-dark hover:shadow-[0_14px_30px_-8px_rgba(243,61,91,0.6)] active:translate-y-0 active:scale-95 disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {publishing ? (step ?? "Publicando...") : "Publicar nota"}
        </button>
      </div>
    </div>
  );
}
