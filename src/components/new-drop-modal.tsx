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
      <Button
        variant="primary"
        className="w-full justify-center sm:w-auto"
        onClick={() => setOpen(true)}
      >
        Drop it
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="border-divider dark:border-divider-dark w-full max-w-lg border bg-white p-5 shadow-xl dark:bg-black">
            <header className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold tracking-tight uppercase">
                New drop
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={close}
                className="text-gray hover:text-black dark:hover:text-white"
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
                    "h-10 w-10 shrink-0 bg-gradient-to-br font-semibold uppercase text-white flex items-center justify-center",
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

              {error ? (
                <p className="text-danger text-xs">{error}</p>
              ) : null}

              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" onClick={close}>
                  Cancel
                </Button>
                <Button type="submit" disabled={pending}>
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
