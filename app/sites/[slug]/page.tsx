import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPublicWebsite } from '@/actions/website'
import { TemplateModern } from '@/components/website/template-modern'
import { TemplateClassic } from '@/components/website/template-classic'
import { TemplateMinimal } from '@/components/website/template-minimal'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await getPublicWebsite(slug)
  if (!data) return { title: 'Not Found' }
  return {
    title: data.clinic.name,
    description: `Book an appointment with ${data.clinic.name} online.`,
    openGraph: {
      title: data.clinic.name,
      description: `Book an appointment with ${data.clinic.name} online.`,
      type: 'website',
    },
  }
}

export default async function PublicWebsitePage({ params }: Props) {
  const { slug } = await params
  const data = await getPublicWebsite(slug)

  if (!data) notFound()

  const { clinic, website, sections, services } = data

  const props = {
    clinicName: clinic.name,
    clinicSlug: clinic.slug,
    sections,
    services,
    previewMode: false,
  }

  if (website.template === 'classic') return <TemplateClassic {...props} />
  if (website.template === 'minimal') return <TemplateMinimal {...props} />
  return <TemplateModern {...props} />
}
