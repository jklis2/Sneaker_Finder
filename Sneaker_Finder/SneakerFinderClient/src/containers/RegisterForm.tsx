import AuthInput from "../components/AuthInput";
import SocialButton from "../components/SocialButton";
import Button from "../components/Button";

export default function RegisterForm() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-stone-50 shadow-lg rounded-lg p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please Sign up to continue
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <SocialButton icon="/icons/google.svg" name="Google" />
            <SocialButton icon="/icons/apple.svg" name="Apple" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="h-px w-16 bg-gray-300"></span>
            <span className="text-sm font-medium text-gray-500">
              Or create Sneaker Finder account{" "}
            </span>
            <span className="h-px w-16 bg-gray-300"></span>
          </div>
          <div>
            <AuthInput
              type="name"
              label="First Name"
              placeholder="Enter your First Name"
              required
            />
            <AuthInput
              type="surname"
              label="Last Name"
              placeholder="Enter your Last Name"
              required
            />
            <AuthInput
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              required
            />
            <AuthInput
              type="gender"
              label="Gender"
              placeholder="Gender"
              required
            />
            <AuthInput
              type="date"
              label="Birth date"
              placeholder="Birth Date"
              required
            />
            <AuthInput
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
            />
            <AuthInput
              type="password"
              label="Confirm Password"
              placeholder="Confirm Password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                I accept the regulations and privacy policy
              </label>
            </div>
          </div>
          <div>
            <Button name="Sign in" />
          </div>

          <div className="mt-6 text-center">
            <a className="font-medium text-indigo-600">
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
