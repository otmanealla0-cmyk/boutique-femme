import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12)

  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@boutique.fr' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@boutique.fr',
      password: hashedPassword,
      name: 'Admin',
    },
  })

  const categories = [
    { name: 'Vêtements', slug: 'vetements' },
    { name: 'Sacs', slug: 'sacs' },
    { name: 'Maillots de bain', slug: 'maillots-de-bain' },
    { name: 'Chaussures', slug: 'chaussures' },
    { name: 'Bijoux', slug: 'bijoux' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  console.log('✅ Base de données initialisée avec succès')
  console.log(`📧 Email admin: ${process.env.ADMIN_EMAIL || 'admin@boutique.fr'}`)
  console.log(`🔑 Mot de passe: ${process.env.ADMIN_PASSWORD || 'admin123'}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
