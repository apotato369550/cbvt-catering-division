'use client'

import { Bot, ChevronLeft, MessageCircle, Pencil, Plus, Send, Sparkles, Trash2, X } from 'lucide-react'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'

type Preview = { title: string; detail: string; action: string }
type ChatMessage = { id: string; role: 'assistant' | 'user'; text: string; time: string; preview?: Preview }
type ChatSession = { id: string; title: string; messages: ChatMessage[] }

const now = () => 'Just now'
const initialChats: ChatSession[] = [
  { id: 'daily-brief', title: 'Today’s kitchen brief', messages: [
    { id: 'a1', role: 'assistant', time: '9:12 AM', text: 'Good morning, Juan. Production is 78% complete. Sauce base is in progress, while vegetable prep and dinner mise en place are queued.' },
    { id: 'u1', role: 'user', time: '9:13 AM', text: 'What should the team focus on next?' },
    { id: 'a2', role: 'assistant', time: '9:13 AM', text: 'Prioritize vegetable prep before the 11:30 slot, then confirm the dinner mise en place quantity. That keeps the queued work moving before the afternoon handoff.', preview: { title: 'Production log preview', detail: 'Draft a follow-up note for Vegetable prep at 11:30 AM.', action: 'Preview only' } },
  ] },
  { id: 'orders', title: 'Order follow-ups', messages: [
    { id: 'a3', role: 'assistant', time: 'Yesterday', text: 'Four purchase orders are arriving today. PO-2048 from Fresh Fields Supply is currently marked In transit and due at 2:00 PM.', preview: { title: 'Follow-up draft', detail: 'Ask Fresh Fields Supply to confirm its expected arrival time for PO-2048.', action: 'Preview only' } },
  ] },
  { id: 'consumption', title: 'Consumption review', messages: [
    { id: 'a4', role: 'assistant', time: 'Mon', text: 'I can summarize recorded consumption entries by material or date. The current prototype does not track stock on hand or infer ingredient usage from production.' },
  ] },
]

const prompts = ['What should we focus on next?', 'Summarize today’s production', 'Which orders need follow-up?']

function replyFor(prompt: string): Omit<ChatMessage, 'id' | 'time'> {
  const input = prompt.toLowerCase()
  if (input.includes('order') || input.includes('delivery') || input.includes('follow')) return { role: 'assistant', text: 'PO-2048 is due today at 2:00 PM and is marked In transit. The other visible orders are confirmed for tomorrow and awaiting confirmation. I’d follow up on PO-2048 first.', preview: { title: 'Follow-up draft', detail: 'Draft a vendor message requesting an updated arrival time for PO-2048.', action: 'Preview only' } }
  if (input.includes('production') || input.includes('focus') || input.includes('prep')) return { role: 'assistant', text: 'Today’s visible prep completion is 78%. Vegetable prep is the next queued item at 11:30, followed by dinner mise en place at 14:00. Keep those handoffs on schedule.', preview: { title: 'Production note preview', detail: 'Draft a progress note for the next queued production batch.', action: 'Preview only' } }
  if (input.includes('consumption') || input.includes('material') || input.includes('inventory') || input.includes('stock')) return { role: 'assistant', text: 'I can review recorded material-consumption logs, but this workspace does not calculate stock on hand or convert materials into production quantities. Ask for a material and date range when live data is connected.' }
  return { role: 'assistant', text: 'I can help review production logs, recorded material consumption, and purchase-order follow-ups. For this UI prototype, my recommendations are based on sample workspace data and do not change any records.' }
}

export function SebbyChat() {
  const [open, setOpen] = useState(false)
  const [showChats, setShowChats] = useState(false)
  const [chats, setChats] = useState(initialChats)
  const [activeId, setActiveId] = useState(initialChats[0].id)
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [titleDraft, setTitleDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const activeChat = useMemo(() => chats.find(chat => chat.id === activeId) ?? chats[0], [activeId, chats])

  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }; window.addEventListener('keydown', onKeyDown); return () => window.removeEventListener('keydown', onKeyDown) }, [])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100) }, [open])

  const createChat = () => {
    const id = `chat-${Date.now()}`
    const chat: ChatSession = { id, title: 'New conversation', messages: [{ id: `${id}-welcome`, role: 'assistant', time: now(), text: 'Hi, I’m Sebby. Ask me about today’s production, recorded material use, or purchase-order follow-ups.' }] }
    setChats(current => [chat, ...current]); setActiveId(id); setShowChats(false)
  }
  const deleteChat = (id: string) => {
    setChats(current => { const next = current.filter(chat => chat.id !== id); if (id === activeId && next[0]) setActiveId(next[0].id); return next })
  }
  const submit = (event: FormEvent) => {
    event.preventDefault(); const message = draft.trim(); if (!message || !activeChat) return
    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: message, time: now() }
    const reply = { ...replyFor(message), id: `a-${Date.now()}`, time: now() }
    setChats(current => current.map(chat => chat.id === activeChat.id ? { ...chat, title: chat.title === 'New conversation' ? message.slice(0, 32) : chat.title, messages: [...chat.messages, userMessage, reply] } : chat))
    setDraft('')
  }
  const saveTitle = (id: string) => { const value = titleDraft.trim(); if (value) setChats(current => current.map(chat => chat.id === id ? { ...chat, title: value } : chat)); setEditingId(null) }

  return <>
    <button onClick={() => setOpen(true)} aria-label="Chat with Sebby" className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:bottom-6 sm:right-6"><Sparkles className="size-6"/></button>
    {open && <div className="fixed inset-0 z-40 animate-sebby-backdrop" role="dialog" aria-modal="true" aria-label="Chat with Sebby">
      <button onClick={() => setOpen(false)} aria-label="Close chat" className="absolute inset-0 bg-primary/25"/>
      <section className="absolute inset-0 flex w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-sebby-panel sm:inset-y-auto sm:bottom-24 sm:right-6 sm:left-auto sm:h-2/3 sm:w-[26rem]">
        {showChats && <aside className="absolute inset-0 z-10 flex w-full flex-col bg-background animate-sebby-history">
          <div className="flex items-center justify-between border-b border-border p-3"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Previous chats</span><div className="flex items-center gap-1"><button onClick={createChat} aria-label="New chat" className="rounded-md bg-accent p-2 text-accent-foreground"><Plus className="size-4"/></button><button onClick={() => setShowChats(false)} aria-label="Close previous chats" className="rounded-md p-2 hover:bg-muted"><X className="size-4"/></button></div></div>
          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">{chats.map(chat => <div key={chat.id} className={`group relative mb-1 flex items-center gap-1 rounded-lg ${chat.id === activeId ? 'bg-muted' : 'hover:bg-muted/70'}`}><button onClick={() => { setActiveId(chat.id); setShowChats(false) }} className="min-w-0 flex-1 truncate px-2 py-2.5 text-left text-xs font-medium">{chat.title}</button><button onClick={() => { setEditingId(chat.id); setTitleDraft(chat.title) }} aria-label={`Rename ${chat.title}`} className="hidden p-1 text-muted-foreground group-hover:block"><Pencil className="size-3"/></button><button onClick={() => deleteChat(chat.id)} aria-label={`Delete ${chat.title}`} className="hidden p-1 text-muted-foreground group-hover:block"><Trash2 className="size-3"/></button>{editingId === chat.id && <div className="absolute inset-x-3 top-12 z-10 rounded-lg border border-border bg-card p-2 shadow-lg"><input autoFocus value={titleDraft} onChange={event => setTitleDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') saveTitle(chat.id); if (event.key === 'Escape') setEditingId(null) }} className="w-full rounded border border-border px-2 py-1 text-xs"/><button onClick={() => saveTitle(chat.id)} className="mt-2 text-xs font-semibold text-accent-foreground">Save name</button></div>}</div>)}</div>
        </aside>}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-border px-4 py-3"><button onClick={() => setShowChats(value => !value)} aria-label={showChats ? 'Hide chats' : 'Show chats'} className="rounded-md p-1.5 hover:bg-muted">{showChats ? <ChevronLeft className="size-5"/> : <MessageCircle className="size-5"/>}</button><span className="grid size-8 place-items-center rounded-full bg-accent/20 text-accent-foreground"><Bot className="size-4"/></span><div className="min-w-0 flex-1"><h2 className="font-serif font-bold">Chat with Sebby</h2><p className="text-xs text-muted-foreground">Sample workspace assistant</p></div><button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-md p-2 hover:bg-muted"><X className="size-5"/></button></header>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">{activeChat?.messages.map(message => <div key={message.id} className={message.role === 'user' ? 'ml-8' : 'mr-4'}><div className={`rounded-2xl px-3 py-2.5 text-sm leading-6 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>{message.text}</div><p className="mt-1 px-1 text-[10px] text-muted-foreground">{message.time}</p>{message.preview && <div className="mt-2 rounded-xl border border-accent/30 bg-accent/10 p-3"><p className="text-xs font-bold text-accent-foreground">{message.preview.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{message.preview.detail}</p><button disabled className="mt-3 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-muted-foreground disabled:cursor-not-allowed">{message.preview.action}</button></div>}</div>)}<div className="flex flex-wrap gap-2">{prompts.map(prompt => <button key={prompt} onClick={() => setDraft(prompt)} className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">{prompt}</button>)}</div></div>
          <form onSubmit={submit} className="border-t border-border p-3"><div className="flex gap-2"><input ref={inputRef} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Ask Sebby about operations…" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"/><button type="submit" disabled={!draft.trim()} aria-label="Send message" className="rounded-lg bg-accent px-3 text-accent-foreground disabled:opacity-40"><Send className="size-4"/></button></div><p className="mt-2 text-[10px] text-muted-foreground">UI preview only · no live records or AI provider connected</p></form>
        </div>
      </section>
    </div>}
  </>
}
