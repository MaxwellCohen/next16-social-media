"use client";

import { useRef, useState, useTransition } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postDrop } from "@/data/actions/drop";
import { cn } from "@/lib/utils";

type Props = {
  authorName: string;
  authorColor: string;
};

export function NewDropModal({ authorName, authorColor }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function close() {
    setOpen(false);
    setError(null);
    formRef.current?.reset();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Drop it</Button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-divider bg-white p-5 shadow-2xl dark:border-divider-dark dark:bg-black">
            <header className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold tracking-tight">
                New drop
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="text-gray rounded-full p-1 transition-colors hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <form
              ref={formRef}
              action={(formData: FormData) => {
                setError(null);
                startTransition(async () => {
                  const result = await postDrop(formData);
                  if (!result.ok) {
                    setError(result.error);
                    return;
                  }
                  close();
                });
              }}
              className="flex flex-col gap-3"
            >
              <div className="flex gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold uppercase text-white shadow-sm",
                    authorColor,
                  )}
                  aria-hidden
                >
                  {authorName.charAt(0)}
                </div>
                <textarea
                  name="body"
                  rows={4}
                  required
                  maxLength={280}
                  placeholder="What did you ship today?"
                  className="flex-1 resize-none"
                />
              </div>

              {error ? <p className="text-danger text-xs">{error}</p> : null}

              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={pending}>
                  {pending ? "Dropping…" : "Drop it"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
