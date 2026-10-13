import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebook } from 'react-icons/fa'
import logo from '../assets/logo.gif'
import Header from '../components/dashboard/Header'


function Login() {
  return (
    <div className='bg-[#FCF2E9]'>
      <Header />
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-6xl h-[700px] rounded-3xl bg-[#9CC0ED]/50 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-[#2877D7]/50 p-10 text-white shadow-xl">
          <img src={logo} alt="DevPulse logo" className=" h-30 w-95 object-cover" />
          <h2 className="mt-6 text-2xl font-semibold">Login</h2>

          <form className="mt-4 flex flex-col gap-3">
            <label className="text-sm">Email</label>
            <input
              type="email"
              placeholder="username@gmail.com"
              className="rounded-md bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none"
            />

            <label className="text-sm">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="rounded-md bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none"
            />

            <a href="#" className="text-sm hover:underline">
              Forgot Password?
            </a>

            <button
              type="submit"
              className="mt-4 rounded-md bg-[#0F2F63] py-2.5 font-semibold text-white hover:opacity-90"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm">or continue with</p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="flex flex-1 items-center justify-center rounded-md bg-white py-2.5 hover:opacity-90"
            >
              <FcGoogle size={22} />
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center rounded-md bg-white py-2.5 hover:opacity-90"
            >
              <FaGithub size={22} className="text-black" />
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center rounded-md bg-white py-2.5 hover:opacity-90"
            >
              <FaFacebook size={22} className="text-[#1877F2]" />
            </button>
          </div>

          <p className="mt-6 text-center text-xs">
            Account nahi hai?{' '}
            <Link to="/signup" className="font-bold hover:underline">
              Register for free
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Login
