import RegisterForm from './RegisterForm'

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  return <RegisterFormWrapper searchParams={searchParams} />
}

async function RegisterFormWrapper({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect } = await searchParams
  return <RegisterForm redirect={redirect || '/boutique/commande'} />
}
