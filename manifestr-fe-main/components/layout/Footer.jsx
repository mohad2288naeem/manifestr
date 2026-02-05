import Logo from '../logo/Logo'

export default function Footer() {
  return (
    <footer className="bg-base-card-foreground text-white w-full">
      <div className="flex items-center justify-center py-20 min-h-[200px]">
        <Logo size="xl" className="brightness-0 invert" />
      </div>
    </footer>
  )
}
