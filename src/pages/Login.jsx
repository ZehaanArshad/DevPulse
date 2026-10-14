import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaFacebook } from 'react-icons/fa'
import logo from '../assets/logo.gif'
import newimg from '../assets/new3.gif'
import loginimg from '../assets/logo.gif'



function Login() {
  return (
    <div className="h-screen flex flex-col bg-[#FCF2E9] font-serif">

      <div className="flex-1 min-h-0 p-8">
        <div
          // style={{ backgroundImage: `url(${newimg})` }}
          className="flex-1 min-h-0  w-full h-full bg-cover bg-center bg-no-repeat rounded-2xl flex items-center justify-center gap-5 bg-[#2877D7]/50"
        >


          <div>
            <img src={loginimg} alt="DevPulse logo" className="rounded-2xl object-cover w-200 h-180 shadow-xl border border-[#9CC0ED]" />
          </div>



          <div className="w-full max-w-md rounded-2xl p-10 text-white backdrop-blur-3xl shadow-xl border border-[#9CC0ED]">
            <img src={logo} alt="DevPulse logo" className=" h-40 w-95 object-cover rounded-2xl" />
            <h2 className="mt-6 text-3xl font-semibold text-center font-serif text-neutral-900">Welcome Back</h2>

            <form className="mt-4 flex flex-col gap-3">
              <label className="text-sm text-neutral-900">Email</label>
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
                Forgot Password ?
              </a>

              <button
                type="submit"
                className="mt-4 rounded-md bg-[#2877D7] py-2.5 font-semibold text-white hover:opacity-90"
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
              Don't have an account ?{' '}
              <Link to="/signup" className="font-bold hover:underline">
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
