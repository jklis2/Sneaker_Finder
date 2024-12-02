import AuthInput from "../components/AuthInput";
import SocialButton from "../components/SocialButton";
import Button from "../components/Button";

export default function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-stone-50 shadow-lg rounded-lg p-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Witamy ponownie!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaloguj się, aby kontynuować
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
              Lub użyj konta Sneaker Finder{" "}
            </span>
            <span className="h-px w-16 bg-gray-300"></span>
          </div>
          <div>
            <AuthInput
              type="email"
              label="Adres e-mail"
              placeholder="Enter your email"
              required
            />
            <AuthInput
              type="password"
              label="Hasło"
              placeholder="Enter your password"
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
                Zapamiętaj mnie
              </label>
            </div>
            <div className="text-sm">
              <a className="font-medium text-indigo-600">Zapomniałeś hasła?</a>
            </div>
          </div>
          <div>
            <Button name="Zaloguj się" />
          </div>

          <div className="mt-6 text-center">
            <a className="font-medium text-indigo-600">
              Nie posiadasz jeszcze konta? Zarejestruj się!
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
