'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { SebbyChat } from '@/components/sebby-chat'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const nav = [['Overview','/'],['Production log','/production'],['Inventory','/inventory'],['Purchase orders','/purchase-orders'],['Team & settings','/team']]
export const inputClass = 'rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground outline-none focus:border-accent'

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return <>
    <Link href="/" onClick={onNavigate} className="mb-12 flex items-center gap-3"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cbvt_kitchen_logo-otM83wldTRWyZ3X6ToyH1nQWSYsn9j.png" alt="CBVT Kitchen logo" className="size-10 rounded-full bg-card"/><span className="font-serif text-lg font-bold">CBVT<br/><span className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60">Kitchen</span></span></Link>
    <nav className="flex flex-col gap-2" aria-label="Main navigation">{nav.map(([label,href])=><Link key={href} href={href} onClick={onNavigate} className={`rounded-lg px-4 py-3 text-sm ${pathname===href?'bg-accent text-accent-foreground':'text-primary-foreground/65 hover:bg-primary-foreground/10 hover:text-primary-foreground'}`}>{label}</Link>)}</nav>
    <div className="mt-auto flex flex-col gap-4"><div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4"><p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/45">Today&apos;s focus</p><p className="mt-2 text-sm leading-6 text-primary-foreground/80">Keep prep on pace for dinner service.</p></div><Link href="/login" onClick={onNavigate} className="border-t border-primary-foreground/10 pt-5 text-sm text-primary-foreground/70">JD · Juan Dela Cruz ↗</Link></div>
  </>
}

export function KitchenShell({children,title,eyebrow,description,action,showPageIntro=true}:{children:React.ReactNode;title:string;eyebrow:string;description:string;action?:React.ReactNode;showPageIntro?:boolean}) {
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close) }, [])
  return <div className="min-h-screen bg-background text-foreground">
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-primary px-5 py-6 text-primary-foreground lg:flex"><Navigation/></aside>
    {menuOpen && <div className="fixed inset-0 z-30 lg:hidden" role="dialog" aria-modal="true" aria-label="Main navigation"><button aria-label="Close navigation" className="absolute inset-0 bg-primary/45" onClick={()=>setMenuOpen(false)}/><aside className="relative flex h-full w-72 flex-col bg-primary px-5 py-6 text-primary-foreground shadow-2xl animate-nav-drawer"><button onClick={()=>setMenuOpen(false)} aria-label="Close navigation" className="absolute right-4 top-4 rounded-md p-2 text-primary-foreground/75 hover:bg-primary-foreground/10"><X className="size-5"/></button><Navigation onNavigate={()=>setMenuOpen(false)}/></aside></div>}
    <main className="min-w-0 lg:pl-64"><div className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground sm:px-5 sm:py-4 lg:hidden"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cbvt_kitchen_logo-otM83wldTRWyZ3X6ToyH1nQWSYsn9j.png" alt="CBVT Kitchen logo" className="size-8 rounded-full"/><span className="min-w-0 flex-1 truncate font-serif font-bold">CBVT Kitchen</span><button onClick={()=>setMenuOpen(true)} aria-label="Open navigation" aria-expanded={menuOpen} className="rounded-md p-2 text-primary-foreground hover:bg-primary-foreground/10"><Menu className="size-5"/></button></div><header className="flex items-center justify-between border-b border-border bg-card px-6 py-5 lg:px-10"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Monday, September 2, 2026</p><h1 className="mt-1 font-serif text-2xl font-bold">{title}</h1></div>{action}</header><div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">{showPageIntro && <><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p><h2 className="font-serif text-4xl font-bold tracking-tight">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></>}<div className={showPageIntro ? 'mt-8' : ''}>{children}</div></div></main>
  <SebbyChat/></div>
}
export function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}{children}</label>}
export function Panel({children,className=''}:{children:React.ReactNode;className?:string}){return <section className={`min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-6 ${className}`}>{children}</section>}
export function Button({children,onClick,type='button'}:{children:React.ReactNode;onClick?:()=>void;type?:'button'|'submit'}){return <button type={type} onClick={onClick} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:brightness-95">{children}</button>}
export function OutlineButton({children,onClick}:{children:React.ReactNode;onClick?:()=>void}){return <button onClick={onClick} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted">{children}</button>}
export function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}){return <div className="fixed inset-0 z-20 grid place-items-center overflow-y-auto bg-primary/45 p-3 sm:p-5"><div className="my-auto max-h-[calc(100vh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-2xl sm:max-h-[calc(100vh-2.5rem)] sm:p-6"><div className="flex items-start justify-between"><h3 className="font-serif text-2xl font-bold">{title}</h3><button onClick={onClose} aria-label="Close dialog" className="text-2xl text-muted-foreground">×</button></div><div className="mt-6">{children}</div></div></div>}
export function Status({children}:{children:React.ReactNode}){return <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{children}</span>}
export function Row({children}:{children:React.ReactNode}){return <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-4 last:border-0">{children}</div>}
export function AddButton({children,onClick}:{children:React.ReactNode;onClick:()=>void}){return <Button onClick={onClick}>+ {children}</Button>}
export function PageNote({children}:{children:React.ReactNode}){return <p className="text-xs leading-5 text-muted-foreground">{children}</p>}
