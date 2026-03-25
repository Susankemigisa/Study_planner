import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Clock, CheckCircle2, Circle, Loader2, Trash2, Plus,
  ChevronRight, Zap, Target, TrendingUp, X, AlertCircle,
  Wifi, WifiOff, RotateCcw, Timer, Play, Pause, StopCircle
} from 'lucide-react'

const API = 'http://127.0.0.1:8000'

const STATUS_CONFIG = {
  pending:     { label:'Pending',     color:'#f5a623', bg:'rgba(245,166,35,0.1)',  border:'rgba(245,166,35,0.22)', icon:Circle },
  in_progress: { label:'In Progress', color:'#5bc8fa', bg:'rgba(91,200,250,0.1)',  border:'rgba(91,200,250,0.22)', icon:Loader2 },
  done:        { label:'Done',        color:'#b8f060', bg:'rgba(184,240,96,0.1)',  border:'rgba(184,240,96,0.22)', icon:CheckCircle2 },
}

/* ── API hook ── */
function useApi() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [online, setOnline] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`${API}/tasks`)
      if (!r.ok) throw new Error()
      setTasks(await r.json())
      setOnline(true)
    } catch { setOnline(false) }
    finally { setLoading(false) }
  }, [])

  const createTask = useCallback(async (data) => {
    const r = await fetch(`${API}/tasks`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) })
    if (!r.ok) throw new Error()
    await fetchTasks()
  }, [fetchTasks])

  const updateTask = useCallback(async (id, data) => {
    const r = await fetch(`${API}/tasks/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) })
    if (!r.ok) throw new Error()
    await fetchTasks()
  }, [fetchTasks])

  const deleteTask = useCallback(async (id) => {
    const r = await fetch(`${API}/tasks/${id}`, { method:'DELETE' })
    if (!r.ok) throw new Error()
    await fetchTasks()
  }, [fetchTasks])

  useEffect(() => { fetchTasks() }, [fetchTasks])
  return { tasks, loading, online, fetchTasks, createTask, updateTask, deleteTask }
}

/* ── Countdown timer component ── */
function CountdownTimer({ totalSeconds, onComplete }) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            onComplete?.()
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const reset = () => { clearInterval(intervalRef.current); setRunning(false); setRemaining(totalSeconds) }
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const pct = remaining / totalSeconds
  const circumference = 2 * Math.PI * 18

  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      {/* Ring */}
      <div style={{ position:'relative', width:44, height:44, flexShrink:0 }}>
        <svg width="44" height="44" style={{ transform:'rotate(-90deg)' }}>
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5"/>
          <circle cx="22" cy="22" r="18" fill="none"
            stroke={pct > 0.5 ? '#b8f060' : pct > 0.2 ? '#f5a623' : '#ff5a6e'}
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            strokeLinecap="round"
            style={{ transition:'stroke-dashoffset 0.9s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'var(--text-soft)', fontFamily:'var(--font-display)' }}>
          {mins}:{secs.toString().padStart(2,'0')}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:4 }}>
        <button onClick={() => setRunning(r => !r)}
          style={{ width:26, height:26, borderRadius:7, border:'1px solid var(--border-md)', background:'var(--surface3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color: running ? '#f5a623' : '#b8f060' }}>
          {running ? <Pause size={11}/> : <Play size={11}/>}
        </button>
        <button onClick={reset}
          style={{ width:26, height:26, borderRadius:7, border:'1px solid var(--border)', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>
          <RotateCcw size={10}/>
        </button>
      </div>
    </div>
  )
}

/* ── Toast ── */
function Toast({ toasts, remove }) {
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:1000, display:'flex', flexDirection:'column', gap:8 }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity:0, x:40, scale:0.92 }} animate={{ opacity:1, x:0, scale:1 }} exit={{ opacity:0, x:40, scale:0.92 }}
            transition={{ type:'spring', damping:22, stiffness:300 }}
            onClick={() => remove(t.id)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderRadius:12, maxWidth:290,
              background: t.type==='error' ? 'rgba(255,90,110,0.12)' : 'rgba(184,240,96,0.1)',
              border: `1px solid ${t.type==='error' ? 'rgba(255,90,110,0.25)' : 'rgba(184,240,96,0.22)'}`,
              color: t.type==='error' ? '#ff5a6e' : '#b8f060',
              fontSize:13, fontWeight:500, cursor:'pointer', backdropFilter:'blur(12px)' }}>
            {t.type==='error' ? <AlertCircle size={14}/> : <CheckCircle2 size={14}/>}
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ── Stat card ── */
function StatCard({ label, value, color, icon: Icon, delay }) {
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration:0.45, ease:[0.23,1,0.32,1] }}
      style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:18, padding:'20px 22px', position:'relative', overflow:'hidden', flex:1, minWidth:0 }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${color}cc, ${color}22)`, borderRadius:'2px 2px 0 0' }}/>
      <div style={{ width:36, height:36, borderRadius:10, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, color }}>
        <Icon size={16}/>
      </div>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:6 }}>{label}</div>
      <motion.div key={value} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
        style={{ fontFamily:'var(--font-display)', fontSize:36, fontWeight:800, color:'var(--text)', lineHeight:1 }}>
        {value}
      </motion.div>
    </motion.div>
  )
}

/* ── Status badge ── */
function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status]
  const Icon = c.icon
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'3px 9px', borderRadius:100, background:c.bg, border:`1px solid ${c.border}`, color:c.color }}>
      <Icon size={9} style={status==='in_progress' ? { animation:'spin 1.5s linear infinite' } : {}}/>
      {c.label}
    </span>
  )
}

/* ── Task card ── */
function TaskCard({ task, onDelete, onUpdate, index, addToast }) {
  const [deleting, setDeleting] = useState(false)
  const [cycling, setCycling] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const next = { pending:'in_progress', in_progress:'done', done:'pending' }

  return (
    <motion.div layout
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, x:-24, scale:0.97 }}
      transition={{ delay: index * 0.04, duration:0.35, ease:[0.23,1,0.32,1] }}
      style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden', opacity: deleting ? 0.4 : 1, transition:'opacity 0.2s' }}
      whileHover={{ borderColor:'var(--border-md)' }}
    >
      {/* Main row */}
      <div style={{ padding:'18px 20px', display:'grid', gridTemplateColumns:'1fr auto', gap:16, alignItems:'center', cursor:'pointer' }}
        onClick={() => setExpanded(e => !e)}>
        {/* Accent left bar */}
        <div style={{ position:'relative', paddingLeft:14 }}>
          <div style={{ position:'absolute', left:0, top:'10%', bottom:'10%', width:2.5, background:STATUS_CONFIG[task.status].color, borderRadius:2, opacity:0.8 }}/>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:15, fontWeight:700 }}>{task.subject}</span>
            <StatusBadge status={task.status}/>
          </div>
          <div style={{ fontSize:13, color:'var(--text-soft)', fontStyle:'italic', marginBottom:8 }}>{task.topic}</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text-muted)', fontSize:12 }}>
            <Clock size={11}/><span>{task.duration_minutes} min</span>
            <span style={{ opacity:0.25 }}>·</span>
            <span style={{ opacity:0.45 }}>#{task.id}</span>
          </div>
        </div>

        <div style={{ display:'flex', gap:6 }} onClick={e => e.stopPropagation()}>
          <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.94 }}
            onClick={async () => { setCycling(true); await onUpdate(task.id, { status: next[task.status] }); setCycling(false); addToast('Status updated.') }}
            disabled={cycling}
            title="Cycle status"
            style={{ width:34, height:34, borderRadius:10, border:'1px solid var(--border-md)', background:'var(--surface2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color: STATUS_CONFIG[task.status].color }}>
            {cycling ? <Loader2 size={14} style={{ animation:'spin 1s linear infinite' }}/> : <ChevronRight size={14}/>}
          </motion.button>
          <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:0.94 }}
            onClick={async () => { setDeleting(true); await onDelete(task.id); addToast('Session removed.') }}
            disabled={deleting}
            title="Delete"
            style={{ width:34, height:34, borderRadius:10, border:'1px solid var(--border-md)', background:'var(--surface2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', transition:'background 0.15s' }}>
            <Trash2 size={14}/>
          </motion.button>
        </div>
      </div>

      {/* Expandable timer panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.25, ease:[0.23,1,0.32,1] }}
            style={{ overflow:'hidden' }}
          >
            <div style={{ padding:'14px 20px 18px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Timer size={13} style={{ color:'var(--text-muted)' }}/>
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>Session timer</span>
              </div>
              <CountdownTimer
                totalSeconds={task.duration_minutes * 60}
                onComplete={() => addToast(`⏰ "${task.subject}" session complete!`)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Add task drawer — uses REFS not state for inputs to avoid cursor lag ── */
function Drawer({ open, onClose, onCreate }) {
  // Using refs for input values avoids React re-render on every keystroke (fixes cursor lag)
  const subjectRef = useRef()
  const topicRef = useRef()
  const durationRef = useRef()
  const statusRef = useRef()
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => { if (open) setTimeout(() => subjectRef.current?.focus(), 150) }, [open])

  const handleClose = () => {
    setErr('')
    onClose()
  }

  const submit = async () => {
    const subject = subjectRef.current?.value?.trim()
    const topic = topicRef.current?.value?.trim()
    const duration = parseInt(durationRef.current?.value)
    const status = statusRef.current?.value

    if (!subject || !topic || !duration) { setErr('Please fill in all fields.'); return }
    setSaving(true); setErr('')
    try {
      await onCreate({ subject, topic, duration_minutes: duration, status })
      if (subjectRef.current) subjectRef.current.value = ''
      if (topicRef.current) topicRef.current.value = ''
      if (durationRef.current) durationRef.current.value = ''
      if (statusRef.current) statusRef.current.value = 'pending'
      handleClose()
    } catch { setErr('Could not create. Is the server running?') }
    finally { setSaving(false) }
  }

  const inputStyle = {
    width:'100%', background:'var(--surface3)', border:'1px solid var(--border-md)',
    borderRadius:11, padding:'12px 14px', fontSize:14, color:'var(--text)',
    outline:'none', transition:'border-color 0.15s, box-shadow 0.15s',
  }
  const focusIn = e => { e.target.style.borderColor='rgba(184,240,96,0.45)'; e.target.style.boxShadow='0 0 0 3px rgba(184,240,96,0.08)' }
  const focusOut = e => { e.target.style.borderColor=''; e.target.style.boxShadow='' }

  const Field = ({ label, children }) => (
    <div style={{ marginBottom:18 }}>
      <label style={{ display:'block', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:7 }}>{label}</label>
      {children}
    </div>
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={handleClose}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)', zIndex:100 }}/>

          <motion.div
            initial={{ opacity:0, x:'100%' }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:'100%' }}
            transition={{ type:'spring', damping:30, stiffness:300 }}
            style={{ position:'fixed', right:0, top:0, bottom:0, width:440, background:'var(--surface)',
              borderLeft:'1px solid var(--border-md)', zIndex:101, padding:'36px 30px',
              overflowY:'auto', display:'flex', flexDirection:'column' }}>

            {/* Drawer header */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:36 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--accent)', marginBottom:6 }}>New Session</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800, lineHeight:1.1 }}>Add Study Block</div>
                <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:6 }}>Hit Enter to submit quickly</div>
              </div>
              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.92 }} onClick={handleClose}
                style={{ width:38, height:38, borderRadius:10, border:'1px solid var(--border-md)', background:'var(--surface2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-soft)', flexShrink:0 }}>
                <X size={16}/>
              </motion.button>
            </div>

            <Field label="Subject">
              <input ref={subjectRef} style={inputStyle} placeholder="e.g. Mathematics"
                defaultValue=""
                onFocus={focusIn} onBlur={focusOut}
                onKeyDown={e => e.key === 'Enter' && submit()}/>
            </Field>

            <Field label="Topic">
              <input ref={topicRef} style={inputStyle} placeholder="e.g. Calculus — Integration"
                defaultValue=""
                onFocus={focusIn} onBlur={focusOut}
                onKeyDown={e => e.key === 'Enter' && submit()}/>
            </Field>

            <Field label="Duration (minutes)">
              <input ref={durationRef} type="number" style={inputStyle} placeholder="e.g. 60" min="1"
                defaultValue=""
                onFocus={focusIn} onBlur={focusOut}
                onKeyDown={e => e.key === 'Enter' && submit()}/>
            </Field>

            <Field label="Initial Status">
              <div style={{ position:'relative' }}>
                <select ref={statusRef} defaultValue="pending"
                  style={{ ...inputStyle, appearance:'none', cursor:'pointer' }}
                  onFocus={focusIn} onBlur={focusOut}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <ChevronRight size={13} style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%) rotate(90deg)', color:'var(--text-muted)', pointerEvents:'none' }}/>
              </div>
            </Field>

            <AnimatePresence>
              {err && (
                <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:10, background:'rgba(255,90,110,0.1)', border:'1px solid rgba(255,90,110,0.22)', color:'#ff5a6e', fontSize:13, marginBottom:16 }}>
                  <AlertCircle size={14}/> {err}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginTop:'auto', paddingTop:24, display:'flex', flexDirection:'column', gap:10 }}>
              <motion.button
                whileHover={{ scale:1.02, boxShadow:'0 10px 36px rgba(184,240,96,0.25)' }}
                whileTap={{ scale:0.98 }}
                onClick={submit} disabled={saving}
                style={{ width:'100%', padding:15, background: saving ? 'rgba(184,240,96,0.5)' : 'var(--accent)', color:'#08080f', border:'none', borderRadius:12, fontFamily:'var(--font-display)', fontSize:15, fontWeight:800, letterSpacing:'0.04em', cursor: saving ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'background 0.15s' }}>
                {saving ? <Loader2 size={16} style={{ animation:'spin 1s linear infinite' }}/> : <Plus size={16}/>}
                {saving ? 'Adding...' : 'Add Session'}
              </motion.button>
              <button onClick={handleClose}
                style={{ width:'100%', padding:12, background:'transparent', color:'var(--text-muted)', border:'1px solid var(--border)', borderRadius:12, fontSize:13, cursor:'pointer' }}>
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Main app ── */
const FILTERS = ['all','pending','in_progress','done']

export default function App() {
  const { tasks, loading, online, fetchTasks, createTask, updateTask, deleteTask } = useApi()
  const [filter, setFilter] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msg, type='success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }
  const filterLabel = f => f === 'all' ? 'All' : STATUS_CONFIG[f]?.label ?? f

  return (
    <>
      {/* Ambient BG */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:-300, right:-150, width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle, rgba(184,240,96,0.055) 0%, transparent 65%)' }}/>
        <div style={{ position:'absolute', bottom:-200, left:-150, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,111,255,0.05) 0%, transparent 65%)' }}/>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)', backgroundSize:'64px 64px' }}/>
      </div>

      <div style={{ position:'relative', zIndex:1, maxWidth:940, margin:'0 auto', padding:'48px 24px 100px' }}>

        {/* Header */}
        <motion.header initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, ease:[0.23,1,0.32,1] }}
          style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:52, flexWrap:'wrap', gap:20 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--accent)', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:20, height:1.5, background:'var(--accent)', borderRadius:2 }}/>
              Moringa AI Capstone
            </div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(44px,7vw,68px)', fontWeight:800, lineHeight:0.92, letterSpacing:'-0.035em' }}>
              Study<br/><span style={{ color:'var(--accent)' }}>Planner</span>
            </h1>
            <div style={{ marginTop:14, display:'flex', gap:6, flexWrap:'wrap' }}>
              {['FastAPI','Python','REST API'].map(tag => (
                <span key={tag} style={{ fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:100, border:'1px solid var(--border-md)', color:'var(--text-muted)', background:'var(--surface)', letterSpacing:'0.04em' }}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <motion.button whileHover={{ scale:1.06, rotate:180 }} whileTap={{ scale:0.94 }} transition={{ rotate:{ duration:0.4 } }}
              onClick={fetchTasks}
              style={{ width:42, height:42, borderRadius:12, border:'1px solid var(--border-md)', background:'var(--surface)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)' }}>
              <RotateCcw size={15}/>
            </motion.button>

            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderRadius:100, border:'1px solid var(--border-md)', background:'var(--surface)', fontSize:13,
              color: online===null ? 'var(--text-muted)' : online ? '#b8f060' : '#ff5a6e' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'currentColor', boxShadow: online ? '0 0 7px currentColor' : 'none', animation: online ? 'pulse-dot 2s ease-in-out infinite' : 'none' }}/>
              {online===null ? 'Connecting…' : online ? 'API live' : 'Offline'}
              {online ? <Wifi size={13}/> : online===false ? <WifiOff size={13}/> : null}
            </div>

            <motion.button
              whileHover={{ scale:1.03, boxShadow:'0 8px 28px rgba(184,240,96,0.22)' }}
              whileTap={{ scale:0.97 }}
              onClick={() => setDrawerOpen(true)}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 22px', background:'var(--accent)', color:'#08080f', border:'none', borderRadius:12, fontFamily:'var(--font-display)', fontSize:14, fontWeight:800, cursor:'pointer', letterSpacing:'0.03em', whiteSpace:'nowrap' }}>
              <Plus size={16}/> New Session
            </motion.button>
          </div>
        </motion.header>

        {/* Stats row */}
        <div style={{ display:'flex', gap:14, marginBottom:40, flexWrap:'wrap' }}>
          <StatCard label="Total"       value={stats.total}    color="#9898b0" icon={BookOpen}   delay={0.08}/>
          <StatCard label="Pending"     value={stats.pending}  color="#f5a623" icon={Target}     delay={0.14}/>
          <StatCard label="In Progress" value={stats.progress} color="#5bc8fa" icon={Zap}        delay={0.20}/>
          <StatCard label="Completed"   value={stats.done}     color="#b8f060" icon={TrendingUp} delay={0.26}/>
        </div>

        {/* Filter tabs */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.32 }}
          style={{ display:'flex', gap:4, marginBottom:22, padding:5, background:'var(--surface)', borderRadius:14, border:'1px solid var(--border)', width:'fit-content' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:'8px 18px', borderRadius:10, border:'none',
                background: filter===f ? 'var(--surface3)' : 'transparent',
                color: filter===f ? 'var(--text)' : 'var(--text-muted)',
                fontSize:13, fontWeight: filter===f ? 600 : 400,
                cursor:'pointer', transition:'all 0.15s',
                boxShadow: filter===f ? '0 1px 6px rgba(0,0,0,0.35)' : 'none' }}>
              {filterLabel(f)}
              {filter===f && (
                <span style={{ marginLeft:7, fontSize:11, opacity:0.55 }}>
                  {filter==='all' ? tasks.length : tasks.filter(t => t.status===filter).length}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Task list */}
        {loading && tasks.length===0 ? (
          <div style={{ textAlign:'center', padding:'80px 0', color:'var(--text-muted)' }}>
            <Loader2 size={30} style={{ animation:'spin 1s linear infinite', marginBottom:14 }}/>
            <p style={{ fontSize:14 }}>Loading sessions…</p>
          </div>
        ) : filtered.length===0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ textAlign:'center', padding:'90px 0', color:'var(--text-muted)' }}>
            <BookOpen size={38} style={{ marginBottom:16, opacity:0.25 }}/>
            <p style={{ fontSize:16, marginBottom:6, color:'var(--text-soft)', fontFamily:'var(--font-display)', fontWeight:700 }}>No sessions here</p>
            <p style={{ fontSize:13 }}>
              {filter==='all' ? 'Add your first study session to get started.' : `No ${filterLabel(filter).toLowerCase()} sessions yet.`}
            </p>
          </motion.div>
        ) : (
          <motion.div layout style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i}
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                  addToast={addToast}/>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Hint */}
        {tasks.length > 0 && (
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            style={{ marginTop:24, textAlign:'center', fontSize:12, color:'var(--text-muted)' }}>
            Click any session to reveal its countdown timer
          </motion.p>
        )}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        onCreate={async (data) => { await createTask(data); addToast('Study session added!') }}/>
      <Toast toasts={toasts} remove={id => setToasts(t => t.filter(x => x.id !== id))}/>

      <style>{`select option { background: #161624; }`}</style>
    </>
  )
}
