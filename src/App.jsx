import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Home, Trophy, ChevronRight, ChevronLeft, ArrowLeft, ArrowRight, PlusCircle, Trash2, Maximize, Edit, X, RotateCcw } from 'lucide-react'

// ==========================================
// Component ย่อย: สำหรับจัดการ 1 แมตช์
// ==========================================
const MatchRow = ({ match, onSave, onReset, isPreview }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [homeScore, setHomeScore] = useState(match.home_score || 0)
  const [awayScore, setAwayScore] = useState(match.away_score || 0)

  useEffect(() => {
    setHomeScore(match.home_score || 0)
    setAwayScore(match.away_score || 0)
  }, [match])

  const handleSave = () => {
    onSave(match.id, homeScore, awayScore)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setHomeScore(match.home_score || 0)
    setAwayScore(match.away_score || 0)
    setIsEditing(false)
  }

  const handleScoreChange = (setter, value) => {
    if (value === '') { setter(''); return; }
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) setter(num);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', padding: '15px 0' }}>
      <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold', color: '#fff', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{match.home_team_name}</div>
      <div style={{ padding: '0 10px', display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'center', width: '90px' }}>
        {isEditing && !isPreview ? (
          <>
            <input type="number" min="0" value={homeScore} onChange={e => handleScoreChange(setHomeScore, e.target.value)} style={{ width: '35px', textAlign: 'center', border: '1px solid #ea580c', borderRadius: '5px', fontSize:'16px', background: 'rgba(255,255,255,0.9)', color: '#000' }} />
            <span style={{ color: '#ea580c', fontWeight: 'bold' }}>-</span>
            <input type="number" min="0" value={awayScore} onChange={e => handleScoreChange(setAwayScore, e.target.value)} style={{ width: '35px', textAlign: 'center', border: '1px solid #ea580c', borderRadius: '5px', fontSize:'16px', background: 'rgba(255,255,255,0.9)', color: '#000' }} />
          </>
        ) : (
          <div style={{ 
            fontSize: '18px', fontWeight: 'bold', padding: '5px 15px', borderRadius: '5px', color: '#fff', 
            background: match.is_played ? 'rgba(234, 88, 12, 0.8)' : 'rgba(255, 255, 255, 0.15)',
            boxShadow: match.is_played ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
            border: match.is_played ? 'none' : '1px solid rgba(255,255,255,0.3)'
          }}>
            {match.is_played ? `${match.home_score} - ${match.away_score}` : 'VS'}
          </div>
        )}
      </div>
      <div style={{ flex: 1, textAlign: 'left', fontWeight: 'bold', color: '#fff', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>{match.away_team_name}</div>
      
      {/* ซ่อนปุ่มแก้ไขทั้งหมดเวลาอยู่ในโหมดแคปจอ (isPreview) */}
      {!isPreview && (
        <div style={{ minWidth: '70px', display: 'flex', gap: '5px', justifyContent: 'flex-start', paddingLeft: '10px' }}>
          {isEditing ? (
            <>
              <button onClick={handleSave} style={{ padding: '5px 8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>เซฟ</button>
              <button onClick={handleCancel} style={{ padding: '5px 6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={16} /></button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} style={{ padding: '5px 8px', background: 'rgba(255,255,255,0.2)', color: '#fdba74', border: '1px solid #fdba74', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Edit size={16} /></button>
              {match.is_played && (
                <button onClick={() => { if(window.confirm('ล้างคะแนนคู่นี้กลับไปเป็น VS ไหม?')) onReset(match.id) }} style={{ padding: '5px 8px', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid #ef4444', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="ยกเลิกผลการแข่ง"><RotateCcw size={16} /></button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ==========================================
// 1. หน้าหลัก (Dashboard)
// ==========================================
const Dashboard = () => {
  const [tournaments, setTournaments] = useState([])
  const navigate = useNavigate()

  const fetchTournaments = () => fetch('https://sptp-backend.onrender.com/tournaments').then(res => res.json()).then(setTournaments)
  useEffect(() => { fetchTournaments() }, [])

  const deleteTournament = async (e, id) => {
    e.stopPropagation() 
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) {
      const res = await fetch(`https://sptp-backend.onrender.com/tournaments/${id}`, { method: 'DELETE' })
      if (res.ok) fetchTournaments()
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginTop: 0, color: '#1c1917' }}>🏠 รายการแข่งขันของคุณ</h2>
      {tournaments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: '10px', color: '#a8a29e', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}><p>ยังไม่มีรายการแข่งขัน</p></div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {tournaments.map(t => (
            <div key={t.id} onClick={() => navigate(`/tournament/${t.id}`)} style={{ background: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(234, 88, 12, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderLeft: '4px solid #ea580c' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1c1917', marginBottom: '5px' }}>{t.name}</div>
                <div style={{ fontSize: '14px', color: '#78716c' }}>{t.type === 'league' ? '🏆 แบบลีค' : '🔥 บอลถ้วย'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={(e) => deleteTournament(e, t.id)} style={{ background: '#ffedd5', color: '#ea580c', border: 'none', padding: '8px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={18} />
                </button>
                <ChevronRight size={20} color="#ea580c" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==========================================
// 2. หน้าสร้างรายการ (Create Tournament)
// ==========================================
const CreateTournament = () => {
  const [name, setName] = useState('')
  const [type, setType] = useState('league')
  const [leagueFormat, setLeagueFormat] = useState('single') 
  const [teamNames, setTeamNames] = useState(['', '', '', '']) 
  const navigate = useNavigate()

  const handleTeamChange = (index, value) => { const newTeams = [...teamNames]; newTeams[index] = value; setTeamNames(newTeams) }
  const addTeamInput = () => setTeamNames([...teamNames, ''])
  const removeTeamInput = (index) => setTeamNames(teamNames.filter((_, i) => i !== index))

  const handleCreate = async (e) => {
    e.preventDefault()
    const validTeams = teamNames.filter(t => t.trim() !== '')
    if (validTeams.length < 2) return alert('ต้องกรอกชื่อทีมอย่างน้อย 2 ทีมครับ!')

    const res = await fetch('https://sptp-backend.onrender.com/tournaments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, league_format: leagueFormat, team_names: validTeams })
    })
    
    if (res.ok) {
      const { tournamentId } = await res.json()
      const endpoint = type === 'league' ? 'generate-matches' : 'generate-knockout'
      await fetch(`https://sptp-backend.onrender.com/tournaments/${tournamentId}/${endpoint}`, { method: 'POST' })
      navigate(`/tournament/${tournamentId}`)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginTop: 0, color: '#1c1917' }}>🏆 สร้างรายการใหม่</h2>
      <form onSubmit={handleCreate} style={{ background: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(234, 88, 12, 0.1)', borderTop: '4px solid #ea580c' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#444' }}>ชื่อรายการ</label>
          <input type="text" placeholder="เช่น SPTP E-Sport Cup" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#444' }}>รูปแบบ</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="league">ลีก (เก็บคะแนน)</option>
              <option value="knockout">บอลถ้วย (แพ้คัดออก)</option>
            </select>
          </div>
          {type === 'league' && (
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#444' }}>รอบการแข่ง</label>
              <select value={leagueFormat} onChange={e => setLeagueFormat(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option value="single">พบกันหมด (1 รอบ)</option>
                <option value="home_away">เหย้า-เยือน (2 รอบ)</option>
              </select>
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold', color: '#444' }}>รายชื่อทีมแข่งขัน</label>
            <button type="button" onClick={addTeamInput} style={{ background: 'none', border: 'none', color: '#ea580c', fontWeight: 'bold', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <PlusCircle size={18} style={{ marginRight: '5px' }} /> เพิ่มทีม
            </button>
          </div>
          {teamNames.map((tName, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input type="text" placeholder={`ทีมที่ ${index + 1}`} value={tName} onChange={(e) => handleTeamChange(index, e.target.value)} required style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
              {teamNames.length > 2 && (
                <button type="button" onClick={() => removeTeamInput(index)} style={{ background: '#ffedd5', color: '#ea580c', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer' }}><Trash2 size={20} /></button>
              )}
            </div>
          ))}
        </div>
        <button type="submit" style={{ width: '100%', padding: '15px', background: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(234, 88, 12, 0.3)', cursor: 'pointer' }}>สร้างและจัดตารางแข่ง</button>
      </form>
    </div>
  )
}

// ==========================================
// 3. หน้ารายละเอียดทัวร์นาเมนต์
// ==========================================
const TournamentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tourney, setTourney] = useState(null)
  const [matches, setMatches] = useState([])
  const [standings, setStandings] = useState([])
  const [roundIndex, setRoundIndex] = useState(0)
  
  // ✅ State สำหรับเก็บว่ากำลังขยายดูส่วนไหนเต็มจออยู่ ('standings' หรือ 'matches' หรือ null)
  const [fullscreenView, setFullscreenView] = useState(null) 

  const fetchData = async () => {
    fetch(`https://sptp-backend.onrender.com/tournaments/${id}`).then(res => res.json()).then(setTourney)
    fetch(`https://sptp-backend.onrender.com/tournaments/${id}/matches`).then(res => res.json()).then(setMatches)
    fetch(`https://sptp-backend.onrender.com/tournaments/${id}/standings`).then(res => res.json()).then(setStandings)
  }
  useEffect(() => { fetchData() }, [id])

  const updateScore = async (matchId, h, a) => {
    await fetch(`https://sptp-backend.onrender.com/matches/${matchId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ home_score: h, away_score: a }) })
    fetchData()
  }

  const resetScore = async (matchId) => {
    await fetch(`https://sptp-backend.onrender.com/matches/${matchId}/reset`, { method: 'PUT' })
    fetchData()
  }

  const generateNextRound = async () => {
    const res = await fetch(`https://sptp-backend.onrender.com/tournaments/${id}/generate-knockout`, { method: 'POST' })
    const data = await res.json()
    if (res.ok) fetchData()
    else alert(data.error)
  }

  if (!tourney) return <div style={{ padding: '20px', textAlign: 'center' }}>กำลังโหลด...</div>

  const allRounds = [...new Set(matches.map(m => m.match_round))]
  const currentRoundName = allRounds[roundIndex]
  const currentMatches = matches.filter(m => m.match_round === currentRoundName)

  const bgStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url('/SPTP.jpg')`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    border: '2px solid #ea580c'
  }

  // ✅ แยกส่วนตารางคะแนนออกมาเป็นฟังก์ชัน เพื่อให้เรียกใช้ซ้ำตอนขยายเต็มจอได้ง่าย
  const renderStandings = (isPreview = false) => (
    <div style={{ ...bgStyle, overflowX: 'auto', minHeight: isPreview ? '100%' : 'auto' }}>
      <h3 style={{ margin: '0 0 15px 0', textAlign: 'center', color: '#fdba74', textShadow: '1px 1px 2px #000' }}>🏆 ตารางคะแนน {tourney.name}</h3>
      <table style={{ width: '100%', textAlign: 'center', fontSize: '13px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#fdba74', borderBottom: '2px solid rgba(234, 88, 12, 0.5)' }}>
            <th style={{ paddingBottom:'8px', width: '25px' }}>ลำดับ</th>
            <th style={{textAlign:'left', paddingBottom:'8px', paddingLeft: '5px'}}>ทีม</th>
            <th>แข่ง</th><th>ชนะ</th><th>เสมอ</th><th>แพ้</th><th>ได้</th><th>เสีย</th><th>GD</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((t, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', height: '45px' }}>
              <td style={{ color: '#fdba74', fontWeight: 'bold' }}>{i+1}</td>
              <td style={{textAlign:'left', fontWeight: 'bold', color: '#fff', paddingLeft: '5px'}}>{t.name.length > 8 ? t.name.substring(0,8) + '..' : t.name}</td>
              <td>{t.played}</td><td>{t.won}</td><td>{t.drawn}</td><td>{t.lost}</td>
              <td style={{color:'#4ade80'}}>{t.gf}</td>
              <td style={{color:'#f87171'}}>{t.ga}</td>
              <td>{t.gd}</td>
              <td style={{color:'#facc15', fontWeight:'bold', fontSize:'16px'}}>{t.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // ✅ แยกส่วนตารางแข่งออกมาเป็นฟังก์ชัน 
  const renderMatches = (isPreview = false) => (
    <div style={{ ...bgStyle, minHeight: isPreview ? '100%' : 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'rgba(0,0,0,0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(234, 88, 12, 0.3)' }}>
        {/* ซ่อนปุ่มเปลี่ยนรอบ เวลาขยายเต็มจอ */}
        {!isPreview && <button onClick={() => setRoundIndex(prev => Math.max(0, prev - 1))} disabled={roundIndex === 0} style={{ border: 'none', background: 'none', opacity: roundIndex === 0 ? 0.3 : 1, cursor: 'pointer', color: '#fff' }}><ArrowLeft size={20} /></button>}
        
        <strong style={{ fontSize: '18px', color: '#fdba74', margin: isPreview ? '0 auto' : '0' }}>{currentRoundName || 'ยังไม่มีตารางแข่ง'}</strong>
        
        {!isPreview && <button onClick={() => setRoundIndex(prev => Math.min(allRounds.length - 1, prev + 1))} disabled={roundIndex === allRounds.length - 1} style={{ border: 'none', background: 'none', opacity: roundIndex === allRounds.length - 1 ? 0.3 : 1, cursor: 'pointer', color: '#fff' }}><ArrowRight size={20} /></button>}
      </div>

      {currentMatches.map(m => (
        <MatchRow key={m.id} match={m} onSave={updateScore} onReset={resetScore} isPreview={isPreview} />
      ))}

      {!isPreview && tourney.type === 'knockout' && roundIndex === allRounds.length - 1 && (
        <button onClick={generateNextRound} style={{ width: '100%', marginTop: '20px', padding: '15px', background: 'linear-gradient(to right, #ea580c, #dc2626)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.5)' }}>
          🔥 สร้างแมตช์รอบต่อไป
        </button>
      )}
    </div>
  )

  return (
    <div style={{ padding: '20px', paddingBottom: '90px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#ea580c', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>
          <ChevronLeft size={20} /> กลับหน้าหลัก
        </button>
      </div>

      <h2 style={{ marginTop: 0, color: '#1c1917', textTransform: 'uppercase' }}>{tourney.name}</h2>

      {/* โซนตารางคะแนนปกติ */}
      {tourney.type === 'league' && (
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button onClick={() => setFullscreenView('standings')} style={{ background: '#111', color: '#ea580c', border: '1px solid #ea580c', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 'bold' }}>
              <Maximize size={14} style={{ marginRight: '5px' }} /> ขยายเพื่อแคปจอ
            </button>
          </div>
          {renderStandings(false)}
        </div>
      )}

      {/* โซนตารางแข่งปกติ */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <button onClick={() => setFullscreenView('matches')} style={{ background: '#111', color: '#ea580c', border: '1px solid #ea580c', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 'bold' }}>
            <Maximize size={14} style={{ marginRight: '5px' }} /> ขยายเพื่อแคปจอ
          </button>
        </div>
        {renderMatches(false)}
      </div>

      {/* ✅ หน้าต่างโหมดแคปหน้าจอ (Fullscreen) */}
      {fullscreenView && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: '#000', zIndex: 9999, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <p style={{ color: '#4ade80', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
              
            </p>
            <button onClick={() => setFullscreenView(null)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={16} style={{ marginRight: '5px' }} /> ปิดหน้าต่าง
            </button>
          </div>
          {/* แสดงส่วนที่เลือกแบบเต็มจอ โดยไม่มีปุ่มแก้ไขโผล่มากวนใจ */}
          {fullscreenView === 'standings' ? renderStandings(true) : renderMatches(true)}
        </div>
      )}
    </div>
  )
}

function App() {
  const location = useLocation();
  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: '#fff7ed', minHeight: '100vh', position: 'relative', boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}>
      <div style={{ background: '#111', color: '#ea580c', padding: '15px', textAlign: 'center', position: 'sticky', top: 0, zIndex: 10, borderBottom: '3px solid #ea580c' }}>
        <h1 style={{ margin: 0, fontSize: '20px', letterSpacing: '1px' }}>⚽ SPTP MANAGER</h1>
      </div>
      
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateTournament />} />
        <Route path="/tournament/:id" element={<TournamentDetail />} />
      </Routes>
      
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: '#111', display: 'flex', justifyContent: 'center', gap: '80px', padding: '10px 0', borderTop: '2px solid #ea580c', zIndex: 1000 }}>
        <Link to="/" style={{ textDecoration: 'none', color: location.pathname === '/' ? '#ea580c' : '#78716c' }}><div style={{textAlign:'center'}}><Home size={24} style={{ margin: '0 auto' }}/><div style={{ fontSize: '12px', fontWeight: 'bold' }}>หน้าหลัก</div></div></Link>
        <Link to="/create" style={{ textDecoration: 'none', color: location.pathname === '/create' ? '#ea580c' : '#78716c' }}><div style={{textAlign:'center'}}><Trophy size={24} style={{ margin: '0 auto' }}/><div style={{ fontSize: '12px', fontWeight: 'bold' }}>สร้างรายการ</div></div></Link>
      </div>
    </div>
  )
}

export default App
