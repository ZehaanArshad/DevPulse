import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebook } from 'react-icons/fa'
import logo from '../assets/logo.gif'
import lineAnimation from '../assets/lineAnimation.gif'
import signupimg from '../assets/logo.gif'

import { useNavigate } from 'react-router-dom'
import { signup, login } from '../api/api'



function Signup() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

async function handleSubmit(e) {
  e.preventDefault()
  setError('')

  if (password !== confirm) {
    setError('Passwords match nahi kar rahe')
    return
  }

  if (password.length < 8 || password.length > 64) {
    setError('Password 8 se 64 characters ke beech hona chahiye')
    return
  }

  try {
    setLoading(true)
    await signup(userName, password)
    await login(userName, password)
    navigate('/')
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
  
  return (
    <div className="h-screen flex flex-col bg-[#FCF2E9] font-serif">

      <div className="flex-1 min-h-0 p-8">
        <div
          // style={{ backgroundImage: `url(${lineAnimation})` }}
          className="flex-1 min-h-0  w-full h-full bg-cover bg-center bg-no-repeat rounded-2xl flex items-center justify-center gap-5 bg-[#2877D7]/50"
        >


          <div>
            <img src={signupimg} alt="DevPulse logo" className="rounded-2xl object-cover w-200 h-180 shadow-xl border border-[#9CC0ED]" />
          </div>



          <div className="w-full max-w-md rounded-2xl p-10 text-white backdrop-blur-3xl shadow-xl border border-[#9CC0ED]">
            <Link to="/" className="font-bold hover:underline hover:text-[#2877D7] flex items-center justify-center">
              <img src={logo} alt="DevPulse logo" className=" h-40 w-95 object-cover rounded-2xl hover:border border-[#ffff]" />
            </Link>
            <h2 className="mt-6 text-3xl font-semibold text-center font-serif text-neutral-900">Create Account</h2>

            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-1.5">
              <label className="text-sm text-neutral-900">UserName</label>
              <input
              type="text"
              placeholder="UserName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="rounded-md bg-white
              px-3 py-1.5 text-sm text-neutral-900 outline-none hover:border border-[#000000]/70 focus:border"
              />

              {/* <label className="text-sm text-neutral-900">Email</label>
              <input
                type="email"
                placeholder="username@gmail.com"
                className="rounded-md bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none hover:border border-[#000000]/70 focus:border"
              /> */}

              <label className="text-sm text-neutral-900">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none hover:border border-[#000000]/70 focus:border"
              />

              <label className="text-sm text-neutral-900">Confirm Password</label>
              <input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-md bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none hover:border border-[#000000]/70 focus:border"
              />


              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-md bg-[#2877D7] py-
              font-semibold text-white hover:opacity-90 hover:borde
              border-[#000000]/70 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Sign Up'}
                </button>

            </form>

            <p className="mt-3 text-center text-sm text-neutral-900">or continue with</p>

            <div className="mt-2 flex gap-3">
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-md bg-white py-1.5 hover:opacity-90 hover:border border-[#000000]/70"
              >
                <FcGoogle size={22} />
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-md bg-white py-1.5 hover:opacity-90 hover:border border-[#000000]/70"
              >
                <FaGithub size={22} className="text-black" />
              </button>
              
            </div>

            <p className="mt-3 text-center text-xs text-neutral-900">
              Already have an account ?{' '}
              <Link to="/login" className="font-bold hover:underline hover:text-[#2877D7]">
                Login
              </Link>
            </p>
          </div>

          <div>
            <Link to="/" className="font-bold hover:underline hover:text-[#2877D7] flex items-center justify-center">
              <div className='h-189 w-30 flex items-center justify-center'>
                <p>HomePage</p>
              </div>
            </Link>
          </div>


        </div>
      </div>
    </div>
  )
}

export default Signup
