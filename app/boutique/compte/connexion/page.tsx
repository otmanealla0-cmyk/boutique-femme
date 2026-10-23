import LoginForm from './LoginForm'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  return <LoginFormWrapper searchParams={searchParams} />
}

async function LoginFormWrapper({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect } = await searchParams
  return <LoginForm redirect={redirect || '/boutique/compte'} />
}
