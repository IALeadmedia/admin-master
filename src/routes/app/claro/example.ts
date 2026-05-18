import { createFileRoute } from '@tanstack/react-router'
import { ExamplePage } from '../../../pages/example/example'

export const Route = createFileRoute('/app/claro/example')({
  component: () => ExamplePage('Claro'),
})
