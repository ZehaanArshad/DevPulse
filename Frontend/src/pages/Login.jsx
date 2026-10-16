import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/api'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebook } from 'react-icons/fa'
import logo from '../assets/logo.gif'
import lineAnimation from '../assets/lineAnimation.gif'
import loginimg from '../assets/logo.gif'



function Login() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

async function handleSubmit(e) {
  e.preventDefault()
  setError('')

  if (!userName.trim() || !password) {
    setError('Username aur password dono daalo')
    return
  }

  try {
    setLoading(true)
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
            <img src={loginimg} alt="DevPulse logo" className="rounded-2xl object-cover w-200 h-180 shadow-xl border border-[#9CC0ED]" />
          </div>



          <div className="w-full max-w-md rounded-2xl p-10 text-white backdrop-blur-3xl shadow-xl border border-[#9CC0ED]">
            <Link to="/" className="font-bold hover:underline hover:text-[#2877D7] flex items-center justify-center">
              <img src={logo} alt="DevPulse logo" className=" h-40 w-95 object-cover rounded-2xl hover:border border-[#ffff]" />
            </Link>
            <h2 className="mt-6 text-3xl font-semibold text-center font-serif text-neutral-900">Welcome Back</h2>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
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
                className="rounded-md bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none hover:border border-[#000000]/70 focus:border"
              /> */}

              <label className="text-sm text-neutral-900">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-md bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none hover:border border-[#000000]/70 focus:border"
              />

              <a href="#" className="text-sm hover:underline text-neutral-900">
                Forgot Password ?
              </a>

              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-md bg-[#2877D7] py-2.5 font-semibold text-white hover:opacity-90 hover:border border-[#000000]/70 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-neutral-900">or continue with</p>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-md bg-white py-2.5 hover:opacity-90 hover:border border-[#000000]/70"
              >
                <FcGoogle size={22} />
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-md bg-white py-2.5 hover:opacity-90 hover:border border-[#000000]/70"
              >
                <FaGithub size={22} className="text-black" />
              </button>
              
            </div>

            <p className="mt-6 text-center text-xs text-neutral-900">
              Don't have an account ?{' '}
              <Link to="/signup" className="font-bold hover:underline hover:text-[#2877D7]">
                Register for free
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

export default Login
