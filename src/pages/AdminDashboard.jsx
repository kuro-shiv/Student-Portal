import React, {useState} from 'react'
import api from '../services/api'

export default function AdminDashboard(){
  const [activeTab, setActiveTab] = useState('students')
  const [newUsername, setNewUsername] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPass, setNewPass] = useState('')
  const [assignUserId, setAssignUserId] = useState('')
  const [assignCourseId, setAssignCourseId] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const createStudent = async () => {
    try{
      setLoading(true)
      const res = await api.post('/api/admin/students', { username: newUsername||undefined, name:newName, email:newEmail, password:newPass })
      setMsg({ type: 'success', text: `Student created: ${res.data.userId}` })
      setNewUsername('')
      setNewName('')
      setNewEmail('')
      setNewPass('')
    }catch(e){ 
      setMsg({ type: 'error', text: e.response?.data?.message || 'Error creating student' })
    } finally {
      setLoading(false)
    }
  }

  const assign = async () => {
    try{
      setLoading(true)
      const res = await api.post(`/api/admin/students/${assignUserId}/assign`, { courseId: assignCourseId })
      setMsg({ type: 'success', text: 'Course assigned successfully' })
      setAssignUserId('')
      setAssignCourseId('')
    }catch(e){ 
      setMsg({ type: 'error', text: e.response?.data?.message || 'Error assigning course' })
    } finally {
      setLoading(false)
    }
  }

  const viewSubs = async () => {
    try{
      setLoading(true)
      const res = await api.get('/api/admin/submissions')
      setSubmissions(res.data)
      setMsg(null)
    }catch(e){ 
      setMsg({ type: 'error', text: e.response?.data?.message || 'Error loading submissions' })
    } finally {
      setLoading(false)
    }
  }

  const logout = ()=>{ localStorage.clear(); window.location.href = '/login' }

  return (
    <div>
      <header>
        <div className="header-content">
          <div className="logo">AdminPortal</div>
          <div className="header-actions">
            <button className="btn-danger btn-sm" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p className="muted">Manage students, courses, and assignments</p>
        </div>

        {msg && (
          <div className={`message ${msg.type}`}>
            {msg.text}
          </div>
        )}

        {/* TABS */}
        <div style={{display: 'flex', gap: 12, marginBottom: 30, borderBottom: '1px solid var(--border)', paddingBottom: 0}}>
          {['students', 'courses', 'submissions'].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'btn-primary btn-sm' : 'btn-secondary btn-sm'}
              onClick={() => {
                setActiveTab(tab)
                if (tab === 'submissions') viewSubs()
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="grid-2">
            <div className="form-section">
              <h3>➕ Create Student</h3>
              <div className="form-group">
                <label>Username</label>
                <input placeholder="e.g., john_doe" value={newUsername} onChange={e=>setNewUsername(e.target.value)} disabled={loading} />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input placeholder="John Doe" value={newName} onChange={e=>setNewName(e.target.value)} disabled={loading} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input placeholder="john@example.com" value={newEmail} onChange={e=>setNewEmail(e.target.value)} disabled={loading} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input placeholder="Strong password" type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} disabled={loading} />
              </div>
              <button className="btn-primary" onClick={createStudent} disabled={loading}>
                {loading ? 'Creating...' : 'Create Student'}
              </button>
            </div>

            <div className="form-section">
              <h3>📋 Assign Course</h3>
              <div className="form-group">
                <label>Student Username</label>
                <input placeholder="Username" value={assignUserId} onChange={e=>setAssignUserId(e.target.value)} disabled={loading} />
              </div>
              <div className="form-group">
                <label>Course ID</label>
                <input placeholder="MongoDB ObjectID" value={assignCourseId} onChange={e=>setAssignCourseId(e.target.value)} disabled={loading} />
              </div>
              <button className="btn-primary" onClick={assign} disabled={loading}>
                {loading ? 'Assigning...' : 'Assign Course'}
              </button>
            </div>
          </div>
        )}

        {/* SUBMISSIONS TAB */}
        {activeTab === 'submissions' && (
          <div>
            <button className="btn-secondary mb-20" onClick={viewSubs} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>

            {submissions.length === 0 ? (
              <div className="card text-center">
                <p className="muted">No submissions yet</p>
              </div>
            ) : (
              <div className="grid-2">
                {submissions.map((sub, i) => (
                  <div key={i} className="card">
                    <div style={{marginBottom: 12}}>
                      <strong>{sub.studentUserId}</strong>
                      <div className="muted" style={{fontSize: 12}}>Module {sub.moduleOrder}</div>
                    </div>
                    <div style={{marginBottom: 12}}>
                      <a href={sub.link} target="_blank" rel="noopener noreferrer" style={{color: 'var(--primary)', textDecoration: 'none'}}>
                        View Submission →
                      </a>
                    </div>
                    <div style={{fontSize: 12, color: 'var(--text-secondary)'}}>
                      {new Date(sub.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
