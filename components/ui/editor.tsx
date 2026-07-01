"use client";

import { useEffect, useRef, useState } from "react";

interface CKEditorProps {
  value: string;
  onChange: (data: string) => void;
  minHeight?: number;
}

export function CKEditor({
  value,
  onChange,
  minHeight = 420,
}: CKEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  onChangeRef.current = onChange;

  useEffect(() => {
    if ((window as any).ClassicEditor) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !editorRef.current) return;

    const ClassicEditor = (window as any).ClassicEditor;
    if (!ClassicEditor) return;

    function MyCustomUploadAdapterPlugin(editor: any) {
      editor.plugins.get("FileRepository").createUploadAdapter = (
        loader: any,
      ) => ({
        upload: () =>
          loader.file.then(
            (file: File) =>
              new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append("file", file);

                fetch("/api/upload", { method: "POST", body: formData })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success && data.url) {
                      resolve({ default: data.url });
                    } else {
                      reject(data.error || "Tải ảnh lên thất bại");
                    }
                  })
                  .catch(reject);
              }),
          ),
        abort: () => {},
      });
    }

    ClassicEditor.create(editorRef.current, {
      extraPlugins: [MyCustomUploadAdapterPlugin],
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "|",
        "imageUpload",
        "insertTable",
        "mediaEmbed",
        "|",
        "undo",
        "redo",
      ],
    })
      .then((editor: any) => {
        editorInstanceRef.current = editor;
        editor.setData(value);

        editor.model.document.on("change:data", () => {
          onChangeRef.current(editor.getData());
        });
      })
      .catch((error: unknown) => {
        console.error("CKEditor initialization error:", error);
      });

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().then(() => {
          editorInstanceRef.current = null;
        });
      }
    };
  }, [scriptLoaded]);

  useEffect(() => {
    if (editorInstanceRef.current) {
      const currentData = editorInstanceRef.current.getData();
      if (value !== currentData) {
        editorInstanceRef.current.setData(value);
      }
    }
  }, [value]);

  return (
    <div
      className="blog-editor w-full"
      style={{ "--blog-editor-min-h": `${minHeight}px` } as React.CSSProperties}
    >
      <textarea ref={editorRef} style={{ display: "none" }} />
    </div>
  );
}
