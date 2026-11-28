"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Panel, Field, inputClass } from "@/components/kitchen-shell";
import { saveSettings } from "@/modules/team/actions";
import type { WorkspaceSettings } from "@/modules/team/types";

export function TeamSettings({
  initialSettings,
}: {
  initialSettings: WorkspaceSettings;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  function setField<K extends keyof WorkspaceSettings>(
    key: K,
    value: WorkspaceSettings[K],
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
    setFeedback(null);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setFeedback(null);
    startTransition(async () => {
      try {
        const result = await saveSettings(settings);
        if (!result.ok) {
          setFeedback({ ok: false, message: result.error });
          return;
        }
        setSettings(result.data);
        setFeedback({ ok: true, message: "Settings saved." });
      } catch {
        setFeedback({
          ok: false,
          message: "Could not save settings. Try again.",
        });
      }
    });
  }

  return (
    <Panel>
      <h3 className="font-serif text-xl font-bold">Settings</h3>

      <form onSubmit={submit} className="mt-5" aria-busy={pending}>
        <fieldset disabled={pending} className="flex min-w-0 flex-col gap-5">
          <Field label="Workspace name">
            <input
              className={inputClass}
              value={settings.workspaceName}
              onChange={(event) =>
                setField("workspaceName", event.target.value)
              }
            />
          </Field>

          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              <strong>Daily prep reminders</strong>

              <small className="mt-1 block text-xs text-muted-foreground">
                Notify the team about upcoming prep.
              </small>
            </span>

            <input
              type="checkbox"
              checked={settings.prepRemindersEnabled}
              onChange={(event) =>
                setField("prepRemindersEnabled", event.target.checked)
              }
              className="accent-accent"
            />
          </label>

          <label className="flex items-center justify-between gap-4 text-sm">
            <span>
              <strong>Require admin approval</strong>

              <small className="mt-1 block text-xs text-muted-foreground">
                For new purchase orders.
              </small>
            </span>

            <input
              type="checkbox"
              checked={settings.requirePoApproval}
              onChange={(event) =>
                setField("requirePoApproval", event.target.checked)
              }
              className="accent-accent"
            />
          </label>

          <button
            type="submit"
            className="self-start rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:brightness-95 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save settings"}
          </button>
        </fieldset>
        {feedback && (
          <p
            className={`mt-3 text-sm ${feedback.ok ? "text-muted-foreground" : "text-destructive"}`}
            role={feedback.ok ? "status" : "alert"}
          >
            {feedback.message}
          </p>
        )}
      </form>
    </Panel>
  );
}
